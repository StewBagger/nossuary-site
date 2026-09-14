// Sign in with Discord for the forum. No DOM here: the pages pass in storage, location and the API.
//
// TAB BINDING (the same rule as js/link.js). The sign-in click stores the OAuth `state` it was handed
// in this tab's sessionStorage; forums/auth/ trades a code only when the state coming back is exactly
// that one, and spends it either way. Without it, a code+state link started by someone else could be
// opened in a victim's browser and sign the victim in as the sender (login CSRF) — everything the
// victim then posted would go out under the sender's name, and vice versa.
//
// RETURN PATH. Where to go after signing in is also kept in sessionStorage, and is only ever honoured
// as a same-origin path under /forums/ (never forums/auth/ itself), so the callback cannot be used
// as an open redirect.

export const STATE_KEY = "nossuary.forum.oauthState";
export const RETURN_KEY = "nossuary.forum.returnTo";
export const DEFAULT_RETURN = "/forums/";
export const DISCORD_ORIGIN = "https://discord.com";

/** A path to send the browser to after sign-in: `value` if it is a same-origin /forums/ path, else /forums/. */
export function safeReturnPath(value, origin) {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//") || value.length > 600) return DEFAULT_RETURN;
  if (/[\\\u0000-\u001f\u007f]/.test(value)) return DEFAULT_RETURN;
  let url;
  try {
    url = new URL(value, origin);
  } catch {
    return DEFAULT_RETURN;
  }
  if (url.origin !== new URL(origin).origin) return DEFAULT_RETURN;
  if (!url.pathname.startsWith("/forums/") || url.pathname.startsWith("/forums/auth")) return DEFAULT_RETURN;
  // Re-serialised from the parsed URL, so what is used is what was checked.
  return `${url.pathname}${url.search}${url.hash}`;
}

/** One-shot sessionStorage read: the value, then it is gone. null when absent or storage is blocked. */
export function takeStored(storage, key) {
  try {
    const value = storage.getItem(key);
    storage.removeItem(key);
    return value;
  } catch {
    return null;
  }
}

/**
 * The sign-in click. Asks the API for Discord's authorize URL, ties its state to this tab, remembers
 * where to come back to, and navigates. Resolves {ok:false, reason} instead of navigating on failure;
 * reason is "storage", "bad_url" or an ApiError.
 */
export async function beginSignIn({ api, session, location, returnTo }) {
  let answer;
  try {
    answer = await api.authStart();
  } catch (err) {
    return { ok: false, reason: "api", error: err };
  }
  let next;
  try {
    next = new URL(answer?.url);
  } catch {
    return { ok: false, reason: "bad_url" };
  }
  const state = next.searchParams.get("state");
  // Only ever on to Discord itself, whatever the answer says.
  if (next.origin !== DISCORD_ORIGIN || !state) return { ok: false, reason: "bad_url" };
  try {
    session.setItem(STATE_KEY, state);
    session.setItem(RETURN_KEY, safeReturnPath(returnTo, location.origin));
  } catch {
    return { ok: false, reason: "storage" };
  }
  location.assign(next.href);
  return { ok: true };
}

/**
 * forums/auth/. `query` is the URLSearchParams read before the address bar was cleaned. Stores the
 * token and resolves {ok:true, returnTo}, or {ok:false, reason, returnTo, error?} having stored nothing.
 * reason: "cancelled" | "missing" | "tab" | "api" | "bad_response" | "storage"
 */
export async function completeSignIn({ query, session, api, origin }) {
  const expected = takeStored(session, STATE_KEY);   // one return per click
  const returnTo = safeReturnPath(takeStored(session, RETURN_KEY), origin);
  if (query.has("error")) return { ok: false, reason: query.get("error") === "access_denied" ? "cancelled" : "discord", returnTo };
  const code = query.get("code");
  const state = query.get("state");
  if (!code || !state) return { ok: false, reason: "missing", returnTo };
  if (!expected || state !== expected) return { ok: false, reason: "tab", returnTo };

  let answer;
  try {
    answer = await api.authExchange(code, state);
  } catch (err) {
    return { ok: false, reason: "api", error: err, returnTo };
  }
  if (!answer || typeof answer.token !== "string" || !answer.token) return { ok: false, reason: "bad_response", returnTo };
  if (!api.token.set(answer.token)) return { ok: false, reason: "storage", returnTo };
  return { ok: true, returnTo, user: answer.user || null };
}

/**
 * The one line shown under the header when a signed-in member cannot post, as plain parts:
 * {text, link?: {label, href}} or null when there is nothing to say.
 */
export function postingNote(user, discordInvite) {
  if (!user || user.can_post) return null;
  const invite = typeof discordInvite === "string" && /^https:\/\/discord\.(gg|com)\//.test(discordInvite) ? discordInvite : null;
  switch (user.reason) {
    case "not_member":
      return { text: "You're signed in, but posting is for members of the Null Ossuary Discord.", link: invite ? { label: "Join the Discord", href: invite } : null };
    case "screening":
      return { text: "You're signed in, but you haven't finished the rules screening yet. Finish it in the Null Ossuary Discord, then reload this page." };
    case "timeout":
      return { text: "You're timed out in the Null Ossuary Discord, so you can read but not post until it ends." };
    default:
      return { text: "You're signed in, but posting isn't available on your account right now." };
  }
}
