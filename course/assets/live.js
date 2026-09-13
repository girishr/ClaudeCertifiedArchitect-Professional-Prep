/* Live reading for the CCAR-P course.
 *
 * Four mechanics, driven entirely by markup, state held in localStorage under
 * one key per page. A page opts in with:
 *
 *   <link rel="stylesheet" href="../assets/live.css">
 *   <script src="../assets/live.js" defer></script>
 *   <body data-live="m1s01">          <- the storage key for this page
 *
 * Markup contracts (all optional; use the ones the section earns):
 *
 *   COLD OPEN
 *   <section class="cold" data-right="Existing system" data-where="Cold open">
 *     <span class="live-label">Before you read</span>
 *     <p class="q">Scenario. <b>The question?</b></p>
 *     <div class="live-chips"><button data-v="Claude">Claude</button> ...</div>
 *     <p class="locked">Locked in. ...</p>
 *   </section>
 *
 *   RE-ASK (pairs with the cold open; same data-v values)
 *   <section class="reask" data-where="After reading">
 *     <span class="live-label">Same question, after the section</span>
 *     <p class="q"><b>The question again?</b></p>
 *     <div class="live-chips">...same buttons...</div>
 *     <div class="verdict"></div>
 *     <template data-v="held-right">You held ... {now} ...</template>
 *     <template data-v="changed-right">You changed ... {cold} -> {now} ...</template>
 *     <template data-v="wrong">The module says ... {now} ...</template>
 *   </section>
 *   Placeholders: {cold} {now} are replaced with the button labels.
 *
 *   STEPPER
 *   <figure class="stepper" data-tags-at="5">
 *     ...any markup; elements carry data-at="N" (visible from step N),
 *        data-hi="N" (highlighted at exactly step N)...
 *     <p class="inherit" data-at="5">...</p>
 *     <ol class="caps"><li>caption for step 0</li><li>step 1</li>...</ol>
 *     <div class="stepbar"><div class="cap"></div><div class="dots"></div>
 *       <div class="nav"><button data-nav="prev">Prev</button><button data-nav="next">Next</button></div></div>
 *   </figure>
 *
 *   PREDICT TABLE
 *   <table class="predict" data-options="1|2|3|4" data-where="1.1 Objectives" data-truth-prefix="decision ">
 *     <tr data-truth="1"><td>...</td><td class="call"></td>
 *         <td class="why"><span class="hidden">Make your call first.</span><span class="text">...</span></td></tr>
 *   </table>
 *   <div class="tally" data-perfect="..." data-good="..." data-poor="..."></div>
 *
 *   BET
 *   <div class="bet" data-where="1.2 Screen mix" data-stamp-right="..." data-stamp-wrong="...">
 *     <span class="live-label">Place your bet before the reveal</span>
 *     <p class="q">...</p>
 *     <div class="opts"><button data-k="A"><span class="k">A</span><span>...</span></button>
 *                       <button data-k="B" data-right><span class="k">B</span><span>...</span></button></div>
 *   </div>
 *   <div class="bet-reveal"> ... any [data-w] element gets its width set on reveal ... </div>
 *
 *   CASE FILE
 *   <aside class="casefile"><header>...</header><ul class="stamps"></ul>
 *     <div class="upcoming">...</div>
 *     <footer><span class="count"></span><button data-reset>Reset case</button></footer></aside>
 */
(function () {
  "use strict";

  var PAGE = document.body.dataset.live || location.pathname.replace(/[^a-z0-9]+/gi, "-");
  var KEY = "ccarp-live-" + PAGE;
  /* The case travels across the module: every page files its stamps under one
     module key, and later pages show the earlier ones above their own. */
  var MOD = PAGE.replace(/s\d+$/, "");
  var CASEKEY = "ccarp-case-" + MOD;
  var S = { cold: null, reask: null, step: 0, calls: {}, bets: {} };
  try { var v = JSON.parse(localStorage.getItem(KEY)); if (v && typeof v === "object") S = Object.assign(S, v); } catch (e) {}
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function labelOf(scope, v) { var b = scope && scope.querySelector('button[data-v="' + v + '"]'); return b ? b.textContent.trim() : v; }

  /* ---- case file ------------------------------------------------------- */
  var casefile = document.querySelector(".casefile");
  if (casefile) document.documentElement.classList.add("has-casefile");
  var cold = document.querySelector(".cold");
  var reask = document.querySelector(".reask");
  var tables = Array.prototype.slice.call(document.querySelectorAll("table.predict"));
  var bets = Array.prototype.slice.call(document.querySelectorAll(".bet"));

  function stamps() {
    var items = [];
    if (cold && S.cold) items.push({ k: "cold", where: cold.dataset.where || "Cold open", text: "You said <b>" + esc(labelOf(cold, S.cold)) + "</b>.", cls: "" });
    tables.forEach(function (t, ti) {
      var where = t.dataset.where || "Worked";
      Array.prototype.forEach.call(t.querySelectorAll("tbody tr[data-truth]"), function (tr, i) {
        var c = S.calls[ti + ":" + i]; if (!c) return;
        var ok = c === tr.dataset.truth;
        var name = tr.dataset.name || tr.querySelector("td").textContent.trim().split(/\s+/).slice(0, 4).join(" ");
        var pre = t.dataset.truthPrefix || "";
        items.push({ k: "call:" + ti + ":" + i, where: tr.dataset.name ? where : where + " " + (i + 1), text: "<b>" + esc(name) + "</b> &rarr; " + esc(pre + tr.dataset.truth) + (ok ? "" : ", you said " + esc(pre + c)), cls: ok ? "ok" : "no" });
      });
    });
    bets.forEach(function (b, i) {
      var k = S.bets[i]; if (!k) return;
      var rightBtn = b.querySelector(".opts button[data-right]");
      var ok = rightBtn && rightBtn.dataset.k === k;
      items.push({ k: "bet:" + i, where: b.dataset.where || "Watch out", text: ok ? esc(b.dataset.stampRight || "You called it.") : "You bet " + esc(k) + ". " + esc(b.dataset.stampWrong || ""), cls: ok ? "ok" : "no" });
    });
    if (reask && S.reask) {
      var right = cold && S.reask === cold.dataset.right;
      items.push({ k: "reask", where: reask.dataset.where || "After reading",
        text: S.cold === S.reask ? "You held: <b>" + esc(labelOf(reask, S.reask)) + "</b>." : "You changed your mind: " + (S.cold ? esc(labelOf(reask, S.cold)) : "no call") + " &rarr; <b>" + esc(labelOf(reask, S.reask)) + "</b>.",
        cls: right ? "ok" : "no" });
    }
    return items;
  }
  function readCase() { try { var c = JSON.parse(localStorage.getItem(CASEKEY)); return c && typeof c === "object" ? c : {}; } catch (e) { return {}; } }
  function fileCase(items) {
    var c = readCase();
    if (items.length) {
      var h1 = document.querySelector("h1"), eb = document.querySelector(".masthead .eyebrow");
      var m = eb && /section\s+(\d+)/i.exec(eb.textContent);
      c[PAGE] = { n: m ? m[1] : "", t: h1 ? h1.textContent.trim() : PAGE, items: items.map(function (it) { return { where: it.where, text: it.text, cls: it.cls }; }) };
    } else delete c[PAGE];
    try { localStorage.setItem(CASEKEY, JSON.stringify(c)); } catch (e) {}
  }
  function stampLi(it, cls, newKey) {
    var vw = it.cls === "ok" ? '<b class="vw">Right.</b> ' : it.cls === "no" ? '<b class="vw">Wrong.</b> ' : "";
    return '<li class="' + it.cls + cls + (newKey && it.k === newKey ? " new" : "") + '"><span class="mk">' + (it.cls === "ok" ? "&#10003;" : it.cls === "no" ? "&times;" : "&middot;") + '</span><span><span class="where">' + esc(it.where) + '</span>' + vw + it.text + "</span></li>";
  }
  function renderCase(newKey) {
    if (!casefile) return;
    var ul = casefile.querySelector(".stamps"), count = casefile.querySelector(".count");
    var items = stamps();
    fileCase(items);
    var c = readCase(), earlier = 0, html = "", prev = "";
    Object.keys(c).filter(function (k) { return k !== PAGE && c[k] && c[k].items; }).sort().forEach(function (k) {
      var pg = c[k];
      prev += '<li class="grp"><span class="mk"></span><span>' + (pg.n ? "&sect;" + esc(pg.n) + " &middot; " : "") + esc(pg.t) + "</span></li>";
      prev += pg.items.map(function (it) { earlier++; return stampLi(it, " prev"); }).join("");
    });
    /* This section's stamps first; the rest of the file follows underneath. */
    html += items.length ? items.map(function (it) { return stampLi(it, "", newKey); }).join("") : '<li class="empty"><span class="mk">&middot;</span><span>Nothing stamped yet. Make the first call.</span></li>';
    if (earlier) html += '<li class="grp here"><span class="mk"></span><span>Earlier in this case</span></li>' + prev;
    ul.innerHTML = html;
    if (count) count.textContent = items.length + (items.length === 1 ? " stamp" : " stamps") + (earlier ? " here, " + earlier + " earlier" : "");
  }

  /* ---- 1. cold open ---------------------------------------------------- */
  function paintCold() {
    if (!cold) return;
    cold.querySelectorAll(".live-chips button").forEach(function (b) { b.setAttribute("aria-pressed", String(S.cold === b.dataset.v)); b.disabled = !!S.cold; });
    cold.classList.toggle("done", !!S.cold);
  }
  if (cold) cold.querySelectorAll(".live-chips button").forEach(function (b) {
    b.addEventListener("click", function () { if (S.cold) return; S.cold = b.dataset.v; save(); paintCold(); renderCase("cold"); });
  });

  /* ---- re-ask ---------------------------------------------------------- */
  function paintReask() {
    if (!reask) return;
    var right = cold ? cold.dataset.right : null;
    reask.querySelectorAll(".live-chips button").forEach(function (b) {
      b.setAttribute("aria-pressed", String(S.reask === b.dataset.v));
      b.disabled = !!S.reask;
      b.classList.toggle("truth", !!S.reask && b.dataset.v === right);
      b.classList.toggle("wrong", !!S.reask && S.reask === b.dataset.v && S.reask !== right);
    });
    reask.classList.toggle("done", !!S.reask);
    if (S.reask) {
      var which = S.reask === right ? (S.cold === S.reask ? "held-right" : "changed-right") : "wrong";
      var t = reask.querySelector('template[data-v="' + which + '"]');
      var html = t ? t.innerHTML : "";
      html = html.replace(/\{cold\}/g, "<b>" + esc(S.cold ? labelOf(reask, S.cold) : "no call") + "</b>").replace(/\{now\}/g, "<b>" + esc(labelOf(reask, S.reask)) + "</b>");
      var badge = S.reask === right ? '<span class="vd ok">Right</span>' : '<span class="vd no">Wrong</span>';
      reask.querySelector(".verdict").innerHTML = badge + html;
    }
  }
  if (reask) reask.querySelectorAll(".live-chips button").forEach(function (b) {
    b.addEventListener("click", function () { if (S.reask) return; S.reask = b.dataset.v; save(); paintReask(); renderCase("reask"); });
  });

  /* ---- 2. stepper ------------------------------------------------------ */
  var stepper = document.querySelector("figure.stepper");
  function paintStep() {
    if (!stepper) return;
    var caps = stepper.querySelectorAll("ol.caps li"), n = caps.length;
    if (S.step >= n) S.step = n - 1;
    stepper.querySelectorAll("[data-at]").forEach(function (el) { el.classList.toggle("on", S.step >= +el.dataset.at); });
    stepper.querySelectorAll("[data-hi]").forEach(function (el) { el.classList.toggle("hi", S.step === +el.dataset.hi); });
    stepper.classList.toggle("tags-on", stepper.dataset.tagsAt != null && S.step >= +stepper.dataset.tagsAt);
    stepper.querySelector(".cap").textContent = caps[S.step] ? caps[S.step].textContent : "";
    var dots = stepper.querySelector(".dots");
    dots.innerHTML = Array.prototype.map.call(caps, function (_, i) { return '<i class="' + (i <= S.step ? "on" : "") + '"></i>'; }).join("");
    stepper.querySelector('[data-nav="prev"]').disabled = S.step === 0;
    stepper.querySelector('[data-nav="next"]').disabled = S.step === n - 1;
  }
  if (stepper) {
    var n = stepper.querySelectorAll("ol.caps li").length;
    stepper.querySelector('[data-nav="prev"]').addEventListener("click", function () { if (S.step > 0) { S.step--; save(); paintStep(); } });
    stepper.querySelector('[data-nav="next"]').addEventListener("click", function () { if (S.step < n - 1) { S.step++; save(); paintStep(); } });
    document.addEventListener("keydown", function (e) {
      if (e.target.closest("input,textarea,select") || e.altKey || e.metaKey || e.ctrlKey) return;
      if (e.key === "ArrowRight") stepper.querySelector('[data-nav="next"]').click();
      if (e.key === "ArrowLeft") stepper.querySelector('[data-nav="prev"]').click();
    });
  }

  /* ---- 3. predict then reveal ----------------------------------------- */
  function paintRow(t, ti, tr, i) {
    var opts = (t.dataset.options || "").split("|"), truth = tr.dataset.truth, call = S.calls[ti + ":" + i];
    var cell = tr.querySelector("td.call");
    cell.innerHTML = '<div class="live-chips">' + opts.map(function (o) {
      var cls = "";
      if (call) { if (o === truth) cls = "truth"; else if (o === call) cls = "wrong"; }
      return '<button type="button" class="' + cls + '" data-v="' + esc(o) + '"' + (call ? " disabled" : "") + ">" + esc(o) + "</button>";
    }).join("") + "</div>";
    tr.classList.toggle("revealed", !!call);
    var h = tr.querySelector("td.why .hidden"), x = tr.querySelector("td.why .text"), vd = tr.querySelector("td.why .vd");
    if (h) h.style.display = call ? "none" : "";
    if (x) x.style.display = call ? "" : "none";
    if (call) {
      var ok = call === truth, pre = t.dataset.truthPrefix || "";
      if (!vd) { vd = document.createElement("span"); vd.className = "vd"; tr.querySelector("td.why").insertBefore(vd, h || x); }
      vd.className = "vd " + (ok ? "ok" : "no");
      vd.textContent = ok ? "Right" : "Wrong, " + pre + truth;
    } else if (vd) vd.remove();
    cell.querySelectorAll("button").forEach(function (b) {
      b.addEventListener("click", function () {
        if (S.calls[ti + ":" + i]) return;
        S.calls[ti + ":" + i] = b.dataset.v; save(); paintRow(t, ti, tr, i); paintTally(t, ti); renderCase("call:" + ti + ":" + i);
      });
    });
  }
  function paintTally(t, ti) {
    var tally = t.nextElementSibling && t.nextElementSibling.classList.contains("tally") ? t.nextElementSibling : null;
    if (!tally) return;
    var rows = t.querySelectorAll("tbody tr[data-truth]"), total = rows.length, made = 0, right = 0;
    Array.prototype.forEach.call(rows, function (tr, i) { var c = S.calls[ti + ":" + i]; if (c) { made++; if (c === tr.dataset.truth) right++; } });
    if (made < total) tally.innerHTML = "<span>Your calls</span><b>" + made + " of " + total + "</b>";
    else {
      var msg = right === total ? tally.dataset.perfect : right >= total / 2 ? tally.dataset.good : tally.dataset.poor;
      tally.innerHTML = "<span>" + esc(msg || "") + "</span><b class=\"" + (right === total ? "ok" : right >= total / 2 ? "" : "no") + "\">" + right + " of " + total + " right</b>";
    }
  }
  tables.forEach(function (t, ti) {
    Array.prototype.forEach.call(t.querySelectorAll("tbody tr[data-truth]"), function (tr, i) { paintRow(t, ti, tr, i); });
    paintTally(t, ti);
  });

  /* ---- the bet -------------------------------------------------------- */
  function paintBet(b, i) {
    var k = S.bets[i];
    b.classList.toggle("done", !!k);
    var rightBtn = b.querySelector(".opts button[data-right]");
    b.querySelectorAll(".opts button").forEach(function (o) {
      o.disabled = !!k;
      o.classList.toggle("right", !!k && o.hasAttribute("data-right"));
      o.classList.toggle("wrong", !!k && k === o.dataset.k && !o.hasAttribute("data-right"));
    });
    var line = b.querySelector(".verdict-line");
    if (k) {
      if (!line) { line = document.createElement("p"); line.className = "verdict-line"; b.appendChild(line); }
      var ok = rightBtn && rightBtn.dataset.k === k, rk = rightBtn ? rightBtn.dataset.k : "";
      line.innerHTML = ok
        ? '<span class="vd ok">Right</span>' + esc(b.dataset.stampRight || "You called it.")
        : '<span class="vd no">Wrong</span>You bet <b>' + esc(k) + "</b>. The answer is <b>" + esc(rk) + "</b>. " + esc(b.dataset.stampWrong || "");
    } else if (line) line.remove();
    var rev = b.nextElementSibling && b.nextElementSibling.classList.contains("bet-reveal") ? b.nextElementSibling : null;
    if (rev) {
      rev.classList.toggle("on", !!k);
      if (k) requestAnimationFrame(function () { rev.querySelectorAll("[data-w]").forEach(function (el) { el.style.width = el.dataset.w + "%"; }); });
    }
  }
  bets.forEach(function (b, i) {
    b.querySelectorAll(".opts button").forEach(function (o) {
      o.addEventListener("click", function () { if (S.bets[i]) return; S.bets[i] = o.dataset.k; save(); paintBet(b, i); renderCase("bet:" + i); });
    });
    paintBet(b, i);
  });

  /* ---- reset ---------------------------------------------------------- */
  var resetBtn = casefile && casefile.querySelector("[data-reset]");
  if (resetBtn) resetBtn.addEventListener("click", function () {
    S = { cold: null, reask: null, step: 0, calls: {}, bets: {} }; save();
    paintCold(); paintReask(); paintStep();
    tables.forEach(function (t, ti) { Array.prototype.forEach.call(t.querySelectorAll("tbody tr[data-truth]"), function (tr, i) { paintRow(t, ti, tr, i); }); paintTally(t, ti); });
    bets.forEach(paintBet); renderCase();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  paintCold(); paintReask(); paintStep(); renderCase();
})();
