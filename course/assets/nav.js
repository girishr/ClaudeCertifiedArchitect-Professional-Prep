/* Site navigation and reading settings for the CCAR-P course.
 *
 * One file, loaded in the <head> of every page that has the menu, the hub included.
 *   1. Loads its own stylesheet (assets/nav.css).
 *   2. Applies the stored theme, font, menu state and menu width before paint.
 *   3. On DOM ready, injects a collapsible, resizable left menu with the whole site in it.
 *   4. Remembers every choice in localStorage.
 *
 * Links are written relative to the course root (the folder this file's assets/
 * folder sits in), which is worked out from the script's own src, so the same
 * file works from course/, course/module-01/ and course/reference/.
 */
(function () {
  "use strict";

  var KEY_THEME = "ccarp-theme", KEY_FONT = "ccarp-font", KEY_NAV = "ccarp-nav", KEY_W = "ccarp-nav-w";
  var root = document.documentElement;
  var src = (document.currentScript && document.currentScript.src) || "";
  var COURSE = src.replace(/assets\/nav\.js.*$/, "");
  var WIDE = "(min-width: 64.01rem)";
  var MIN_W = 200, MAX_W = 520, DEFAULT_W = 272;   /* px; 272 is 17rem at 16px */

  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  /* The shared visual world, then the menu's own stylesheet, so a page needs
     only this one script tag. print.css comes first: it owns the palette and
     the type that everything after it reads from. */
  ["assets/print.css", "assets/nav.css"].forEach(function (href) {
    var link = document.createElement("link");
    link.rel = "stylesheet"; link.href = COURSE + href;
    (document.head || document.documentElement).appendChild(link);
  });

  /* ---- 1. settings before paint ---------------------------------------- */
  var theme = get(KEY_THEME);
  if (theme === "light" || theme === "dark") root.setAttribute("data-theme", theme);
  if (get(KEY_FONT) === "dyslexic") root.classList.add("font-dyslexic");
  var navPref = get(KEY_NAV);
  var wide = window.matchMedia && window.matchMedia(WIDE).matches;
  if (navPref === "open" || (navPref === null && wide)) root.classList.add("nav-open");
  var storedW = parseInt(get(KEY_W), 10);
  if (storedW >= MIN_W && storedW <= MAX_W) root.style.setProperty("--nav-w", storedW + "px");

  /* ---- 2. the menu ------------------------------------------------------ */
  var NAV = [
    { h: "Prep kit", items: [
      { t: "Hub", u: "../index.html" },
      { t: "Study plan", u: "../index.html#tab-plan" },
      { t: "Practice questions", u: "../index.html#tab-practice" },
      { t: "Exam brief", u: "../index.html#tab-brief" }
    ]},
    { h: "Course", items: [
      { t: "All five modules", u: "index.html" }
    ]},
    { h: "Module 1 · Claude Platform & Solution Design", items: [
      { t: "Contents", u: "module-01/index.html" },
      { n: "01", t: "Module introduction",          u: "module-01/01-introduction.html" },
      { n: "02", t: "How Claude behaves",           u: "module-01/02-how-claude-behaves.html" },
      { n: "03", t: "Platform map and primitives",  u: "module-01/03-platform-map.html" },
      { n: "04", t: "Decomposition",                u: "module-01/04-decomposition.html" },
      { n: "05", t: "Pattern selection",            u: "module-01/05-pattern-selection.html" },
      { n: "06", t: "Reference architectures",      u: "module-01/06-reference-architectures.html" },
      { n: "07", t: "RAG pipeline design",          u: "module-01/07-rag-pipeline.html" },
      { n: "08", t: "Model and context strategy",   u: "module-01/08-model-and-context.html" },
      { n: "09", t: "Prompting as architecture",    u: "module-01/09-prompting.html" },
      { n: "10", t: "Entry points and governance",  u: "module-01/10-entry-points.html" },
      { n: "11", t: "Assembly",                     u: "module-01/11-assembly.html" },
      { n: "12", t: "Recap and what is next",       u: "module-01/12-recap.html" }
    ]},
    { h: "Modules 2 to 5 · official only", items: [
      { t: "2 Enterprise Integration & Production", x: "https://anthropic-partners.skilljar.com/path/claude-certified-architect-professional/enterprise-integration-production" },
      { t: "3 Responsible AI, Safety & Risk",       x: "https://anthropic-partners.skilljar.com/path/claude-certified-architect-professional/responsible-ai-safety-risk-for-architects" },
      { t: "4 Stakeholder, Lifecycle & GTM",        x: "https://anthropic-partners.skilljar.com/path/claude-certified-architect-professional/stakeholder-engagement-lifecycle-gtm" },
      { t: "5 Team Enablement & Productivity",      x: "https://anthropic-partners.skilljar.com/path/claude-certified-architect-professional/developer-productivity-enablement" }
    ]},
    { h: "Reference", items: [
      { t: "Glossary", u: "reference/glossary.html" },
      { t: "Pattern selection sheet", u: "reference/pattern-selection.html" }
    ]}
  ];

  function el(tag, attrs, children) {
    var e = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (k === "text") e.textContent = attrs[k];
      else if (k === "html") e.innerHTML = attrs[k];
      else e.setAttribute(k, attrs[k]);
    }
    (children || []).forEach(function (c) { if (c) e.appendChild(c); });
    return e;
  }

  /* Which menu entry is "here". Same path wins; when several entries share a
     path and differ only by hash (the hub's tabs), the one whose hash matches
     wins, and the hash-less entry is the fallback. */
  function hereHref(items) {
    var loc = new URL(location.href), best = null, fallback = null;
    items.forEach(function (it) {
      if (it.x) return;
      var u; try { u = new URL(COURSE + it.u); } catch (e) { return; }
      if (u.pathname !== loc.pathname) return;
      if (u.hash && u.hash === loc.hash) best = it;
      if (!u.hash) fallback = fallback || it;
    });
    return best || fallback;
  }

  function build() {
    var all = []; NAV.forEach(function (g) { all = all.concat(g.items); });
    var hereItem = hereHref(all);
    var groups = NAV.map(function (g) {
      var lis = g.items.map(function (it) {
        var href = it.x || (COURSE + it.u);
        var a = el("a", { href: href }, [
          it.n ? el("span", { "class": "n", text: it.n }) : null,
          el("span", { text: it.t }),
          it.x ? el("span", { "class": "ext", text: "↗", "aria-hidden": "true" }) : null
        ]);
        if (it.x) { a.target = "_blank"; a.rel = "noopener"; }
        var li = el("li", null, [a]);
        if (it === hereItem) { li.className = "here"; a.setAttribute("aria-current", "page"); }
        return li;
      });
      return el("div", { "class": "nav-group" }, [
        el("h3", { text: g.h }),
        el("ul", null, lis)
      ]);
    });

    function seg(label, key, opts, current, apply) {
      var wrap = el("div", { "class": "seg", role: "group", "aria-label": label }, [el("span", { "class": "seg-l", text: label })]);
      opts.forEach(function (o) {
        var b = el("button", { type: "button", text: o.t, "aria-pressed": String(current() === o.v) });
        b.addEventListener("click", function () {
          set(key, o.v); apply(o.v);
          wrap.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
        });
        wrap.appendChild(b);
      });
      return wrap;
    }

    var settings = el("div", { "class": "sidenav-settings" }, [
      seg("Theme", KEY_THEME, [{ t: "Dark", v: "dark" }, { t: "Light", v: "light" }],
          function () { return root.getAttribute("data-theme") === "light" ? "light" : "dark"; },
          function (v) { root.setAttribute("data-theme", v); var hb = document.getElementById("theme-btn"); if (hb) hb.textContent = v === "dark" ? "Light" : "Dark"; }),
      seg("Font", KEY_FONT, [{ t: "Default", v: "default" }, { t: "Dyslexia-friendly", v: "dyslexic" }],
          function () { return root.classList.contains("font-dyslexic") ? "dyslexic" : "default"; },
          function (v) { root.classList.toggle("font-dyslexic", v === "dyslexic"); }),
      el("p", { "class": "hint", text: "Drag the menu's right edge to resize it. Double-click the edge to reset." })
    ]);

    var close = el("button", { type: "button", "class": "nav-close", text: "Collapse", "aria-label": "Collapse the menu" });
    var resizer = el("div", { "class": "nav-resizer", role: "separator", "aria-orientation": "vertical",
                              "aria-label": "Resize the menu. Drag, or use the arrow keys. Double-click to reset.",
                              tabindex: "0" });
    var aside = el("aside", { id: "sidenav", "class": "sidenav", "aria-label": "Course navigation" }, [
      el("div", { "class": "sidenav-head" }, [
        el("a", { href: COURSE + "index.html", "class": "brand", text: "CCAR-P course" }),
        close
      ]),
      el("nav", null, groups),
      settings,
      resizer
    ]);

    /* ---- resizing ------------------------------------------------------- */
    function currentW() {
      var v = parseInt(getComputedStyle(root).getPropertyValue("--nav-w"), 10);
      return isNaN(v) ? DEFAULT_W : v;
    }
    function setW(px, save) {
      px = Math.max(MIN_W, Math.min(MAX_W, Math.round(px)));
      root.style.setProperty("--nav-w", px + "px");
      resizer.setAttribute("aria-valuenow", String(px));
      if (save) set(KEY_W, String(px));
      return px;
    }
    resizer.setAttribute("aria-valuemin", String(MIN_W));
    resizer.setAttribute("aria-valuemax", String(MAX_W));
    resizer.setAttribute("aria-valuenow", String(currentW()));
    function resetW() {
      root.style.removeProperty("--nav-w");
      set(KEY_W, "");
      resizer.setAttribute("aria-valuenow", String(currentW()));
    }
    var lastTap = 0;
    resizer.addEventListener("pointerdown", function (e) {
      if (e.button !== 0) return;
      e.preventDefault();
      resizer.setPointerCapture(e.pointerId);
      root.classList.add("nav-resizing");
      var startX = e.clientX, moved = false;
      var move = function (ev) { if (Math.abs(ev.clientX - startX) > 2) moved = true; if (moved) setW(ev.clientX, false); };
      var up = function (ev) {
        resizer.removeEventListener("pointermove", move);
        resizer.removeEventListener("pointerup", up);
        resizer.removeEventListener("pointercancel", up);
        root.classList.remove("nav-resizing");
        if (moved) { setW(ev.clientX, true); lastTap = 0; return; }
        /* a tap, not a drag: two within 400ms resets the width */
        var now = Date.now();
        if (now - lastTap < 400) { resetW(); lastTap = 0; } else { lastTap = now; }
      };
      resizer.addEventListener("pointermove", move);
      resizer.addEventListener("pointerup", up);
      resizer.addEventListener("pointercancel", up);
    });
    resizer.addEventListener("keydown", function (e) {
      var step = e.shiftKey ? 40 : 10;
      if (e.key === "ArrowRight") { setW(currentW() + step, true); e.preventDefault(); }
      else if (e.key === "ArrowLeft") { setW(currentW() - step, true); e.preventDefault(); }
      else if (e.key === "Home") { setW(MIN_W, true); e.preventDefault(); }
      else if (e.key === "End") { setW(MAX_W, true); e.preventDefault(); }
    });
    var toggle = el("button", { type: "button", "class": "nav-toggle", "aria-controls": "sidenav", "aria-label": "Open the menu", text: "\u2630  Menu" });
    var backdrop = el("div", { "class": "nav-backdrop" });

    function open(v) {
      root.classList.toggle("nav-open", v);
      toggle.setAttribute("aria-expanded", String(v));
      set(KEY_NAV, v ? "open" : "closed");
    }
    toggle.addEventListener("click", function () { open(true); });
    close.addEventListener("click", function () { open(false); });
    backdrop.addEventListener("click", function () { open(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && root.classList.contains("nav-open")) open(false); });
    /* On a narrow screen the menu is an overlay: following a link should close it. */
    aside.addEventListener("click", function (e) {
      if (e.target.closest("a") && !window.matchMedia(WIDE).matches) root.classList.remove("nav-open");
    });
    toggle.setAttribute("aria-expanded", String(root.classList.contains("nav-open")));

    document.body.insertBefore(backdrop, document.body.firstChild);
    document.body.insertBefore(aside, document.body.firstChild);
    document.body.insertBefore(toggle, document.body.firstChild);

    window.addEventListener("hashchange", function () {
      var now = hereHref(all);
      aside.querySelectorAll("li.here").forEach(function (li) { li.className = ""; li.querySelector("a").removeAttribute("aria-current"); });
      aside.querySelectorAll(".nav-group a").forEach(function (a) {
        if (now && a.getAttribute("href") === (now.x || (COURSE + now.u))) { a.parentNode.className = "here"; a.setAttribute("aria-current", "page"); }
      });
    });

    /* keep the current section in view inside the menu */
    var cur = aside.querySelector("li.here");
    if (cur && cur.scrollIntoView) cur.scrollIntoView({ block: "center" });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build);
  else build();
})();
