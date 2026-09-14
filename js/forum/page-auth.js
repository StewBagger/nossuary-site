// forums/auth/ — Discord returns here with ?code&state. The query is read and stripped from the
// address bar before anything else runs; the code is traded only when the state is the one this tab
// stored on the sign-in click (auth.js, TAB BINDING), and then the browser goes back to where it was.
import { createApi, describeError } from "./api.js?v=20260913-3";
import { completeSignIn } from "./auth.js?v=20260913-3";
import { config } from "./boot.js?v=20260913-3";

const query = new URLSearchParams(location.search);
if (location.search || location.hash) history.replaceState(null, "", location.pathname);
document.documentElement.classList.remove("no-js");

const $ = (id) => document.getElementById(id);
const MESSAGES = {
  cancelled: ["∅ not signed in", "Sign-in was cancelled", "Nothing changed. You can sign in again from any forum page."],
  discord: ["∅ not signed in", "Discord didn't complete the sign-in", "Nothing changed. Try again from the forum."],
  missing: ["∅ nothing to finish", "There's no sign-in to finish here", "This page completes a Discord sign-in. Start one with Sign in with Discord on the forum."],
  tab: ["∅ not signed in", "This sign-in didn't start in this browser tab", "For your safety a sign-in has to finish in the tab that started it. Press Sign in with Discord again."],
  storage: ["∅ not signed in", "This browser is blocking sign-in", "Signing in needs this site's storage. Allow it for nossuary.com, then try again."],
  bad_response: ["∅ not signed in", "Something went wrong", "The forum's answer didn't make sense. Try again in a minute."],
};

function show(state, eyebrow, title, line) {
  document.body.classList.remove("signin-pending", "signin-error", "signin-ok");
  document.body.classList.add(`signin-${state}`);
  $("signin-eyebrow").textContent = eyebrow;
  $("signin-title").textContent = title;
  $("signin-line").textContent = line;
  document.title = `${title} · Null Ossuary`;
}

const cfg = config();
let local = null;
let session = null;
try { local = window.localStorage; session = window.sessionStorage; } catch { /* blocked: handled as "storage"/"tab" below */ }
const api = createApi({ base: cfg.forumApiUrl, fetch: (...a) => window.fetch(...a), storage: local });
const result = session
  ? await completeSignIn({ query, session, api, origin: location.origin })
  : { ok: false, reason: "storage", returnTo: "/forums/" };

const back = $("signin-retry");
back.href = result.returnTo;
if (result.ok) {
  show("ok", "Sign in with Discord", `Signed in${result.user?.name ? ` as ${result.user.name}` : ""}`, "Taking you back to the forum…");
  location.replace(result.returnTo);
} else {
  const [eyebrow, title, line] = result.reason === "api"
    ? ["∅ not signed in", "Sign-in didn't go through", describeError(result.error)]
    : MESSAGES[result.reason] || MESSAGES.bad_response;
  show("error", eyebrow, title, line);
  back.hidden = false;
}
