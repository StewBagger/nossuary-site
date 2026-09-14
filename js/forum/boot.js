// What every forum page shares: config, the API client, who is signed in, and the header's session
// area ("Sign in with Discord", or avatar + name + Sign out, plus the can't-post line).
import { createApi, describeError } from "./api.js?v=20260914-1";
import { beginSignIn, postingNote } from "./auth.js?v=20260914-1";
import { $, el, avatar, showStatus } from "./render.js?v=20260914-1";

// Used when config.js is missing the key (a browser still holding a cached config.js from before the
// forum). An explicit null in config.js switches the forum's API off. Keep in step with config.js,
// and with connect-src in every forums/**/index.html CSP.
const DEFAULT_API = "https://nossuary-forum.stewbagger.workers.dev";

export function config() {
  const cfg = window.OSSUARY || {};
  return { ...cfg, forumApiUrl: cfg.forumApiUrl === undefined ? DEFAULT_API : cfg.forumApiUrl };
}

let storage = null;
try { storage = window.localStorage; } catch { storage = null; }

export async function boot() {
  document.documentElement.classList.remove("no-js");
  const cfg = config();
  const ctx = {
    cfg,
    user: null,
    api: null,
    signIn,
    signOut,
    deleteAccount,
    onSessionChange: () => {},
  };

  ctx.api = createApi({
    base: cfg.forumApiUrl,
    fetch: (...args) => window.fetch(...args),
    storage,
    onSignedOut: () => {
      if (!ctx.user) return;
      ctx.user = null;
      renderSession(ctx);
      ctx.onSessionChange();
    },
  });

  async function signIn(button) {
    if (button) button.disabled = true;
    const result = await beginSignIn({
      api: ctx.api,
      session: window.sessionStorage,
      location: window.location,
      returnTo: `${location.pathname}${location.search}${location.hash}`,
    });
    if (result.ok) return;
    if (button) button.disabled = false;
    showStatus(result.reason === "storage"
      ? "This browser is blocking sign-in. It needs this site's session storage for the trip to Discord and back."
      : result.error ? describeError(result.error) : "Sign-in isn't available right now. Try again in a minute.");
  }

  async function signOut(button) {
    if (button) button.disabled = true;
    try { await ctx.api.logout(); } catch { /* the token is dropped locally either way */ }
    ctx.api.token.clear();
    location.reload();
  }

  async function deleteAccount(button) {
    if (!confirm("Delete your forum account? This can't be undone.\n\n"
      + "Your forum account, your sign-ins and the reports you filed are deleted, and the forum's access to your "
      + "Discord account is revoked. Your posts are emptied and shown as deleted, and your threads and posts "
      + "are shown as from [deleted member]. Staff moderation records are kept.\n\n"
      + "Your Discord account and anything Chamberlain holds are not affected.")) return;
    if (button) button.disabled = true;
    try {
      await ctx.api.deleteAccount();
    } catch (err) {
      if (button) button.disabled = false;
      showStatus(`Couldn't delete your account: ${describeError(err)}`);
      return;
    }
    ctx.api.token.clear();
    location.reload();
  }

  if (ctx.api.token.get()) {
    try {
      ctx.user = (await ctx.api.me())?.user || null;
    } catch (err) {
      // 401 already cleared the token. Anything else: stay signed in locally, say so, keep reading.
      if (err.status !== 401) showStatus(`Couldn't check your sign-in: ${describeError(err)}`, "warn");
    }
  }
  renderSession(ctx);
  return ctx;
}

export function signInButton(ctx, label = "Sign in with Discord", cls = "btn btn-primary btn-sm") {
  const b = el("button", { class: cls, type: "button", text: label });
  b.addEventListener("click", () => ctx.signIn(b));
  return b;
}

function renderSession(ctx) {
  const slot = $("#forum-session");
  const note = $("#forum-note");
  if (slot) {
    if (!ctx.user) {
      slot.replaceChildren(signInButton(ctx));
    } else {
      const out = el("button", { class: "session-out", type: "button", text: "Sign out" });
      out.addEventListener("click", () => ctx.signOut(out));
      const del = el("button", { class: "session-out danger", type: "button", text: "Delete my account" });
      del.addEventListener("click", () => ctx.deleteAccount(del));
      slot.replaceChildren(el("span", { class: "session-user" },
        avatar(ctx.user, 28),
        el("span", { class: "session-name", text: ctx.user.name || "Member" }),
        ctx.user.is_staff ? el("span", { class: "badge badge-staff", text: "Staff" }) : null),
      out, del);
    }
  }
  if (note) {
    const parts = postingNote(ctx.user, ctx.cfg.discordInvite);
    note.hidden = !parts;
    note.replaceChildren();
    if (parts) {
      note.append(el("div", { class: "wrap" },
        el("span", { class: "forum-note-text", text: parts.text }),
        parts.link ? el("a", { href: parts.link.href, target: "_blank", rel: "noopener", text: parts.link.label }) : null));
    }
  }
}
