(() => {
  "use strict";

  const cfg = window.OSSUARY || {};
  const STATUS_REFRESH_MS = 60_000;
  const STATUS_STALE_MS = 5 * 60_000; // older than this and the numbers are not "live"

  const $ = (sel, root = document) => root.querySelector(sel);
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

  // --- Discord links ------------------------------------------------------
  function wireDiscord() {
    document.querySelectorAll("[data-discord]").forEach((a) => {
      if (cfg.discordInvite) {
        a.href = cfg.discordInvite;
        a.target = "_blank";
        a.rel = "noopener";
      } else {
        a.setAttribute("aria-disabled", "true");
        a.title = "Invite link coming soon";
        a.addEventListener("click", (e) => e.preventDefault());
      }
    });
  }

  // --- Servers ------------------------------------------------------------
  function renderServers() {
    const list = $("#server-list");
    for (const s of cfg.servers || []) {
      // IP and port are separate fields in the game's Add Server form, so each copies on its own.
      const field = (label, value) => {
        const btn = el("button", { class: "copy", type: "button", "aria-label": `Copy ${label} ${value}` }, "Copy");
        btn.addEventListener("click", () => copy(value, btn));
        return el("div", { class: "address" },
          el("span", { class: "address-label", text: label }),
          el("code", { text: value }),
          btn);
      };

      list.append(
        el("article", { class: "card server", "data-server": s.id },
          el("div", { class: "server-top" },
            el("span", { class: "server-tags" },
              s.tag ? el("span", { class: `tag tag-${s.tag.toLowerCase()}`, text: s.tag }) : null,
              s.game ? el("span", { class: "tag tag-game", text: s.game }) : null),
            el("span", { class: "status status-unknown", "data-status": "" },
              el("span", { class: "dot", "aria-hidden": "true" }),
              el("span", { class: "status-text", text: "Status unavailable" }))),
          el("h3", { text: s.name }),
          s.subtitle ? el("p", { class: "muted small", text: s.subtitle }) : null,
          el("div", { class: "addresses" },
            field("IP", s.ip),
            field("Port", s.port)),
          el("dl", { class: "stats" },
            stat("Players", "players"),
            stat("Uptime", "uptime"),
            stat("In-game day", "day")))
      );
    }
  }

  // One line per server under the hero buttons, updated by applyStatus alongside the cards.
  function renderLiveStrip() {
    const servers = cfg.servers || [];
    const strip = $("#live-strip");
    if (!strip || !servers.length) return;
    for (const s of servers) {
      strip.append(el("li", { class: "live status-unknown", "data-live": s.id },
        el("span", { class: "dot", "aria-hidden": "true" }),
        el("a", { href: "#play", text: s.name }),
        el("span", { class: "live-meta" },
          s.game ? el("span", { class: "live-game", text: s.game }) : null,
          el("span", { class: "live-count", text: "—" }))));
    }
    strip.hidden = false;
  }

  function renderComingSoon() {
    const games = (cfg.comingSoon || []).filter((g) => g && g.game);
    if (!games.length) return;
    const list = $("#coming-list");
    for (const g of games) {
      list.append(el("li", { class: "card coming" },
        el("span", { class: "tag tag-soon", text: "Planned" }),
        el("strong", { text: g.game }),
        el("span", { class: "muted small", text: g.note || "A Null server is planned. Nothing to join yet — follow the Discord for word." })));
    }
    $("#coming-soon").hidden = false;
  }

  function stat(label, key) {
    const wrap = el("div");
    wrap.append(el("dt", { text: label }), el("dd", { "data-stat": key, text: "—" }));
    return wrap;
  }

  async function copy(text, btn) {
    try {
      await navigator.clipboard.writeText(text);
      flash(btn, "Copied");
    } catch {
      flash(btn, "Select & copy");
    }
  }

  function flash(btn, msg) {
    const old = btn.textContent;
    btn.textContent = msg;
    setTimeout(() => (btn.textContent = old), 1600);
  }

  // --- Live status --------------------------------------------------------
  // Expected shape (published from home, never queried from the browser directly):
  // { "generated": "2026-09-13T15:00:00Z",
  //   "servers": { "pz-stable": { "online": true, "players": 12, "maxPlayers": 32,
  //                               "uptimePercent": 99.2, "uptimeWindowHours": 50,
  //                               "day": 41 } } }
  // uptimePercent is the last seven days (null with no history yet);
  // uptimeWindowHours is how much of those seven days it covers, capped at 168.
  async function refreshStatus() {
    const note = $("#status-note");
    if (!cfg.statusUrl) {
      note.hidden = false;
      note.textContent = "Live status is being wired up. The addresses work now.";
      return;
    }
    try {
      const res = await fetch(cfg.statusUrl, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const age = Date.now() - Date.parse(data.generated);
      const stale = !(age >= 0 && age < STATUS_STALE_MS);
      note.hidden = !stale;
      note.textContent = stale ? "Status is out of date — the last report is more than a few minutes old." : "";
      for (const s of cfg.servers || []) applyStatus(s.id, stale ? null : data.servers?.[s.id]);
    } catch {
      note.hidden = false;
      note.textContent = "Couldn't load live status right now. The addresses still work.";
      for (const s of cfg.servers || []) applyStatus(s.id, null);
    }
  }

  function applyStatus(id, st) {
    applyLive(id, st);
    const card = document.querySelector(`[data-server="${CSS.escape(id)}"]`);
    if (!card) return;
    const badge = $("[data-status]", card);
    const text = $(".status-text", card);
    const set = (k, v) => ($(`[data-stat="${k}"]`, card).textContent = v);

    // Unknown is not the same as offline: never show red on a status we couldn't read.
    if (!st) {
      badge.className = "status status-unknown";
      text.textContent = "Status unavailable";
      ["players", "uptime", "day"].forEach((k) => set(k, "—"));
      return;
    }
    badge.className = `status ${st.online ? "status-online" : "status-offline"}`;
    text.textContent = st.online ? "Online" : "Offline";
    set("players", st.online && Number.isFinite(st.players)
      ? `${st.players}${Number.isFinite(st.maxPlayers) ? ` / ${st.maxPlayers}` : ""}` : "—");
    // Shown on an offline card too: it is a week's record, not a live reading,
    // and "how often is it up" is exactly what someone looking at red wants.
    $('[data-stat="uptime"]', card).replaceChildren(...uptime(st.uptimePercent, st.uptimeWindowHours));
    set("day", Number.isFinite(st.day) ? String(st.day) : "—");
  }

  function applyLive(id, st) {
    const row = document.querySelector(`[data-live="${CSS.escape(id)}"]`);
    if (!row) return;
    const count = $(".live-count", row);
    if (!st) {
      row.className = "live status-unknown";
      count.textContent = "—";
    } else if (!st.online) {
      row.className = "live status-offline";
      count.textContent = "offline";
    } else {
      row.className = "live status-online";
      count.textContent = Number.isFinite(st.players) ? `${st.players} online` : "online";
    }
  }

  // "99.2%", plus how much history backs it while that is under a week:
  // "97.0% (2d)" from 48 hours, "100.0% (5h)" before. The span is a smaller
  // <small> so the figure stays on one line in a phone-width stat column.
  function uptime(pct, hours) {
    if (!Number.isFinite(pct)) return ["—"];
    const text = `${pct.toFixed(1)}%`;
    if (!Number.isFinite(hours) || hours >= 168) return [text];
    const span = hours >= 48 ? `${Math.floor(hours / 24)}d` : `${Math.max(0, Math.floor(hours))}h`;
    return [text, " ", el("small", { class: "stat-window", text: `(${span})` })];
  }

  // --- Links --------------------------------------------------------------
  function renderLinks() {
    const links = (cfg.links || []).filter((l) => l.url);
    if (!links.length) return;
    const list = $("#link-list");
    for (const l of links) {
      list.append(el("li", {},
        el("a", { class: "card link-card", href: l.url, target: "_blank", rel: "noopener" },
          el("strong", { text: l.label }),
          el("span", { class: "muted small", text: l.detail || "" }))));
    }
    $("#links-section").hidden = false;
  }

  // --- Support ------------------------------------------------------------
  function renderSupport() {
    if (!cfg.kofiUrl) return;
    document.querySelectorAll("[data-kofi]").forEach((a) => { a.href = cfg.kofiUrl; });
    document.querySelectorAll("[data-support-nav]").forEach((li) => { li.hidden = false; });
    $("#support").hidden = false;
  }

  // --- Projects -----------------------------------------------------------
  function renderProjects() {
    const projects = cfg.projects || [];
    if (!projects.length) { $("#projects").hidden = true; return; }
    const list = $("#project-list");
    for (const p of projects) {
      const inner = [
        el("div", { class: "project-top" },
          el("span", { class: "tag", text: p.kind }),
          el("span", { class: "project-status small", text: p.status })),
        el("h3", { text: p.name }),
        el("p", { class: "muted small", text: p.blurb }),
        el("ul", { class: "chips" }, ...(p.tags || []).map((t) => el("li", { text: t }))),
      ];
      const external = p.url && !p.url.startsWith("#");
      const card = p.url
        ? el("a", { class: "card project project-link", href: p.url, target: external ? "_blank" : null, rel: external ? "noopener" : null }, ...inner)
        : el("div", { class: "card project" }, ...inner);
      list.append(el("li", {}, card));
    }
  }

  // --- Mods ---------------------------------------------------------------
  // Grouped by `game`, one heading per game in first-seen order, so a second game's mods become a
  // second group with no markup change.
  function renderMods() {
    const mods = (cfg.mods || []).filter((m) => /^\d+$/.test(m.id));
    if (!mods.length) { $("#mods").hidden = true; return; }
    const groups = new Map();
    for (const m of mods) {
      const game = m.game || "Other";
      if (!groups.has(game)) groups.set(game, []);
      groups.get(game).push(m);
    }
    const root = $("#mod-groups");
    for (const [game, list] of groups) {
      const ul = el("ul", { class: "mod-grid" });
      for (const m of list) {
        ul.append(el("li", {},
          el("a", {
            class: "card mod-card",
            href: `https://steamcommunity.com/sharedfiles/filedetails/?id=${m.id}`,
            target: "_blank", rel: "noopener",
          },
            el("strong", { text: m.name }),
            el("span", { class: "muted small", text: m.blurb || "" }),
            el("span", { class: "mod-go small", text: "View on Workshop →" }))));
      }
      root.append(el("div", { class: "mod-group" },
        el("div", { class: "mod-group-head" },
          el("h3", { text: game }),
          el("span", { class: "mod-group-count", text: `${list.length} mod${list.length === 1 ? "" : "s"}` })),
        ul));
    }
  }

  // --- Contact form -------------------------------------------------------
  function wireForm() {
    const form = $("#contact-form");
    const status = $("#form-status");

    if (!cfg.contactEndpoint) {
      form.classList.add("form-offline");
      form.querySelectorAll("input, select, textarea, button").forEach((c) => (c.disabled = true));
      status.textContent = "The form isn't connected yet — please reach us on Discord for now.";
      return;
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const body = Object.fromEntries(new FormData(form));
      if (body.website) return; // honeypot tripped: silently drop
      const btn = form.querySelector("button");
      btn.disabled = true;
      status.textContent = "Sending…";
      try {
        const res = await fetch(cfg.contactEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        form.reset();
        status.textContent = "Sent. An admin will get back to you on Discord.";
      } catch {
        status.textContent = "That didn't go through. Try again, or reach us on Discord.";
      } finally {
        btn.disabled = false;
      }
    });
  }

  wireDiscord();
  renderProjects();
  renderLiveStrip();
  renderServers();
  renderComingSoon();
  renderMods();
  renderSupport();
  renderLinks();
  wireForm();
  refreshStatus();
  if (cfg.statusUrl) setInterval(refreshStatus, STATUS_REFRESH_MS);
})();
