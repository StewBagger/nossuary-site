// Show the "Controls" link only to someone who can actually use it.
//
// NOT a security boundary and not pretending to be one: /admin/ refuses without a
// session, 2FA and a per-server grant, and Chamberlain refuses again before touching
// anything. This is about not offering a door to people it will not open for --
// which is also why it fails CLOSED. Anything unexpected leaves the link hidden.
//
// The check is the same question the page itself asks: does this member have any
// server at all? A member with a session but no grant sees nothing on /admin/, so
// showing them the link would be a promise the page does not keep.
import { DEFAULT_API, TOKEN_KEY, createApi } from "./api.js?v=20260922-2";

const LINK_ID = "nav-controls";

function config() {
  const cfg = window.OSSUARY || {};
  return cfg.portalApiUrl === undefined ? DEFAULT_API : cfg.portalApiUrl;
}

export async function revealControlsLink(doc = document) {
  const link = doc.getElementById(LINK_ID);
  if (!link) return false;
  let token = null;
  try {
    token = window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return false;      // no storage, no signed-in member, nothing to reveal
  }
  if (!token) return false;
  const api = createApi({ base: config(), token });
  if (!api.configured) return false;
  try {
    const { servers } = await api.servers();
    if (!Array.isArray(servers) || servers.length === 0) return false;
    link.hidden = false;
    return true;
  } catch {
    // A 401, a 403 (no 2FA), a network failure -- all of them mean "do not offer it".
    return false;
  }
}

revealControlsLink();
