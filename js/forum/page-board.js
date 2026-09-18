// forums/board/?b=slug[&page=N] — one board's threads.
import { boot, signInButton } from "./boot.js?v=20260918-2";
import { describeError } from "./api.js?v=20260918-2";
import {
  FORUMS, el, mount, showStatus, emptyState, breadcrumb, pagination, avatar, timeEl, count,
  boardHref, threadHref, newThreadHref, storeLink, validSlug, validId, pageParam,
} from "./render.js?v=20260918-2";

function threadRow(t) {
  return el("li", { class: `thread-row${t.pinned ? " is-pinned" : ""}` },
    avatar(t.author, 36),
    el("div", { class: "thread-main" },
      el("h3", { class: "thread-title" },
        t.pinned ? el("span", { class: "badge badge-pinned", text: "Pinned" }) : null,
        t.locked ? el("span", { class: "badge badge-locked", text: "Locked" }) : null,
        el("a", { href: threadHref(t.id), text: t.title || "Untitled" })),
      el("p", { class: "thread-meta" },
        el("span", { text: `by ${t.author?.name || "someone"}` }),
        t.author?.is_staff ? el("span", { class: "badge badge-staff", text: "Staff" }) : null,
        el("span", { "aria-hidden": "true", text: "·" }),
        timeEl(t.created_at))),
    el("div", { class: "thread-replies" },
      el("strong", { text: (t.replies ?? 0).toLocaleString("en-GB") }),
      el("span", { text: t.replies === 1 ? "reply" : "replies" })),
    el("div", { class: "thread-last" },
      el("span", { class: "sr-only", text: "Last post " }),
      timeEl(t.last_post_at || t.created_at),
      el("span", { class: "thread-last-by", text: `by ${t.last_author_name || t.author?.name || "someone"}` })));
}

/** The New thread control, or why there isn't one. */
function newThreadControl(ctx, board) {
  const reason = !ctx.user ? null
    : !ctx.user.can_post ? "Your account can't post right now — see the note at the top of the page."
    : board.staff_only_threads && !ctx.user.is_staff ? "Only staff start threads on this board. Anyone who can post can reply."
    : "";
  if (reason === "") return el("div", { class: "board-action" }, el("a", { class: "btn btn-primary", href: newThreadHref(board.slug), text: "New thread" }));
  const noteId = "new-thread-why";
  return el("div", { class: "board-action" },
    el("button", { class: "btn btn-primary", type: "button", disabled: true, "aria-describedby": noteId, text: "New thread" }),
    el("p", { class: "board-action-note small", id: noteId },
      reason === null ? signInButton(ctx, "Sign in with Discord", "link-button") : reason,
      reason === null ? " to start a thread." : null));
}

async function main() {
  const ctx = await boot();
  const query = new URLSearchParams(location.search);
  const slug = query.get("b");
  const page = pageParam(query.get("page"));
  if (!validSlug(slug)) {
    mount(emptyState("Board not found", "That link doesn't point at a board.", el("a", { class: "btn btn-ghost", href: FORUMS, text: "All forums" })));
    return;
  }

  let data;
  try {
    data = await ctx.api.board(slug, page);
  } catch (err) {
    if (err.status === 404) {
      mount(emptyState("Board not found", "It may have been renamed or removed.", el("a", { class: "btn btn-ghost", href: FORUMS, text: "All forums" })));
    } else {
      showStatus(describeError(err));
      mount(emptyState("This board couldn't be loaded", "Try again in a minute."));
    }
    return;
  }

  const board = { ...data.board, slug: validSlug(data.board?.slug) ? data.board.slug : slug };
  const threads = (data.threads || []).filter((t) => validId(t.id));
  const pages = Number(data.pages) || 1;
  document.title = `${board.name || "Board"} · Forums · Null Ossuary`;
  const store = storeLink(board);

  const pager = () => pagination(Number(data.page) || page, pages, (n) => boardHref(board.slug, n));
  mount(
    breadcrumb([
      { label: "Forums", href: FORUMS },
      { label: board.category?.name || "Forum", href: validSlug(board.category?.slug) ? `${FORUMS}#c-${board.category.slug}` : FORUMS },
      { label: board.name || board.slug },
    ]),
    el("header", { class: "board-head" },
      el("div", {},
        el("p", { class: "eyebrow", text: board.category?.name || "Forum" }),
        el("h1", { text: board.name || board.slug }),
        board.description ? el("p", { class: "muted", text: board.description }) : null,
        store ? el("p", { class: "board-flags" }, el("a", { class: "chip-link", href: store.href, target: "_blank", rel: "noopener", text: store.long })) : null),
      newThreadControl(ctx, board)),
    threads.length
      ? el("section", { "aria-label": "Threads" },
        el("div", { class: "thread-list-head", "aria-hidden": "true" },
          el("span", { text: pages > 1 ? `Threads · page ${data.page || page} of ${pages}` : count(threads.length, "thread") }),
          el("span", { text: "Replies" }), el("span", { text: "Last post" })),
        el("ul", { class: "card thread-list" }, ...threads.map(threadRow)),
        pager())
      : emptyState(page > 1 ? "No threads on this page" : "No threads yet",
        page > 1 ? null : "Be the first to start one.",
        page > 1 ? el("a", { class: "btn btn-ghost", href: boardHref(board.slug), text: "First page" }) : null));
}

main();
