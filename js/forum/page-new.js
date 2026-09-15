// forums/new/?b=slug — start a thread: title + body with a live preview.
import { boot, signInButton } from "./boot.js?v=20260915-2";
import { describeError, LIMITS } from "./api.js?v=20260915-2";
import { composer } from "./composer.js?v=20260915-2";
import { FORUMS, el, mount, showStatus, emptyState, breadcrumb, boardHref, threadHref, validSlug, validId } from "./render.js?v=20260915-2";

async function main() {
  const ctx = await boot();
  const slug = new URLSearchParams(location.search).get("b");
  if (!validSlug(slug)) {
    mount(emptyState("Board not found", "Start a thread from the board you want it on.", el("a", { class: "btn btn-ghost", href: FORUMS, text: "All forums" })));
    return;
  }

  let board;
  try {
    board = (await ctx.api.board(slug, 1)).board || {};
  } catch (err) {
    if (err.status === 404) mount(emptyState("Board not found", "It may have been renamed or removed.", el("a", { class: "btn btn-ghost", href: FORUMS, text: "All forums" })));
    else { showStatus(describeError(err)); mount(emptyState("This board couldn't be loaded", "Try again in a minute.")); }
    return;
  }
  document.title = `New thread in ${board.name || slug} · Forums · Null Ossuary`;

  const crumbs = breadcrumb([
    { label: "Forums", href: FORUMS },
    { label: board.category?.name || "Forum", href: validSlug(board.category?.slug) ? `${FORUMS}#c-${board.category.slug}` : FORUMS },
    { label: board.name || slug, href: boardHref(slug) },
    { label: "New thread" },
  ]);
  const head = el("header", { class: "board-head" },
    el("div", {},
      el("p", { class: "eyebrow", text: board.name || "New thread" }),
      el("h1", { text: "Start a thread" }),
      el("p", { class: "muted", text: "Anyone can read what you post here. Keep it on topic for the board." })));

  const blocked = !ctx.user ? "signin"
    : !ctx.user.can_post ? "Your account can't post right now — see the note at the top of the page."
    : board.staff_only_threads && !ctx.user.is_staff ? "Only staff start threads on this board. You can still reply to threads on it."
    : null;
  if (blocked) {
    mount(crumbs, head, blocked === "signin"
      ? emptyState("Sign in to start a thread", "Posting is for members of the Null Ossuary Discord.", signInButton(ctx, "Sign in with Discord", "btn btn-primary"), el("a", { class: "btn btn-ghost", href: boardHref(slug), text: "Back to the board" }))
      : emptyState("You can't start a thread here", blocked, el("a", { class: "btn btn-ghost", href: boardHref(slug), text: "Back to the board" })));
    return;
  }

  const title = el("input", { id: "nt-title", name: "title", required: true, minlength: LIMITS.titleMin, maxlength: LIMITS.titleMax, autocomplete: "off", "aria-describedby": "nt-title-hint" });
  const titleHint = el("p", { class: "composer-hint small", id: "nt-title-hint" }, el("span", { text: `${LIMITS.titleMin}–${LIMITS.titleMax} characters` }), el("span", { class: "composer-count" }));
  const count = () => { titleHint.lastChild.textContent = `${title.value.length} / ${LIMITS.titleMax}`; };
  title.addEventListener("input", count);
  count();

  const box = composer({ label: "Post", rows: 12, placeholder: "What's on your mind?" });
  const send = el("button", { class: "btn btn-primary", type: "submit", text: "Post thread" });
  const status = el("p", { class: "form-status small", role: "status", "aria-live": "polite" });
  const form = el("form", { class: "card form new-thread", novalidate: true },
    el("div", { class: "field" }, el("label", { for: "nt-title", text: "Title" }), title, titleHint),
    box.root,
    el("div", { class: "form-row" }, send, el("a", { class: "btn btn-ghost", href: boardHref(slug), text: "Cancel" })),
    status);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const t = title.value.trim();
    if (t.length < LIMITS.titleMin || t.length > LIMITS.titleMax) {
      status.textContent = `Titles need ${LIMITS.titleMin}–${LIMITS.titleMax} characters.`;
      title.focus();
      return;
    }
    const problem = box.problem();
    if (problem) { status.textContent = problem; box.textarea.focus(); return; }
    send.disabled = true;
    status.textContent = "Posting…";
    try {
      const res = await ctx.api.newThread(slug, t, box.value());
      if (!validId(res?.thread_id)) throw new Error("bad response");
      location.assign(threadHref(res.thread_id));
    } catch (err) {
      status.textContent = err.name === "ApiError" ? describeError(err) : "Something went wrong. Try again.";
      send.disabled = false;
    }
  });

  mount(crumbs, head, form);
  title.focus();
}

main();
