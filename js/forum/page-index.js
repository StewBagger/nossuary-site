// forums/ — every category with its boards. The board list is whatever the API says; nothing here
// knows which boards exist.
import { boot } from "./boot.js?v=20260914-1";
import { describeError } from "./api.js?v=20260914-1";
import { el, mount, showStatus, emptyState, boardHref, threadHref, workshopHref, timeEl, count, validSlug, validId } from "./render.js?v=20260914-1";

function lastPost(last) {
  if (!last || !validId(last.thread_id)) return el("span", { class: "muted", text: "No posts yet" });
  return el("span", { class: "last" },
    el("a", { href: threadHref(last.thread_id), class: "last-title", text: last.title || "Untitled" }),
    el("span", { class: "last-meta" },
      el("span", { text: last.author_name || "Someone" }),
      " · ",
      timeEl(last.at)));
}

function boardRow(b) {
  const ws = workshopHref(b.workshop_id);
  return el("li", { class: "board-row" },
    el("div", { class: "board-main" },
      el("h3", { class: "board-name" }, el("a", { href: boardHref(b.slug), text: b.name || b.slug })),
      b.description ? el("p", { class: "muted small", text: b.description }) : null,
      ws || b.staff_only_threads ? el("p", { class: "board-flags" },
        ws ? el("a", { class: "chip-link", href: ws, target: "_blank", rel: "noopener", text: "Workshop ↗", "aria-label": `${b.name} on Steam Workshop` }) : null,
        b.staff_only_threads ? el("span", { class: "badge", text: "Staff threads" }) : null) : null),
    el("dl", { class: "board-counts" },
      el("div", {}, el("dt", { text: "Threads" }), el("dd", { text: (b.threads ?? 0).toLocaleString("en-GB") })),
      el("div", {}, el("dt", { text: "Posts" }), el("dd", { text: (b.posts ?? 0).toLocaleString("en-GB") }))),
    el("div", { class: "board-last" }, lastPost(b.last)));
}

async function main() {
  const ctx = await boot();
  let data;
  try {
    data = await ctx.api.categories();
  } catch (err) {
    showStatus(describeError(err));
    mount(emptyState("The forums couldn't be loaded", "Try again in a minute. The Discord is open in the meantime."));
    return;
  }
  const cats = Array.isArray(data.categories) ? data.categories : [];
  if (!cats.length) {
    mount(emptyState("No boards yet", "The forums are being set up."));
    return;
  }
  const nodes = cats.map((c) => {
    const boards = (c.boards || []).filter((b) => validSlug(b.slug));
    const id = validSlug(c.slug) ? `c-${c.slug}` : null;
    return el("section", { class: "category", id, "aria-labelledby": id ? `${id}-h` : null },
      el("header", { class: "category-head" },
        el("h2", { id: id ? `${id}-h` : null, text: c.name || "Forum" }),
        c.description ? el("p", { class: "muted", text: c.description }) : null,
        el("p", { class: "category-count", text: count(boards.length, "board") })),
      boards.length
        ? el("ul", { class: "card board-list" }, ...boards.map(boardRow))
        : el("p", { class: "muted", text: "No boards here yet." }));
  });
  mount(...nodes);
}

main();
