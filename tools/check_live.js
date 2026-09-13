/* Checks a live-reading lesson page: markup contract, no script errors, every
 * control clickable. Usage: node tools/check_live.js course/module-01/04-decomposition.html [...]
 */
const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");

(async () => {
  const files = process.argv.slice(2);
  if (!files.length) { console.error("give one or more html files"); process.exit(2); }
  const browser = await chromium.launch();
  let bad = 0;
  for (const f of files) {
    const abs = path.resolve(f);
    const src = fs.readFileSync(abs, "utf8");
    const problems = [];
    if (/—/.test(src)) problems.push("em dash in source");
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    page.on("pageerror", e => problems.push("pageerror: " + e.message));
    page.on("console", m => { if (m.type() === "error") problems.push("console: " + m.text()); });
    await page.goto("file://" + abs);
    await page.waitForTimeout(300);
    const r = await page.evaluate(() => {
      const out = [];
      const q = (s, r) => Array.from((r || document).querySelectorAll(s));
      if (!document.querySelector('link[href$="live.css"]')) out.push("live.css not linked");
      if (!document.querySelector('script[src$="live.js"]')) out.push("live.js not loaded");
      const id = document.body.dataset.live || "";
      const m = /section\s+(\d+)/i.exec((document.querySelector(".masthead .eyebrow") || {}).textContent || "");
      if (!/^m\d+s\d\d$/.test(id)) out.push("body data-live missing or malformed: " + id);
      else if (m && id.slice(-2) !== m[1].padStart(2, "0")) out.push("data-live section does not match eyebrow: " + id + " vs " + m[1]);
      const cold = document.querySelector(".cold"), reask = document.querySelector(".reask");
      if (q(".cold").length > 1) out.push("more than one .cold");
      if (q(".reask").length > 1) out.push("more than one .reask");
      if (cold) {
        const vs = q(".live-chips button", cold).map(b => b.dataset.v);
        if (vs.length < 2) out.push("cold open has fewer than 2 options");
        if (!vs.includes(cold.dataset.right)) out.push("cold data-right not among options");
        if (!cold.querySelector(".locked")) out.push("cold open missing .locked");
        if (!reask) out.push("cold open without a .reask");
        else {
          const rv = q(".live-chips button", reask).map(b => b.dataset.v);
          if (rv.join("|") !== vs.join("|")) out.push("reask options differ from cold options");
          if (!reask.querySelector(".verdict")) out.push("reask missing .verdict");
          for (const k of ["held-right", "changed-right", "wrong"]) if (!reask.querySelector('template[data-v="' + k + '"]')) out.push("reask missing template " + k);
        }
      } else if (reask) out.push(".reask without .cold");
      q("table.predict").forEach((t, i) => {
        const opts = (t.dataset.options || "").split("|");
        if (opts.length < 2) out.push("predict table " + i + " needs data-options");
        const rows = q("tbody tr[data-truth]", t);
        if (!rows.length) out.push("predict table " + i + " has no data-truth rows");
        rows.forEach((tr, j) => {
          if (!opts.includes(tr.dataset.truth)) out.push("predict table " + i + " row " + j + " truth not in options");
          if (!tr.querySelector("td.call")) out.push("predict table " + i + " row " + j + " missing td.call");
          if (!tr.querySelector("td.why .hidden") || !tr.querySelector("td.why .text")) out.push("predict table " + i + " row " + j + " missing td.why .hidden/.text");
        });
        const n = t.nextElementSibling;
        if (!n || !n.classList.contains("tally")) out.push("predict table " + i + " not followed by .tally");
        else for (const k of ["perfect", "good", "poor"]) if (!n.dataset[k]) out.push("tally " + i + " missing data-" + k);
      });
      q(".bet").forEach((b, i) => {
        const o = q(".opts button", b);
        if (o.length < 2) out.push("bet " + i + " fewer than 2 options");
        if (q(".opts button[data-right]", b).length !== 1) out.push("bet " + i + " needs exactly one data-right");
        o.forEach(x => { if (!x.dataset.k) out.push("bet " + i + " option missing data-k"); if (!x.querySelector(".k")) out.push("bet " + i + " option missing .k"); });
        if (!b.dataset.where) out.push("bet " + i + " missing data-where");
        if (!b.dataset.stampWrong) out.push("bet " + i + " missing data-stamp-wrong");
      });
      const st = q("figure.stepper");
      if (st.length > 1) out.push("more than one figure.stepper (only one is driven)");
      st.forEach(fg => {
        const caps = q("ol.caps li", fg).length;
        if (caps < 2) out.push("stepper needs ol.caps with 2+ captions");
        for (const s of [".stepbar .cap", ".stepbar .dots", '[data-nav="prev"]', '[data-nav="next"]']) if (!fg.querySelector(s)) out.push("stepper missing " + s);
        q("[data-at]", fg).forEach(el => { if (+el.dataset.at > caps - 1) out.push("stepper data-at beyond captions: " + el.dataset.at); });
        q("[data-hi]", fg).forEach(el => { if (+el.dataset.hi > caps - 1) out.push("stepper data-hi beyond captions: " + el.dataset.hi); });
        if (fg.dataset.tagsAt != null && +fg.dataset.tagsAt > caps - 1) out.push("stepper data-tags-at beyond captions");
      });
      const cf = document.querySelector(".casefile");
      if (!cf) out.push("no .casefile");
      else for (const s of ["header .live-label", "header b", "ul.stamps", ".upcoming", "footer .count", "[data-reset]"]) if (!cf.querySelector(s)) out.push("casefile missing " + s);
      if (!cold && !q("table.predict").length && !q(".bet").length) out.push("page has no live mechanic at all");
      // svg text inside viewBox
      q("svg[viewBox]").forEach(svg => {
        const vb = svg.getAttribute("viewBox").split(/\s+/).map(Number), r = svg.getBoundingClientRect();
        if (!r.width) return;
        const sx = vb[2] / r.width, sy = vb[3] / r.height;
        q("text", svg).forEach(t => { const b = t.getBoundingClientRect(); const x2 = (b.right - r.left) * sx, y2 = (b.bottom - r.top) * sy, x1 = (b.left - r.left) * sx;
          if (x2 > vb[2] + 1 || y2 > vb[3] + 1 || x1 < vb[0] - 1) out.push("svg text outside viewBox: " + t.textContent.trim().slice(0, 40)); });
      });
      return out;
    });
    problems.push(...r);
    // click through everything, in order of a reader
    try {
      const cb = await page.$(".cold .live-chips button"); if (cb) await cb.click();
      for (const tr of await page.$$("table.predict tbody tr[data-truth]")) { const b = await tr.$("td.call button"); if (b) await b.click(); }
      for (const b of await page.$$(".bet")) { const o = await b.$(".opts button"); if (o) await o.click(); }
      const nx = await page.$('figure.stepper [data-nav="next"]'); if (nx) for (let i = 0; i < 12; i++) await nx.click({ force: true }).catch(() => {});
      const rb = await page.$(".reask .live-chips button:nth-child(2)"); if (rb) await rb.click();
      await page.waitForTimeout(200);
      const after = await page.evaluate(() => {
        const out = [];
        document.querySelectorAll(".casefile .stamps li.empty").forEach(() => out.push("case file still empty after clicking"));
        document.querySelectorAll("table.predict td.why .vd").forEach(v => { if (!/Right|Wrong/.test(v.textContent)) out.push("row verdict missing"); });
        if (document.querySelector(".bet") && !document.querySelector(".bet .verdict-line")) out.push("bet verdict line missing");
        if (document.querySelector(".reask") && !document.querySelector(".reask .verdict .vd")) out.push("reask verdict badge missing");
        return out;
      });
      problems.push(...after);
      const rs = await page.$(".casefile [data-reset]"); if (rs) await rs.click();
    } catch (e) { problems.push("interaction failed: " + e.message); }
    await page.evaluate(() => { try { localStorage.clear(); } catch (e) {} });
    await page.close();
    const uniq = Array.from(new Set(problems));
    if (uniq.length) { bad++; console.log("FAIL " + f); uniq.forEach(p => console.log("   - " + p)); }
    else console.log("ok   " + f);
  }
  await browser.close();
  process.exit(bad ? 1 : 0);
})();
