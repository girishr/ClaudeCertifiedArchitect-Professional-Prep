---
title: Test Strategy
description: Test strategy, coverage goals, and quality approach
project: ClaudeCertifiedArchitect-Professional-Prep
language: en
lastUpdated: 2026-09-13
sourceOfTruth: project/project.yaml
---

# ClaudeCertifiedArchitect-Professional-Prep Test Strategy

## Overview

Strategy: **none** — no automated tests and no CI, chosen deliberately for a solo static site with zero runtime dependencies. Verification is manual, against the checklist below.

This is a recorded decision, not an oversight. Revisit it if the project gains a second maintainer or the scoring logic changes.

## Manual verification checklist

Run before pushing anything that touches the hub or a course page.

### After any hub change

1. `python3 tools/build_hub.py` completes without error.
2. `git diff --stat index.html` shows the regenerated file — and the source change is committed with it.
3. Open `index.html`: all five tabs render (Course, Study plan, Practice, Results, Exam brief).
4. Hash deep links still resolve: `#tab-plan`, `#tab-practice` (REQ-006.2).
5. Run a domain drill, a 20-question quick set, and enough of a mock to confirm it withholds feedback until the end (REQ-001.2).
6. Results show the scaled score, overall accuracy, per-domain bars against the 72% pass mark, and the table view (REQ-002).
7. Theme toggle works and survives a reload (REQ-008.4).

### After any course-page change

1. Previous/next links and the side nav work in both directions.
2. OpenDyslexic toggle still present and effective (REQ-008.1).
3. The page prints usefully; check `print.css` targets, especially the pattern-selection sheet (REQ-008.3).
4. If the page belongs to modules 2–5, its provenance notice is intact (REQ-004.3).

### After any `questions.json` change

1. The file parses: `python3 -c "import json; json.load(open('questions.json'))"`.
2. Every item keeps the full shape: `id`, `domain`, `type`, `selectCount`, `scenario`, `question`, `options`, `correct`, `explanation`, `distractorNotes`, `reference`, `difficulty`.
3. The domain split still matches the published weighting (see `architecture/architecture.md`).
4. `selectCount` agrees with `type` and with the length of `correct`.

> Note REQ-007.1: bank contents, quiz behaviour, scoring maths and per-domain logic are fixed. In practice this checklist guards a change that *shouldn't* be happening — if you are running it against edited questions, confirm that was actually asked for.

## Accessibility checks

Keyboard-only pass over the practice engine (start, answer, submit, review) and the course nav; visible focus states throughout; contrast in both themes (REQ-008.2).

## If tests are added later

The highest-value targets, in order:

1. **Scoring maths** — per-domain accuracy and the scaled-score estimate. The logic most likely to break silently and the most costly to get wrong.
2. **`build_hub.py`** — that placeholders are substituted and the output parses.
3. **A guard that `index.html` is regenerated, not hand-edited** — e.g. rebuild in CI and fail on a diff.
4. **Link integrity** across 55 course pages, previous/next and side nav.

## Coverage goals

None set. See above.
