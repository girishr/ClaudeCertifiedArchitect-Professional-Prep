---
fileID: TASKS-001
description: Sprint tracker with backlog, current sprint, and completed work
lastUpdated: 2026-09-13
version: 1.0
contributors: [girishr]
relatedFiles: [roadmap.md, project.yaml, requirements.md]
---

# ClaudeCertifiedArchitect-Professional-Prep — Task Tracking

Task ID conventions

- BL-###: Backlog items
- CS-###: Current Sprint items
- CD-{devPrefix}-###: Completed items (e.g. CD-girishr-001)
- PROMPT-{devPrefix}-###: Prompt log entries (e.g. PROMPT-girishr-001)

## Current Sprint

Timeline: 1-3m · Milestone: M1 — Relative study plan

1. **[CS-001]** Reframe the `PLAN` literal in `tools/build_hub.py` from weekday labels to relative days.
   *Priority: high · Status: not-started · REQ-003.2 · M1*
   All 21 day entries carry a `"date"` field holding a weekday (`"Mon"`, `"Tue"`, …), which reads as a fixed calendar week. Change to relative labels (`"Day 1"` … `"Day 21"`) or drop the field and let `n` carry it. Check `hub-template.html` for how `date` is rendered before changing its shape.

2. **[CS-002]** Update the four weekday references in `study-plan.md` to match CS-001.
   *Priority: high · Status: not-started · REQ-003.2 · M1*

3. **[CS-003]** Rebuild and verify the plan tracker.
   *Priority: high · Status: not-started · depends on CS-001, CS-002*
   `python3 tools/build_hub.py`, then walk the manual checklist in `quality/tests.md`: tabs render, `#tab-plan` resolves, ticks and the progress meter work, and the regenerated `index.html` is committed with the source change.

4. **[CS-004]** Refresh the fixed-date language in `PRODUCT.md`.
   *Priority: medium · Status: not-started · M1*
   `PRODUCT.md` still describes the 5 Sep 2026 exam date and the reframe as pending. Once CS-001–003 land, state it as done. (`.impeccable/surfaces/tools-hub-template-html.md` also mentions it — that is generated tooling output, leave it alone.)

## Backlog

5. **[BL-001]** Decide the provenance path for modules 2–5.
   *Priority: medium · M2 · REQ-004.2, REQ-004.3*
   Either enrol in the Partner Academy and distil 2–5 from the official modules, or continue from this repo's domain notes. The first is materially larger than the current timeline. Whichever is chosen, every provenance notice must stay accurate.

6. **[BL-002]** Re-verify exam facts against the current official guide.
   *Priority: medium · Risk mitigation*
   Facts on the site were obtained 20 Aug 2026. Re-check the guide (weightings, 63 items, 720 pass mark, cost, retake policy) before any material change, and update the stated date if it moves. A revision invalidates the exam brief, the bank's weighting and the scoring.

7. **[BL-003]** Outbound link check.
   *Priority: low*
   Anthropic reorganises docs periodically. Verify Partner Academy, platform/code docs and the exam guide PDF still resolve; the official path must stay reachable (REQ-010.2).

8. **[BL-004]** Add the rebuild-and-diff CI guard.
   *Priority: low · M3 · optional*
   One GitHub Actions job: run `build_hub.py`, fail if `index.html` differs. Catches a hand-edited hub before it deploys. Deliberately optional — see `quality/tests.md` and SEC-DEC-005.

9. **[BL-006]** Upstream defect: `/specpilot-validate` reports false broken cross-references.
   *Priority: low · vendor file, no action needed on our content*
   The generated `.claude/commands/specpilot-validate.md` script mis-parses inline YAML arrays in `relatedFiles` (e.g. `[roadmap.md, project.yaml, requirements.md]`): its `sed` range returns a multi-line blob and the unquoted loop variable then word-splits into a mangled string, so it reports `roadmap.md`, `security-decisions.md` and `threat-model.md` as broken when all three exist. Ignore those three findings; the rest of the validator is sound. Left unmodified because it is SpecPilot-generated — fix upstream or patch locally if it becomes noisy.

10. **[BL-005]** Accessibility pass across the 55 course pages.
   *Priority: low · REQ-008*
   Keyboard-only walkthrough of the practice engine and course nav, visible focus states, contrast in both themes, and a print check on the pattern-selection sheet.

## Completed

1. [CD-001] Initialise .specs directory (2026-09-13)
2. [CD-girishr-002] SpecPilot onboarding: populated all spec files from repository analysis — architecture, requirements (REQ-001–010), threat model, security decisions, test strategy, roadmap and this tracker (2026-09-13)
