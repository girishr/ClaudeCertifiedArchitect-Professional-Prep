---
title: Roadmap
description: Release milestones, objectives, and delivery timeline
project: ClaudeCertifiedArchitect-Professional-Prep
language: en
lastUpdated: 2026-09-13
sourceOfTruth: project/project.yaml
---

# ClaudeCertifiedArchitect-Professional-Prep — Development Roadmap

Build timeline: 1–3 months · Scale tier: prototype · Team: solo

The site already ships and works. What remains is finishing the shift from a personal study repo — built by one candidate around one booked exam slot — into something any CCAR-P candidate can pick up on any day.

## Objectives

1. **Remove the single-candidate assumptions.** The material was written by someone sitting the exam on a fixed date; the dated study plan is the last visible trace of that.
2. **Close the provenance gap on modules 2–5.** Module 1 is distilled from the official module; 2–5 come from this repo's own notes. Honestly labelled today, but not equal in depth.
3. **Keep the guarantees that make it trustworthy.** Official facts only, no invented claims, accessibility commitments intact, nothing collected about visitors.

## Milestones

### M1 — Relative study plan *(in progress)*

The one live content exception to the content freeze (REQ-003.2).

- [ ] Reframe the 21-day plan from fixed calendar dates to Day 1…Day 21, startable any day
- [ ] Remove the fixed 5 Sep 2026 exam date and weekday labels from `study-plan.md`, the `PLAN` literal in `tools/build_hub.py`, and any course page that repeats them
- [ ] Rebuild and confirm the plan tracker and progress meter still work

**Done when:** a visitor can start on any day without mentally re-dating anything.

### M2 — Deepen modules 2–5

- [ ] Decide whether to enrol in the Partner Academy and distil 2–5 from the official modules, or keep building from this repo's domain notes
- [ ] Either way, keep every provenance notice accurate (REQ-004.3)

**Note:** distilling from the official modules is the bigger of the two paths and would push past the 1–3 month timeline. That choice is open.

### M3 — Guard the generated hub *(optional)*

- [ ] Add the one CI job worth having: rebuild `index.html` and fail on a diff, catching a hand-edited hub before it deploys (SEC-DEC-005)

Deliberately optional — see `quality/tests.md` for why there is no CI today.

## Goals & Success Criteria

The product-level measure, from `PRODUCT.md`: **a candidate who knows which domains they are weak in and passes on the first attempt.**

There is no usage telemetry and none is planned (SEC-DEC-002), so this is not measurable from the site — and that is an accepted trade. Proxy criteria that *can* be checked:

- The plan works for a visitor starting on an arbitrary day (M1).
- Every exam fact still matches the current official guide.
- Per-domain scoring still reflects the published weighting.
- Accessibility commitments (REQ-008) hold on every page.

## Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Anthropic revises the exam guide — weightings, item count, pass mark | High. Invalidates the exam brief, the bank's weighting and the scoring maths | Re-check the official guide before each material change; the current facts were obtained 20 Aug 2026 and that date is stated on the site |
| Anthropic reorganises the Partner Academy or docs | Medium. Outbound links rot | Periodic link check; the official path must stay reachable (REQ-010.2) |
| `index.html` hand-edited, then silently discarded by the next build | Medium. Lost work, or a broken live hub | Documented prominently in `development/context.md` and `CLAUDE.md`; M3 would make it mechanical |
| Content freeze eroded by well-meaning tidying | Medium. The prose *is* the product | REQ-007 states it plainly; `development/context.md` repeats it |
| Single maintainer | Low, accepted | Specs exist so the project is legible to someone picking it up cold |
