---
name: CCAR-P Prep Kit
description: Security Print — two inks on a tinted stock, engraved numerals, hairline rules, square corners.
colors:
  plate: "#0c1310"
  sheet: "#111a16"
  sheet-2: "#16211c"
  ink: "#eef1ea"
  ink-soft: "#b6c2b8"
  ink-faint: "#7d8a82"
  rule: "#2a352f"
  rule-firm: "#46544c"
  tint: "#3ba57c"
  oxblood: "#c9636a"
  gold: "#c9a24a"
  ink-fill: "#17624a"
  ink-fill-t: "#eef1ea"
  accent-dim: "#143024"
  code-bg: "#0f1815"
typography:
  display:
    fontFamily: "Bodoni Moda VF, Bodoni 72, Didot, Georgia, serif"
    fontSize: "clamp(26px, 4.4vw, 44px)"
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: "-0.018em"
  headline:
    fontFamily: "Bodoni Moda VF, Bodoni 72, Didot, Georgia, serif"
    fontSize: "2.6rem"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Bodoni Moda VF, Bodoni 72, Didot, Georgia, serif"
    fontSize: "21px"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  numeral:
    fontFamily: "Bodoni Moda VF, Bodoni 72, Didot, Georgia, serif"
    fontSize: "40px"
    fontWeight: 600
    lineHeight: 1
    fontFeature: "tabular-nums"
  body-read:
    fontFamily: "Faustina VF, Iowan Old Style, Charter, Georgia, serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.62
    letterSpacing: "normal"
  body-ui:
    fontFamily: "Archivo VF, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
  label:
    fontFamily: "Archivo VF, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "13.5px"
    fontWeight: 650
    lineHeight: 1.45
    letterSpacing: "0.005em"
  serial:
    fontFamily: "Chivo Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "0.14em"
    fontFeature: "tabular-nums"
rounded:
  none: "0"
  dot: "50%"
spacing:
  hair: "3px"
  xs: "8px"
  sm: "10px"
  md: "16px"
  lg: "22px"
  xl: "26px"
  foot: "96px"
components:
  button-default:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    typography: "{typography.body-ui}"
    rounded: "{rounded.none}"
    padding: "7px 13px"
  button-default-hover:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.tint}"
  button-primary:
    backgroundColor: "{colors.ink-fill}"
    textColor: "{colors.ink-fill-t}"
    typography: "{typography.body-ui}"
    rounded: "{rounded.none}"
    padding: "7px 13px"
  button-primary-hover:
    backgroundColor: "transparent"
    textColor: "{colors.tint}"
  button-serial:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.serial}"
    rounded: "{rounded.none}"
    padding: "5px 9px"
  ink-block:
    backgroundColor: "{colors.ink-fill}"
    textColor: "{colors.ink-fill-t}"
    rounded: "{rounded.none}"
    padding: "16px 20px"
  card-plate:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "20px 22px"
  tab-ledger:
    backgroundColor: "transparent"
    textColor: "{colors.ink-faint}"
    rounded: "{rounded.none}"
    padding: "11px 18px 10px"
  tab-ledger-selected:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
  pill:
    backgroundColor: "transparent"
    textColor: "{colors.ink-faint}"
    typography: "{typography.serial}"
    rounded: "{rounded.none}"
    padding: "3px 7px"
  pill-on:
    backgroundColor: "transparent"
    textColor: "{colors.tint}"
  option-row:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "11px 13px"
  input-date:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.serial}"
    rounded: "{rounded.none}"
    padding: "3px 2px"
  explanation-panel:
    backgroundColor: "{colors.sheet-2}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "15px 17px"
---

# Design System: CCAR-P Prep Kit

## Overview

**Creative North Star: "Security Print"**

A certificate resists forgery by being unreproducibly precise, and so does an honestly weighted score report. This system is built out of the printing craft credentials are actually made from: intaglio line work, guilloche, engraved numerals, security tints, plate serials, counterfoils. Two inks on a tinted stock and nothing more. Structure carries all the ornament — plate lines, ruled indexes, serial strips, a seal — so the instrument feels issued rather than assembled.

Dark is the default and it is the engraved steel plate: a green-black ground with warm ink-white lettering. Light is not white and not cream; it is tinted safety stock. Both themes are first-class and both are shipped in `course/assets/print.css`; there is deliberately no `prefers-color-scheme` block, because the site carries its own toggle and persists the choice in `localStorage` under `ccarp-theme` (applied before paint by `course/assets/nav.js`). `nav.js` also injects `print.css` on every page **before** `nav.css` and before any page's own stylesheet — that injection order is the mechanism that makes one file own the palette and the type site-wide, and it must not be reordered.

Density is high and honest: a workbench, not a brochure. Long-form reading gets a narrow measure and a serif; the workbench gets a grotesque at 13–15px with ruled rows. The world explicitly refuses the arrangement this category ships — equal rounded cards on near-black with one blue accent and a progress bar. There are no rounded corners, no shadows, no gradients, and no progress bar on the learning path: the count is printed instead.

**Key Characteristics:**
- Two inks (intaglio green, oxblood) plus one reserved gold, on a tinted stock
- Square corners everywhere, including SVG geometry
- Hairline 1px rules with a 2px plate line as the only heavier weight
- Four self-hosted faces, each with one named job
- Ruled ledger rows instead of card grids
- Ornament only in structure — never inside a question body or a timed screen

## Colors

Two printing inks and three tonal plate levels; every hue in the system is either ink, rule, or stock.

### Primary
- **Intaglio Green** (`tint`): ink one. Links, the selected ledger tab's underline, meter and bar fills, checked control marks, active pills, the rosette's engraved line work, `accent-color` and `::selection`. It is line and mark, not field.
- **Printed Ink Field** (`ink-fill` / `ink-fill-t`): the darker, denser green used *only* where a large area must read as solid printed ink — the single filled call-to-action block on the hub and the one filled `.path-start` block on a lesson sheet. It exists because the bright tint, correct as a hairline, was wrong as a filled field: too loud and it dropped the text's contrast. Text on it is always `ink-fill-t`.

### Secondary
- **Oxblood** (`oxblood`): ink two. Wrong answers, the low-time state on the timer, the `.flag` callout label, the shortfall cut in the rosette, `caret-color`, and link hover. Correction and caution, never decoration.

### Tertiary
- **Seal Gold** (`gold`): reserved. The 720 pass mark (the dashed ring in the rosette, the target line on every domain bar) and the focus ring. The official badge acts as the seal. Nothing else takes gold.

### Neutral
- **Plate** (`plate`, aliased `--paper`): the ground of every page.
- **Sheet** / **Sheet 2** (`sheet`, `sheet-2`): a plate face raised off the ground, and a second level for wells, table stripes and the explanation panel.
- **Ink / Ink Soft / Ink Faint** (`ink`, `ink-soft`, `ink-faint`): lettering, secondary prose, and serial/meta text respectively.
- **Rule / Rule Firm** (`rule`, `rule-firm`): the hairline and the plate line.
- **Code Bed** (`code-bg`), **Accent Dim** (`accent-dim`): inline/blocked code ground, and the quiet tinted ground retained for legacy callouts.

The light theme redefines every token above on `:root[data-theme="light"]` (stock `#e4e7dd`, ink `#101a15`, deep intaglio `#0e6b4d`, oxblood `#8c1f2d`, gold `#8a6d1e`); `@media print` redefines them again to black ink on white. All three sets live in `print.css` and in the sidecar's `colorMeta`.

**Legacy token aliases are load-bearing, not clutter.** `print.css` intentionally publishes `--paper`, `--accent`, `--accent-dim`, `--good`, `--bad`, `--flag`, `--code-bg` as second names for world tokens, because `lesson.css`, the SVG diagram classes and some hub markup name them. The hub template's own `:root` adds `--grid`, `--muted`, `--text-secondary`, `--success-text`, `--critical` for the same reason. `nav.css` deliberately resolves each of its colours through a fallback chain (course token, then hub token, then a plain value) so the menu works on both stylesheets. Do not "clean up" any of these; removing an alias silently unstyles pages.

### Named Rules
**The Two Inks Rule.** Any surface may use exactly two inks — intaglio green and oxblood — over stock and rules. A third hue is not a design decision available here.

**The Reserved Gold Rule.** Gold means *pass mark* or *seal*, plus the focus ring. If a new element wants gold, it is asking to be a pass mark; if it is not one, it takes ink-faint.

**The Ink-Fill Rule.** A filled colour field is printed ink (`ink-fill`), never the bright tint, and there is at most one filled block per sheet. Everything else is line work on stock.

**The Bare-Plate Rule.** An empty state is unengraved plate: the low-density line work with nothing cut into it. Never a grey placeholder fill, never a zeroed bar dressed as data.

## Typography

**Display Font:** Bodoni Moda VF (with Bodoni 72, Didot, Georgia, serif) — `--cut`
**Body Font:** Faustina VF (with Iowan Old Style, Charter, Georgia, serif) — `--read`
**UI Font:** Archivo VF (with system-ui, Segoe UI) — `--ui`
**Mono/Serial Font:** Chivo Mono (with ui-monospace, Menlo) — `--num`

All four are self-hosted `woff2` in `course/assets/fonts/` (variable axes for Bodoni, Archivo and Faustina; two static weights for Chivo Mono), sourced from npm Fontsource with the OFL licence file kept alongside. There are no third-party font requests. OpenDyslexic ships beside them as an accessibility option, switched from the menu and remembered; it replaces the faces on body text while code, figures and SVG keep their own.

**Character:** Bodoni's high-contrast engraved cuts do the credential lettering and the numerals; Faustina reads warmly at length; Archivo is the workbench voice; Chivo Mono is the plate's own numbering. The pairing is a certificate: an engraved face for what is being certified, a plain face for the work.

### Hierarchy
- **Display** (Bodoni 700, `clamp(26px, 4.4vw, 44px)`, 1.02, `-0.018em`): the credential name in the hub masthead. One per page.
- **Headline** (Bodoni 700, 2.6rem, 1.08, `-0.015em`): the lesson sheet's title.
- **Title** (Bodoni 600, 21px on the hub / 1.35rem in lessons, `-0.01em`, `text-wrap: balance`): section and plate headings.
- **Numeral** (Bodoni 600, tabular, 40px hero / 21px counterfoil / 19px countdown): engraved figures — score, items, minutes, pass mark, days to go. Numbers are display material in this world, not body text.
- **Body (reading)** (Faustina 400, 17px root, 1.62): lesson prose and the practice scenario, held to `--prose`.
- **Body (workbench)** (Archivo 400, 15px / 13.5px, 1.55): hub prose, tables, ledger descriptions.
- **Label** (Archivo 650, 13.5px): question stems, emphasised row text, sub-headings.
- **Serial** (Chivo Mono 400, 11px / 0.66rem, `0.10–0.16em`, uppercase, `ink-faint`): every meta, kicker-free caption, breadcrumb, pill, table head, figcaption, `dt`, tab of the plate's own numbering. The shared `.serial` primitive in `print.css` is the canonical form.

### Named Rules
**The Four Jobs Rule.** Each face has exactly one job: Bodoni engraves display text and numerals, Faustina sets long-form reading, Archivo sets the workbench UI, Chivo Mono sets serials and tabular figures. A face used outside its job is a bug.

**The Serial Rule.** Anything that labels rather than speaks — table heads, captions, pills, breadcrumbs, wayfinding, field labels — is Chivo Mono at 11px/0.66rem, tracked `0.14em`, uppercase, in `ink-faint`. Uniform and unmissable.

**The Tabular Figures Rule.** Figures line up everywhere, not only in tables: `print.css` applies `font-variant-numeric: tabular-nums` to `table`, `.serial`, `.fig`, `time` and `.num` globally.

## Layout

The hub is a single centred plate, `max-width: 68rem`, padded `24px 20px 96px`; the course sheet is `max-width: 62rem` (`--page`) padded `4rem 2rem 8rem`. The persistent left index is fixed at `--nav-w` (17rem default, user-resizable 200–520px, remembered); above `64.01rem` the page indents by that width rather than overlaying, and below it the menu overlays behind a backdrop.

Repeated content is a ruled index, not a grid of cards. The module ledger, the study-plan days, the domain bars and the learning path are all CSS grids of fixed leading columns (serial, icon, body, status) separated by 1px hairline row rules, opened and closed by a 2px plate line. Breakpoints in use: `720px` (rosette goes two-column), `760px` (masthead collapses to two columns), `64rem` / `64.01rem` (menu mode, and lesson measures release to 100%), `560px` and `34rem` (ledger and day rows fold to two columns, TOC to one column).

Rhythm is 8/10/16/22/26px on the workbench and rem-based (0.6/1.1/2/3rem) on the reading sheet. Vertical separation is done with rules and margin, never with a card gap.

### Named Rules
**The Two Measures Rule.** Two widths, defined in `lesson.css` and nowhere else: `--prose` (28rem) is the reading measure and constrains body-level `p`, `ul`, `ol`; `--measure` (40rem) is the wider structural width for figures, tables, callouts, apparatus and pager. Separating them was a deliberate fix — do not collapse them back into one variable, and do not redefine either in another stylesheet.

**The Ledger Rule.** Three or more sibling items are ruled rows in one index sharing column tracks. If a design reaches for a grid of equal cards, it has left this world.

**The Printed Count Rule.** Progress is a printed count, not a bar. The learning path's track is explicitly hidden; the number stands alone. (Short, bounded measures — the plan meter, domain accuracy bars — are 1px-bordered tracks with a flat tint fill and a gold target line, which is a ruled gauge, not a progress bar.)

## Elevation & Depth

There are no shadows in this system, in either theme, on any element. Nothing is lifted; everything is printed on one sheet. Depth comes from three places: tonal plate levels (`plate` ground → `sheet` plate face → `sheet-2` well), rule weight (1px hairline for separation, 2px `rule-firm` plate line for a structural boundary or a head), and ink density — the rosette's guilloche builds value by stacking 0.6px lines, the way an engraving does, rather than by opacity washes over a fill. There are no gradients.

### Named Rules
**The No-Shadow Rule.** No `box-shadow`, no `text-shadow`, no `filter: drop-shadow`, no gradient, in any state including hover and focus. A surface that needs to read as raised gets `sheet` and a hairline.

**The Line-Density Rule.** Where tone is needed, cut more lines. Value is built from stroke count, not from fills or blurs.

## Shapes

Square, without exception on rectangles. `border-radius: 0` is asserted on buttons, inputs, cards, pills, callouts, code blocks, the menu, the pager and the focus outline, and `print.css` carries `figure.diagram rect, svg rect { rx: 0; ry: 0 }` so drawn geometry obeys the same rule. The only curve in the form language is a true circle used as a circle: radio controls (`border-radius: 50%` on the box and its 7px mark) and the rosette's rings and dots.

Borders do the work radius would have done: a 1px hairline in `rule` bounds a plate, `rule-firm` bounds a counterfoil, a gauge track or a table head, and 2px `rule-firm` opens a masthead, a ledger or an explanation panel. Marginal apparatus (`.sidenote`, `.flag`) is marked with a 1px left hairline in `rule-firm` — a rule, never a coloured bar. Focus is a 2px gold outline offset 2px, with `border-radius: 0`.

## Components

### Buttons
- **Shape:** square (`border-radius: 0`), 1px `rule-firm` border, 7px/13px padding, Archivo 13px.
- **Default:** `sheet` ground, `ink` text. Hover moves border and text to `tint` — no fill change.
- **Primary (filled ink):** `ink-fill` ground and border, `ink-fill-t` text, weight 600. Hover *empties* it: transparent ground with `tint` border and text. This inversion is the house hover.
- **Serial button** (theme toggle): transparent, 1px `rule` border, Chivo Mono 11px tracked `0.14em` uppercase, 5px/9px.
- **Disabled:** opacity 0.45, border `rule`, text `ink-faint`, default cursor.
- **Focus:** 2px `gold` outline, 2px offset, square.

### The Ink Block (primary call to action)
The one filled field on a sheet: a full-width `ink-fill` bar, 16px/20px padding, bold line plus a quieter sub-line at 0.82 opacity, and a bordered `currentColor` serial "go" chip at the right. Hover empties it to transparent with `tint`. At most one per page; `.path-start` is its lesson-sheet equivalent.

### Cards / Plates
- **Corner Style:** square.
- **Background:** `sheet` on the hub; lesson callouts use `flag`.
- **Border:** 1px `rule`. No shadow, ever.
- **Internal Padding:** 20px 22px (hub plate), 1rem 1.2rem (lesson callout).

### Inputs / Fields
Controls are drawn as printed rules, not boxes: the exam-date input is transparent with a single 1px `rule-firm` underline and Chivo Mono 11.5px, its unset value in `ink-faint` and its set value in `ink`. Checkboxes and radios are `appearance: none`, 15px, 1px `rule-firm`, transparent, with a 7px `tint` mark that scales in over 0.12s; checked state also moves the border to `tint`. Radios are circular; checkboxes are square.

### Ledger Index (rows)
Grid rows (`96px 34px 1fr auto` on the hub; `6.4rem 2.2rem 1fr auto` on the path) separated by 1px `rule` and bounded by 2px/1px `rule-firm`. Leading column is a Chivo Mono serial; a 30px line-art SVG sits beside it; Bodoni 700 title; a serial pill at the right. The "next" row is marked by moving its serial and icon to `tint` — nothing moves, nothing fills.

### Tabs (ledger index)
A horizontal band between two 1px `rule-firm` rules, buttons divided by 1px hairlines, `ink-faint` at rest, `ink` on hover, and selected by a 2px `tint` bottom rule with weight 650. Not pills, no fill.

### Navigation (persistent side index)
Fixed left sheet on `flag` ground with a 1px right hairline, Archivo 0.84rem, Bodoni brand mark at the head, Chivo Mono group heads at 0.7rem/`0.16em` and Chivo Mono item numbers. The current page is marked by a 1px `tint` left rule and `ink` text — the earlier tinted-background highlight is explicitly overridden. Slides in on a 0.18s transform; an 8px resizer handle shows a 2px `tint` line on hover or focus. Reduced motion is honoured globally (`print.css` collapses all transitions to 0.001ms).

### Practice surface
Deliberately bare. Option rows are 1px `rule` boxes with a serial key letter, gaining a `tint` border when correct and `oxblood` when wrong; the explanation panel is `sheet-2` under a 2px `rule-firm` head with a Chivo Mono caption; the timer is Chivo Mono tabular, turning `oxblood` when low. The scenario is the one place Faustina appears on the hub, at 16px/1.6 within 72ch.

### Calibration Rosette (signature component)
The system's signature: a guilloche rosette engraved live in `<canvas>` from the published domain weights — superposed epitrochoids, the way a rose engine cuts a certificate. Seven lobes, one per exam domain, numbered clockwise from the top; a lobe's reach is that domain's published weighting, interpolated between neighbours so the line stays continuous; its green ink is the accuracy earned in that domain, cut only into its own sector, so an unattempted domain is left as bare plate. Oxblood cuts the shortfall of any lobe under the pass mark, and a dashed gold ring marks 72% (the 720 mark). It reads its inks from the live custom properties, so it follows the theme, and it is drawn at up to 2× DPR into a 600px square inside a 1px `rule-firm` plate with a Chivo Mono figcaption. Code: `drawRosette()` in `tools/hub-template.html` (shipped as `index.html`, generated by `tools/build_hub.py`). It owns the Results tab and appears nowhere else.

## Do's and Don'ts

### Do:
- **Do** let `course/assets/print.css` own the palette and the type, and keep `nav.js` injecting it first — before `nav.css`, before any page stylesheet.
- **Do** ship both themes as real, hand-authored token sets on `:root` (dark plate, default) and `:root[data-theme="light"]` (tinted stock), toggled by the site and remembered in `localStorage` under `ccarp-theme`.
- **Do** keep every legacy alias (`--paper`, `--accent`, `--accent-dim`, `--good`, `--bad`, `--flag`, `--code-bg`, and the hub's `--grid`, `--muted`, `--text-secondary`, `--success-text`, `--critical`) and `nav.css`'s fallback chains intact.
- **Do** square every corner, including `rx: 0; ry: 0` on SVG rects; circles only where the thing is genuinely a circle.
- **Do** separate with a 1px hairline (`rule`) and structure with a 2px plate line (`rule-firm`).
- **Do** use `ink-fill` for any filled field, at most one filled block per sheet, and invert to an empty `tint` outline on hover.
- **Do** set every label, caption and wayfinding string as a Chivo Mono serial at 11px/`0.14em` uppercase.
- **Do** hold body-level prose to `--prose` (28rem) and structural blocks to `--measure` (40rem), both defined only in `lesson.css`.
- **Do** keep the built world self-hosted: fonts under `course/assets/fonts/` with their OFL licence, no third-party requests.
- **Do** keep pages printing usefully — every stylesheet ships a `@media print` block that returns the world to black ink on white.

### Don't:
- **Don't** add a shadow, a gradient, or a blur to anything, in any state.
- **Don't** round a rectangle.
- **Don't** introduce a third ink, and don't spend gold on anything that is not the pass mark, the seal, or the focus ring.
- **Don't** fill a large field with the bright `tint`; that is what `ink-fill` exists for.
- **Don't** lay repeated items out as a grid of equal cards, and don't add a progress bar to the learning path — the count is printed.
- **Don't** put ornament — rosette, guilloche, seal, plate border — inside a question body or a timed screen. Those surfaces stay bare.
- **Don't** use a face outside its job, and don't set numerals in anything but Bodoni (display figures) or Chivo Mono (tabular figures).
- **Don't** edit `index.html` directly; it is generated from `tools/hub-template.html` by `tools/build_hub.py`.
- **Don't** remove the OpenDyslexic option or its exclusions for code, figures and SVG.
