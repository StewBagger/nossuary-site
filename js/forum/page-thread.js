// forums/thread/?t=id[&page=N][#p-ID] — a thread's posts, the reply box, per-post actions and the
// staff tools. Post bodies go through markdown.js (DOM nodes only); everything else is textContent.
import { boot, signInButton } from "./boot.js?v=20260915-1";
import { describeError } from "./api.js?v=20260915-1";
import { renderMarkdown } from "./markdown.js?v=20260915-1";
import { composer } from "./composer.js?v=20260915-1";
import {
  FORUMS, el, mount, showStatus, emptyState, breadcrumb, pagination, avatar, timeEl, absoluteTime,
  boardHref, threadHref, validSlug, validId, pageParam, postPermissions, staffBadge,
} from "./render.js?v=20260915-1";

let ctx;
let threadId;
let page;

/** Run an API call from a button: disables it while running, reports failure next to it. Resolves the result or undefined. */
async function act(button, statusEl, fn) {
  if (button) button.disabled = true;
  if (statusEl) statusEl.textContent = "";
  try {
    return await fn();
  } catch (err) {
    const msg = describeError(err);
    if (statusEl) statusEl.textContent = msg;
    else showStatus(msg);
    return undefined;
  } finally {
    if (button && button.isConnected) button.disabled = false;
  }
}

const reload = (toPage = page, postId = null) => {
  const href = threadHref(threadId, toPage, postId);
  // Assigning the same address with only a new #fragment would not fetch anything: reload instead.
  if (href.split("#")[0] === `${location.pathname}${location.search}`) {
    history.replaceState(null, "", href);
    location.reload();
  } else {
    location.assign(href);
  }
};

// --- Posts ---------------------------------------------------------------------

function postArticle(post, thread) {
  const perms = postPermissions(ctx.user, post, thread);
  const author = post.author || {};
  const status = el("p", { class: "post-status small", role: "status", "aria-live": "polite" });
  const body = el("div", { class: "post-body" });

  if (post.deleted) {
    body.classList.add("post-deleted");
    body.append(el("p", { text: "This post was deleted." }));
  } else {
    body.append(renderMarkdown(post.body, document));
  }

  const actions = el("div", { class: "post-actions" });
  const addAction = (label, handler, cls = "") => {
    const b = el("button", { class: `post-action ${cls}`.trim(), type: "button", text: label });
    b.addEventListener("click", () => handler(b));
    actions.append(b);
  };

  if (perms.edit) addAction("Edit", () => startEdit(post, body, actions, status));
  if (perms.delete) {
    addAction("Delete", async (b) => {
      if (!confirm("Delete this post? This can't be undone from the forum.")) return;
      const ok = await act(b, status, () => ctx.api.deletePost(post.id));
      if (ok !== undefined) reload(page, post.id);
    }, "danger");
  }
  if (perms.report) {
    addAction("Report", async (b) => {
      const reason = prompt("What's wrong with this post? Staff will see your reason.");
      if (reason === null) return;
      if (!reason.trim()) { status.textContent = "Add a reason so staff know what to look at."; return; }
      const ok = await act(b, status, () => ctx.api.reportPost(post.id, reason.trim().slice(0, 500)));
      if (ok !== undefined) {
        status.textContent = "Reported. Thanks — staff will take a look.";
        b.remove();
      }
    });
  }

  const pid = validId(post.id) ? `p-${post.id}` : null;
  return el("article", { class: `card post${post.deleted ? " is-deleted" : ""}${author.is_staff ? " is-staff" : ""}`, id: pid, tabindex: "-1", "aria-label": `Post by ${author.name || "someone"}` },
    el("aside", { class: "post-author" },
      avatar(author, 56),
      el("span", { class: "post-author-name", text: author.name || "Someone" }),
      author.is_staff ? staffBadge() : null),
    el("div", { class: "post-content" },
      el("header", { class: "post-head" },
        el("span", { class: "post-head-name", text: author.name || "Someone" }),
        author.is_staff ? staffBadge() : null,
        pid ? el("a", { class: "post-time", href: `#${pid}`, "aria-label": `Link to this post, ${absoluteTime(post.created_at)}` }, timeEl(post.created_at)) : timeEl(post.created_at),
        post.edited_at && !post.deleted ? el("span", { class: "post-edited", title: `Edited ${absoluteTime(post.edited_at)}`, text: "edited" }) : null),
      body,
      actions.childElementCount ? actions : null,
      status));
}

function startEdit(post, body, actions, status) {
  const box = composer({ label: "Edit post", value: post.body, rows: 8, previewLabel: "Preview" });
  const save = el("button", { class: "btn btn-primary btn-sm", type: "submit", text: "Save" });
  const cancel = el("button", { class: "btn btn-ghost btn-sm", type: "button", text: "Cancel" });
  const form = el("form", { class: "post-edit" }, box.root, el("div", { class: "form-row" }, save, cancel));
  const original = [...body.childNodes];
  body.replaceChildren(form);
  actions.hidden = true;
  box.textarea.focus();

  cancel.addEventListener("click", () => {
    body.replaceChildren(...original);
    actions.hidden = false;
    status.textContent = "";
  });
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const problem = box.problem();
    if (problem) { status.textContent = problem; return; }
    const ok = await act(save, status, () => ctx.api.editPost(post.id, box.value()));
    if (ok !== undefined) reload(page, post.id);
  });
}

// --- Reply ---------------------------------------------------------------------

function replySection(thread) {
  const head = el("h2", { class: "reply-title", id: "reply-title", text: "Reply" });
  const wrap = (...children) => el("section", { class: "card reply", "aria-labelledby": "reply-title" }, head, ...children);

  if (thread.locked && !ctx.user?.is_staff) {
    return wrap(el("p", { class: "muted", text: "This thread is locked. No new replies." }));
  }
  if (!ctx.user) {
    return wrap(el("p", { class: "muted", text: "Anyone can read. To reply, sign in with Discord — posting is for members of the Null Ossuary Discord." }),
      el("p", {}, signInButton(ctx, "Sign in with Discord to reply", "btn btn-primary")));
  }
  if (!ctx.user.can_post) {
    return wrap(el("p", { class: "muted", text: "Your account can't post right now — see the note at the top of the page." }));
  }

  const box = composer({ label: "Your reply", rows: 7, placeholder: "Be useful, be civil." });
  const send = el("button", { class: "btn btn-primary", type: "submit", text: "Post reply" });
  const status = el("p", { class: "form-status small", role: "status", "aria-live": "polite" });
  const form = el("form", { class: "form reply-form", novalidate: true },
    thread.locked ? el("p", { class: "reply-locked small", text: "Locked thread — you can reply as staff." }) : null,
    box.root, send, status);
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const problem = box.problem();
    if (problem) { status.textContent = problem; box.textarea.focus(); return; }
    const res = await act(send, status, () => ctx.api.reply(threadId, box.value()));
    if (res) {
      status.textContent = "Posted.";
      reload(pageParam(String(res.page)), res.post_id);
    }
  });
  return wrap(form);
}

// --- Staff tools ---------------------------------------------------------------

function staffTools(thread) {
  const status = el("p", { class: "staff-status small", role: "status", "aria-live": "polite" });
  const row = el("div", { class: "staff-buttons" });
  const add = (label, handler, cls = "btn btn-ghost btn-sm") => {
    const b = el("button", { class: cls, type: "button", text: label });
    b.addEventListener("click", () => handler(b));
    row.append(b);
  };
  const toggle = (on, yes, no) => async (b) => {
    const ok = await act(b, status, () => ctx.api.threadAction(threadId, on ? no : yes));
    if (ok !== undefined) reload();
  };
  add(thread.pinned ? "Unpin" : "Pin", toggle(thread.pinned, "pin", "unpin"));
  add(thread.locked ? "Unlock" : "Lock", toggle(thread.locked, "lock", "unlock"));

  const moveForm = el("form", { class: "staff-move", hidden: true });
  add("Move…", async (b) => {
    if (!moveForm.hidden) { moveForm.hidden = true; return; }
    const data = await act(b, status, () => ctx.api.categories());
    if (!data) return;
    const select = el("select", { id: "move-board", name: "board" });
    for (const c of data.categories || []) {
      const group = el("optgroup", { label: c.name || c.slug || "Forum" });
      for (const bd of c.boards || []) {
        if (!validSlug(bd.slug)) continue;
        group.append(el("option", { value: bd.slug, selected: bd.slug === thread.board?.slug, text: bd.name || bd.slug }));
      }
      select.append(group);
    }
    const go = el("button", { class: "btn btn-primary btn-sm", type: "submit", text: "Move thread" });
    moveForm.replaceChildren(el("label", { for: "move-board", text: "Move to board" }), select, go);
    moveForm.hidden = false;
    select.focus();
    moveForm.onsubmit = async (e) => {
      e.preventDefault();
      if (select.value === thread.board?.slug) { status.textContent = "It's already on that board."; return; }
      const ok = await act(go, status, () => ctx.api.moveThread(threadId, select.value));
      if (ok !== undefined) reload(1);
    };
  });
  add("Delete thread", async (b) => {
    if (!confirm(`Delete the whole thread "${thread.title}" and every post in it?`)) return;
    const ok = await act(b, status, () => ctx.api.deleteThread(threadId));
    if (ok !== undefined) location.assign(validSlug(thread.board?.slug) ? boardHref(thread.board.slug) : FORUMS);
  }, "btn btn-ghost btn-sm danger");

  return el("section", { class: "staff-tools", "aria-label": "Staff tools" },
    el("span", { class: "staff-label", text: "Staff" }), row, moveForm, status);
}

// --- Page ------------------------------------------------------------------------

async function main() {
  ctx = await boot();
  const query = new URLSearchParams(location.search);
  threadId = query.get("t");
  page = pageParam(query.get("page"));
  if (!validId(threadId)) {
    mount(emptyState("Thread not found", "That link doesn't point at a thread.", el("a", { class: "btn btn-ghost", href: FORUMS, text: "All forums" })));
    return;
  }

  let data;
  try {
    data = await ctx.api.thread(threadId, page);
  } catch (err) {
    if (err.status === 404) {
      mount(emptyState("Thread not found", "It may have been moved or deleted.", el("a", { class: "btn btn-ghost", href: FORUMS, text: "All forums" })));
    } else {
      showStatus(describeError(err));
      mount(emptyState("This thread couldn't be loaded", "Try again in a minute."));
    }
    return;
  }
  // If a 401 during load signed us out, the actions drawn for the old user are wrong: redraw.
  ctx.onSessionChange = () => draw(data);
  draw(data);
}

function draw(data) {
  const thread = data.thread || {};
  const posts = (data.posts || []).filter((p) => validId(p.id));
  const pages = Number(data.pages) || 1;
  page = Number(data.page) || page;
  document.title = `${thread.title || "Thread"} · Forums · Null Ossuary`;
  const boardSlug = validSlug(thread.board?.slug) ? thread.board.slug : null;
  const pager = () => pagination(page, pages, (n) => threadHref(threadId, n));

  mount(
    breadcrumb([
      { label: "Forums", href: FORUMS },
      { label: thread.category?.name || "Forum", href: validSlug(thread.category?.slug) ? `${FORUMS}#c-${thread.category.slug}` : FORUMS },
      { label: thread.board?.name || "Board", href: boardSlug ? boardHref(boardSlug) : FORUMS },
      { label: thread.title || "Thread" },
    ]),
    el("header", { class: "thread-head" },
      el("p", { class: "eyebrow", text: thread.board?.name || "Thread" }),
      el("h1", { text: thread.title || "Untitled" }),
      el("p", { class: "thread-head-meta" },
        thread.pinned ? el("span", { class: "badge badge-pinned", text: "Pinned" }) : null,
        thread.locked ? el("span", { class: "badge badge-locked", text: "Locked" }) : null,
        el("span", { class: "muted small" }, "Started ", timeEl(thread.created_at)),
        pages > 1 ? el("span", { class: "muted small", text: ` · page ${page} of ${pages}` }) : null)),
    ctx.user?.is_staff ? staffTools(thread) : null,
    pages > 1 ? pager() : null,
    posts.length ? el("div", { class: "posts" }, ...posts.map((p) => postArticle(p, thread))) : emptyState("No posts on this page", null, el("a", { class: "btn btn-ghost", href: threadHref(threadId), text: "First page" })),
    pager(),
    page === pages || pages <= 1 ? replySection(thread) : el("p", { class: "muted reply-elsewhere" }, "Replies go on the ", el("a", { href: `${threadHref(threadId, pages)}#reply-title`, text: "last page" }), "."));

  const target = /^#p-[A-Za-z0-9_-]{1,64}$/.test(location.hash) ? document.getElementById(location.hash.slice(1)) : null;
  if (target) {
    target.classList.add("is-target");
    target.scrollIntoView({ block: "start" });
    target.focus({ preventScroll: true });
  }
}

main();
