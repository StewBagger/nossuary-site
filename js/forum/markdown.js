// Forum post bodies: RAW text in, DOM nodes out. The API stores what the member typed and this is
// the only thing that turns it into markup, so it is the forum's XSS boundary.
//
// Two halves, kept apart so the parser can be tested in plain node:
//   parseMarkdown(text) -> a tree of plain objects, every string in it still just text
//   renderMarkdown(text, document) -> that tree as a DocumentFragment, built with createElement/createTextNode
// Nothing here ever assigns innerHTML or builds an HTML string. The tag names are fixed below, and
// the only attributes ever set are href (a URL that passed safeUrl), rel and target on links.
//
// The subset: paragraphs, line breaks, **bold**, *italic*, `inline code`, ``` fenced code blocks,
// > quotes, - lists, [text](https://…) links (http/https only) and bare https:// URLs. No images,
// no HTML, no headings: anything else stays exactly the text that was typed.

const MAX_QUOTE_DEPTH = 4;
const MAX_INLINE_DEPTH = 6;
const LINK_REL = "noopener nofollow ugc";

/** The URL as the browser will see it, or null unless it is plainly http(s) with a host and no credentials. */
export function safeUrl(raw) {
  if (typeof raw !== "string" || raw.length > 2048) return null;
  // Browsers drop tabs/newlines inside URLs ("java\tscript:"), so any control or space character is a refusal.
  if (/[\u0000-\u0020\u007f-\u009f]/.test(raw)) return null;
  if (!/^https?:\/\//i.test(raw)) return null;
  let url;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  if (!url.hostname || url.username || url.password) return null;
  return url.href;
}

// --- Block level -------------------------------------------------------------

const FENCE = /^ {0,3}```/;
const QUOTE = /^ {0,3}>/;
const ITEM = /^ {0,3}[-*] +(?=\S)/;

/** text -> [{type: "p"|"pre"|"quote"|"ul", ...}] */
export function parseMarkdown(text, depth = 0) {
  const lines = String(text ?? "").replace(/\r\n?/g, "\n").split("\n");
  const blocks = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }

    if (FENCE.test(line)) {
      const body = [];
      i++;
      while (i < lines.length && !FENCE.test(lines[i])) body.push(lines[i++]);
      i++; // the closing fence (or past the end: an unclosed fence runs to the end of the post)
      blocks.push({ type: "pre", text: body.join("\n") });
      continue;
    }

    if (QUOTE.test(line) && depth < MAX_QUOTE_DEPTH) {
      const body = [];
      while (i < lines.length && QUOTE.test(lines[i])) body.push(lines[i++].replace(/^ {0,3}> ?/, ""));
      blocks.push({ type: "quote", children: parseMarkdown(body.join("\n"), depth + 1) });
      continue;
    }

    if (ITEM.test(line)) {
      const items = [];
      while (i < lines.length && ITEM.test(lines[i])) {
        let item = lines[i++].replace(ITEM, "");
        // An indented line straight after an item continues it.
        while (i < lines.length && /^ {2,}\S/.test(lines[i]) && !ITEM.test(lines[i])) item += "\n" + lines[i++].trim();
        items.push(parseInline(item));
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    const para = [];
    while (i < lines.length && lines[i].trim() && !FENCE.test(lines[i]) && !(QUOTE.test(lines[i]) && depth < MAX_QUOTE_DEPTH) && !ITEM.test(lines[i])) {
      para.push(lines[i++]);
    }
    blocks.push({ type: "p", children: parseInline(para.join("\n")) });
  }
  return blocks;
}

// --- Inline ------------------------------------------------------------------

const LINK = /^\[([^\[\]\n]{1,300})\]\(([^()\s]{1,2048})\)/;
const BARE = /^https:\/\/[^\s<>"'`]+/i;

/** Trailing punctuation belongs to the sentence, not the URL — except a ) that closes a ( inside it. */
function trimUrl(url) {
  let end = url.length;
  while (end > 0) {
    const c = url[end - 1];
    if (".,;:!?*_~'\"".includes(c)) { end--; continue; }
    if (c === ")") {
      const inner = url.slice(0, end);
      if ((inner.match(/\(/g) || []).length < (inner.match(/\)/g) || []).length) { end--; continue; }
    }
    break;
  }
  return url.slice(0, end);
}

/** text -> [{type: "text"|"br"|"strong"|"em"|"code"|"a", ...}] */
export function parseInline(text, { links = true, depth = 0 } = {}) {
  const out = [];
  let buf = "";
  const flush = () => { if (buf) { out.push({ type: "text", text: buf }); buf = ""; } };
  const s = String(text ?? "");
  let i = 0;
  while (i < s.length) {
    const c = s[i];

    if (c === "\n") { flush(); out.push({ type: "br" }); i++; continue; }

    if (c === "`") {
      const close = s.indexOf("`", i + 1);
      if (close > i + 1) {
        flush();
        out.push({ type: "code", text: s.slice(i + 1, close) });
        i = close + 1;
        continue;
      }
    }

    if (depth < MAX_INLINE_DEPTH && s.startsWith("**", i)) {
      const close = s.indexOf("**", i + 2);
      if (close > i + 2 && !/\s/.test(s[i + 2])) {
        flush();
        out.push({ type: "strong", children: parseInline(s.slice(i + 2, close), { links, depth: depth + 1 }) });
        i = close + 2;
        continue;
      }
    }

    if (depth < MAX_INLINE_DEPTH && c === "*" && s[i + 1] !== "*" && s[i + 1] && !/\s/.test(s[i + 1])) {
      let close = i + 1;
      // The closing * must be single (not half of **) and not preceded by a space.
      while ((close = s.indexOf("*", close)) !== -1 && (s[close + 1] === "*" || /\s/.test(s[close - 1]))) {
        close += s[close + 1] === "*" ? 2 : 1;
      }
      if (close > i + 1) {
        flush();
        out.push({ type: "em", children: parseInline(s.slice(i + 1, close), { links, depth: depth + 1 }) });
        i = close + 1;
        continue;
      }
    }

    if (links && c === "[") {
      const m = LINK.exec(s.slice(i, i + 2400));
      const href = m && safeUrl(m[2]);
      if (href) {
        flush();
        out.push({ type: "a", href, children: parseInline(m[1], { links: false, depth: depth + 1 }) });
        i += m[0].length;
        continue;
      }
    }

    if (links && (c === "h" || c === "H") && (i === 0 || !/[\w/]/.test(s[i - 1]))) {
      const m = BARE.exec(s.slice(i, i + 2100));
      const raw = m && trimUrl(m[0]);
      const href = raw && raw.length > "https://".length && safeUrl(raw);
      if (href) {
        flush();
        out.push({ type: "a", href, children: [{ type: "text", text: raw }] });
        i += raw.length;
        continue;
      }
    }

    buf += c;
    i++;
  }
  flush();
  return out;
}

// --- DOM ---------------------------------------------------------------------

const BLOCK_TAGS = { p: "p", pre: "pre", quote: "blockquote", ul: "ul" };
const INLINE_TAGS = { strong: "strong", em: "em", code: "code", a: "a" };

function inlineNodes(doc, nodes, parent) {
  for (const n of nodes) {
    if (n.type === "text") parent.appendChild(doc.createTextNode(n.text));
    else if (n.type === "br") parent.appendChild(doc.createElement("br"));
    else if (n.type === "code") {
      const code = doc.createElement("code");
      code.appendChild(doc.createTextNode(n.text));
      parent.appendChild(code);
    } else if (n.type === "a") {
      const href = safeUrl(n.href); // again at the point of use: a tree built elsewhere gets no pass
      if (!href) { inlineNodes(doc, n.children, parent); continue; }
      const a = doc.createElement("a");
      a.setAttribute("href", href);
      a.setAttribute("rel", LINK_REL);
      a.setAttribute("target", "_blank");
      inlineNodes(doc, n.children, a);
      parent.appendChild(a);
    } else if (INLINE_TAGS[n.type]) {
      const node = doc.createElement(INLINE_TAGS[n.type]);
      inlineNodes(doc, n.children, node);
      parent.appendChild(node);
    }
  }
}

function blockNodes(doc, blocks, parent) {
  for (const b of blocks) {
    if (!BLOCK_TAGS[b.type]) continue;
    const node = doc.createElement(BLOCK_TAGS[b.type]);
    if (b.type === "pre") {
      const code = doc.createElement("code");
      code.appendChild(doc.createTextNode(b.text));
      node.appendChild(code);
    } else if (b.type === "quote") {
      blockNodes(doc, b.children, node);
    } else if (b.type === "ul") {
      for (const item of b.items) {
        const li = doc.createElement("li");
        inlineNodes(doc, item, li);
        node.appendChild(li);
      }
    } else {
      inlineNodes(doc, b.children, node);
    }
    parent.appendChild(node);
  }
}

/** A post body as a DocumentFragment. `doc` is the page's document (a stand-in in tests). */
export function renderMarkdown(text, doc) {
  const frag = doc.createDocumentFragment();
  blockNodes(doc, parseMarkdown(text), frag);
  return frag;
}
