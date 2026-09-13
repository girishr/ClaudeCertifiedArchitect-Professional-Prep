# Working notes

## Teaching preferences

- **No em dashes anywhere.** Hyphens only. This applies to lessons, reference docs and
  chat.
- Natural, human prose. No AI-sounding filler: no "in today's landscape", no "delve",
  no "it's important to note", no "leverage" where "use" works.
- Reasonably concise. Get to the point.
- Skip beginner scaffolding. He ships production systems and uses Claude Code daily.

## Session design

- Short lessons. Real job, ~50 reports, limited evenings.
- Bias toward **decision practice** over terminology recall. The exam's distractors are
  real techniques applied at the wrong time, so the skill being trained is
  constraint-spotting, not definition-matching.
- Every quiz item should be scenario-first with a binding constraint buried in it.

## Course structure decision

The official Lesson 1, "Claude Platform & Solution Design", is 238 minutes and spans exam
Domains 1 and 2. Too much for one sitting, so this track breaks it into short lessons,
each one tangible win.

**Restructured 19 Aug 2026.** The first plan was invented from the domain list. Then the
gated course page gave up its **learning objectives**, which are the real syllabus, and
two of them were missing from my plan entirely: platform entry points, and delivery
routes. The sequence now follows Anthropic's published objectives rather than my guess.
See learning record 0002.

That seven-lesson track has since been retired. Once the official module itself became
readable, it was distilled section by section into `course/module-01/`, twelve sections
following Anthropic's own structure rather than an inference from the objectives. The
seven lessons overlapped six of those twelve, used a "six patterns" counting the module
does not use, and were deleted rather than maintained alongside it.

Module 1 is complete and distilled from the official module itself.

**Modules 2 to 5 written 12 Sep 2026, from a different source.** The official content for
those four is behind the Partner Academy enrolment and was not readable during that
session, so they were not distilled. They were built from this repo's own domain notes
instead, arranged to follow the official module order:

| Module | Sections | Built from | Domain |
|---|---|---|---|
| 2 Enterprise Integration & Production | 12 | `notes/02-integration-evals.md` | 3 and 4, 35% |
| 3 Responsible AI, Safety & Risk | 8 | `notes/03-governance-stakeholder.md`, Domain 5 part | 5, 14% |
| 4 Stakeholder, Lifecycle & GTM | 8 | `notes/03-governance-stakeholder.md` Domain 6 part, plus Lab 8 | 6, 14% |
| 5 Team Enablement & Productivity | 7 | `notes/01-solution-design-models-devprod.md`, Domain 7 part | 7, 7% |

The distinction is load-bearing and is stated on every one of those module index pages in
a "Where this is from" flag, because learning record 0002 is exactly the failure this
would repeat otherwise: a syllabus inferred from the domain list, published as though it
followed Anthropic's own. No page in modules 2 to 5 cites a screen number or says "in the
original", and their section `.meta` rows read "From this kit's domain notes".

If the official modules become readable later, distil them section by section the way
Module 1 was done, and replace these rather than editing them to match.

`index.html` at the workspace root is the front door and every section links back to it.

## Live reading (added 13 Sep 2026)

Four mechanics that turn a section from reading into predicting, built once as
`course/assets/live.css` and `course/assets/live.js` and applied to a page by markup
alone. All twelve sections of Module 1 are converted; Section 01 is the reference.

- **Cold open**: a scenario and one committed choice before any teaching, locked once
  made, asked again at the end with a verdict on whether the reader held or changed.
- **Steppable figure**: HTML boxes with `data-at` / `data-hi`, Prev/Next and arrow keys,
  replacing a static SVG where the figure is a sequence.
- **Predict-then-reveal**: a table whose answer column is hidden behind chips until the
  reader commits; the Why column reveals with it. Also the "bet" for a Watch Out.
- **Case file**: one client, the claims triage assistant, carried through the path. Every
  call the reader makes is stamped and the panel lists where the case comes back.

State is per page in localStorage (`ccarp-live-<key>`). Each page also files its stamps
under one module key (`ccarp-case-m1`), so a later section's case file shows this
section's stamps first and every earlier section's beneath them. On a laptop or wider the
case file is a fixed rail on the right; below that it sits inline at the end.

Right and wrong are said out loud: picked chips fill red or olive with a cross or tick,
each row, bet and re-ask carries a RIGHT / WRONG badge, and the case file prefixes every
stamp with Right. or Wrong.

The full markup contract is the header comment in `live.js`. Rules when converting
further pages: the mechanic has to be earned by the material (a cold open needs a
question whose instinctive answer is wrong or premature; a stepper needs a sequence;
predict-then-reveal needs a mapping the reader can call), and no page gets all four just
because the first one did. `node tools/check_live.js <page.html>` checks the contract,
clicks every control and fails on script errors or em dashes; run it on every converted
page.

## Open questions to revisit

- Mission assumes an early-September sitting. Confirm once the Partner Network
  eligibility question is settled, since that gates registration entirely.
- Weak-area self-rating in MISSION.md is self-reported and untested. Replace it with
  measured per-domain accuracy from the practice bank once there are 40+ attempts.
