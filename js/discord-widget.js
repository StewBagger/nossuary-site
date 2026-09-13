// Live Discord panel, drawn from the guild's public widget feed instead of Discord's iframe.
// The feed is https://discord.com/api/guilds/<id>/widget.json: CORS-enabled, cached ~5 min by
// Discord, and it only ever answers while "Enable Server Widget" is on in Server Settings.
// It carries online members (up to 100, anonymised ids), voice channels and a presence count —
// no total member count, no roles, no text channels.
(() => {
  "use strict";

  const cfg = window.OSSUARY || {};
  const REFRESH_MS = 5 * 60_000; // matches Discord's own cache; polling faster buys nothing
  const MAX_AVATARS = 14;

  const root = document.getElementById("discord-widget");
  if (!root || !cfg.discordGuildId) return;

  const el = (tag, attrs = {}, ...children) => {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v === null || v === undefined || v === false) continue;
      if (k === "class") node.className = v;
      else if (k === "text") node.textContent = v;
      else node.setAttribute(k, v === true ? "" : v);
    }
    node.append(...children.filter(Boolean));
    return node;
  };

  // Member names are chosen by strangers: they only ever reach the page as textContent/attributes.
  function avatar(m) {
    const status = ["online", "idle", "dnd"].includes(m.status) ? m.status : "online";
    const face = m.avatar_url
      ? el("img", { src: m.avatar_url, alt: "", width: 36, height: 36, loading: "lazy", referrerpolicy: "no-referrer" })
      : el("span", { class: "dw-initial", "aria-hidden": "true", text: (m.username || "?").charAt(0).toUpperCase() });
    return el("li", { class: `dw-member dw-${status}`, title: `${m.username} (${status === "dnd" ? "do not disturb" : status})` },
      face, el("span", { class: "dw-pip", "aria-hidden": "true" }));
  }

  function render(data) {
    const members = Array.isArray(data.members) ? data.members : [];
    const channels = (Array.isArray(data.channels) ? data.channels : [])
      .slice().sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
    const count = Number.isFinite(data.presence_count) ? data.presence_count : members.length;
    // In voice = members the feed places in a channel.
    const inVoice = (id) => members.filter((m) => m.channel_id === id).length;

    const list = el("ul", { class: "dw-members", "aria-label": "Members online now" },
      ...members.slice(0, MAX_AVATARS).map(avatar));
    if (members.length > MAX_AVATARS) {
      list.append(el("li", { class: "dw-more", text: `+${members.length - MAX_AVATARS}` }));
    }

    const voice = channels.length
      ? el("div", { class: "dw-voice" },
          el("p", { class: "dw-label", text: "Voice" }),
          el("ul", {}, ...channels.map((c) => {
            const n = inVoice(c.id);
            return el("li", {}, el("span", { class: "dw-chan", text: c.name }),
              n ? el("span", { class: "dw-in", text: `${n} in` }) : null);
          })))
      : null;

    root.replaceChildren(
      el("div", { class: "dw-head" },
        el("span", { class: "status status-online" }, el("span", { class: "dot", "aria-hidden": "true" }),
          el("span", { text: `${count} online now` })),
        el("span", { class: "dw-name", text: data.name || "Null Ossuary" })),
      members.length ? list : el("p", { class: "muted small", text: "The halls are quiet right now." }),
      voice,
    );
    root.hidden = false;
  }

  async function refresh() {
    try {
      const res = await fetch(`https://discord.com/api/guilds/${encodeURIComponent(cfg.discordGuildId)}/widget.json`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`); // 403 = widget disabled in Server Settings
      render(await res.json());
    } catch (err) {
      // A stale panel is fine; a broken one is not. Only hide if nothing was ever drawn.
      if (!root.childElementCount) root.hidden = true;
      console.warn("[discord-widget]", err);
    }
  }

  refresh();
  setInterval(() => { if (!document.hidden) refresh(); }, REFRESH_MS);
})();
