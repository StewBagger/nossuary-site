// A post-body textarea with a character count, a formatting hint and a live preview rendered by the
// same renderer the thread page uses — so what you see is what gets shown.
import { renderMarkdown } from "./markdown.js?v=20260918-2";
import { LIMITS } from "./api.js?v=20260918-2";
import { el } from "./render.js?v=20260918-2";

let seq = 0;

export function composer({ label = "Message", value = "", rows = 8, placeholder = "", previewLabel = "Preview" } = {}) {
  const id = `composer-${++seq}`;
  const textarea = el("textarea", {
    id, name: "body", rows, maxlength: LIMITS.bodyMax, required: true, placeholder: placeholder || null,
    "aria-describedby": `${id}-hint ${id}-count`,
  });
  textarea.value = value;
  const counter = el("span", { class: "composer-count", id: `${id}-count`, "aria-live": "off" });
  const preview = el("div", { class: "post-body composer-preview-body" });
  const previewBox = el("section", { class: "composer-preview", "aria-label": previewLabel },
    el("p", { class: "composer-preview-label", text: previewLabel }), preview);

  let timer = null;
  const update = () => {
    const n = textarea.value.length;
    counter.textContent = `${n.toLocaleString("en-GB")} / ${LIMITS.bodyMax.toLocaleString("en-GB")}`;
    counter.classList.toggle("over", n > LIMITS.bodyMax * 0.95);
    const empty = !textarea.value.trim();
    previewBox.hidden = empty;
    preview.replaceChildren(empty ? "" : renderMarkdown(textarea.value, document));
  };
  textarea.addEventListener("input", () => {
    clearTimeout(timer);
    timer = setTimeout(update, 120);
  });
  update();

  const root = el("div", { class: "composer" },
    el("div", { class: "field" },
      el("label", { for: id, text: label }),
      textarea,
      el("p", { class: "composer-hint small", id: `${id}-hint` },
        el("span", { text: "**bold**  *italic*  `code`  ``` code block  > quote  - list  [link](https://…)" }),
        counter)),
    previewBox);

  return {
    root,
    textarea,
    value: () => textarea.value,
    clear: () => { textarea.value = ""; update(); },
    /** A reason the body can't be sent, or null. */
    problem: () => {
      const v = textarea.value;
      if (!v.trim()) return "Write something first.";
      if (v.length > LIMITS.bodyMax) return `Posts can be at most ${LIMITS.bodyMax.toLocaleString("en-GB")} characters.`;
      return null;
    },
  };
}
