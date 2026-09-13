---
title: Requirements
description: Functional and non-functional requirements for the project
project: ClaudeCertifiedArchitect-Professional-Prep
language: en
lastUpdated: 2026-09-13
sourceOfTruth: project/project.yaml
---

# ClaudeCertifiedArchitect-Professional-Prep Requirements

## Project Overview

A free companion to Anthropic's official five-module CCAR-P prep path (733 minutes). It distils the official material so it can be read rather than sat through, and adds the practice layer the official path does not provide: a 21-day study plan, a 75-question scenario bank with per-distractor explanations, and per-domain scoring against the published exam weighting.

**Success is a candidate who knows which domains they are weak in and passes on the first attempt.**

## Target users

**Students** — specifically, candidates preparing for the CCAR-P exam. They work at Claude Partner Network organisations (registration requires a work email on a recognised domain). They arrive with a fixed amount of time, a paid exam slot ahead of them, and uneven confidence across seven weighted domains.

Two distinct usage situations, and the site must serve both:

- **Long reading sessions** on a laptop, working through a module.
- **Short drill sessions** to test recall.

### Access control

`public` — no login, no accounts, no user records. Nothing is collected about a visitor.

## Functional Requirements

### REQ-001 — Practice engine

- **REQ-001.1** Three modes: domain drill with instant feedback; 20-question timed quick set; 63-question 120-minute mock.
- **REQ-001.2** A mock withholds all feedback until the end. This is deliberate — it is the only way to get a real score.
- **REQ-001.3** 75 scenario questions, weighted to the published domain split, each with an explanation and per-distractor notes.
- **REQ-001.4** Both item types the real exam uses: single-answer (56) and multi-answer (19). Each item states how many to select.

### REQ-002 — Results

- **REQ-002.1** Estimated scaled score, on the official 100–1000 range.
- **REQ-002.2** Overall accuracy, plus per-domain accuracy bars against the 72% pass mark.
- **REQ-002.3** A table view of the same results.
- **REQ-002.4** Scoring follows the published domain weighting, never a flat percentage.

### REQ-003 — Study plan

- **REQ-003.1** 21 days across three weeks, tickable, with a progress meter.
- **REQ-003.2** *In progress.* Reframe from a fixed calendar (anchored to a 5 Sep 2026 exam date) to a relative 21-day plan any visitor can start on any day. This is the one content exception to REQ-007.2 — the audience is now other candidates, not one person with one booked slot.

### REQ-004 — Course

- **REQ-004.1** Module 1: twelve sections distilled from Anthropic's official module, in the official order, with checkpoints and diagrams.
- **REQ-004.2** Modules 2–5: 35 sections built from this repo's own domain notes, arranged in official module order.
- **REQ-004.3** Every module 2–5 page states its provenance — that it was *not* distilled from the official module, which sits behind Partner Academy enrolment.
- **REQ-004.4** Every page has previous/next links and a persistent side nav.

### REQ-005 — Exam brief

- **REQ-005.1** Confirmed exam facts and domain weightings, from the official guide (obtained 20 Aug 2026), and nothing the guide does not confirm.

### REQ-006 — Hub structure

- **REQ-006.1** Five tabs: Course, Study plan, Practice, Results, Exam brief.
- **REQ-006.2** Deep links via hashes (`#tab-plan`, `#tab-practice`); the shared side nav depends on them and must keep working.

### REQ-007 — Content integrity

- **REQ-007.1** Question bank contents, quiz mode behaviour, scoring maths and per-domain results logic are **fixed**. Do not change them.
- **REQ-007.2** Prose copy, headings, explanations and exam facts are **fixed**. Do not rewrite them. (Exception: REQ-003.2.)

## Non-Functional Requirements

### REQ-008 — Accessibility and inclusion

- **REQ-008.1** OpenDyslexic is self-hosted and offered on course pages. **That option must survive.**
- **REQ-008.2** Real contrast, keyboard-operable controls and honest focus states — required by both long-form reading and timed testing.
- **REQ-008.3** Pages must print usefully. The pattern-selection sheet is an explicit print target (`course/assets/print.css`).
- **REQ-008.4** Light and dark themes, toggled and remembered in `localStorage`.

### REQ-009 — Build and hosting

- **REQ-009.1** Static GitHub Pages only. No server, no runtime dependency, no package manager.
- **REQ-009.2** The only build is `python3 tools/build_hub.py`, which regenerates `index.html`.
- **REQ-009.3** **`index.html` is generated and must never be hand-edited.** Changes go to `tools/hub-template.html`, `questions.json`, or the `PLAN` literal.

### REQ-010 — Brand commitments

- **REQ-010.1** The official badge (`assets/badge.png`) stays visible.
- **REQ-010.2** Links to the official Partner Academy path and exam guide stay present, alongside the statement that the official course is free, authoritative, and not replaced by this site.
- **REQ-010.3** Product name in full: "Claude Certified Architect - Professional". Exam code CCAR-P.
- **REQ-010.4** Voice: plain, direct, unhyped, second person. No gamification, no motivational filler.

## Product Principles

1. The official path is the spine; this site is the practice and revision layer around it, and says so.
2. Honest signal over encouragement.
3. Weighted by the real exam, not by convenience.
4. Readable in one pass; revision sheets print well.
5. Nothing is claimed that the official guide does not confirm.

## Non-goals

No accounts, no backend, no database, no analytics and no tracking: nothing is collected about a visitor and progress is not persisted across visits. Does not replace Anthropic's official prep path, which stays authoritative and must remain linked. Does not introduce a framework, bundler or dependency: plain HTML, CSS and vanilla JS only. Does not change question bank contents, quiz mode behaviour, scoring maths or per-domain results logic; does not rewrite prose copy, headings, explanations or exam facts. Does not invent testimonials, pass rates, user counts or endorsements, and claims nothing the official exam guide does not confirm. No gamification or motivational filler. Not a dumps site: no real or reconstructed exam items.

## Assumptions

- [ASSUMPTION] The official exam guide's facts and weightings (obtained 20 Aug 2026) remain current. A published revision invalidates the exam brief, the bank's weighting and the scoring.
- [ASSUMPTION] Candidates confirm Partner Network eligibility themselves; the site states the requirement but cannot check it.
- [ASSUMPTION] Losing progress on refresh is an acceptable trade for collecting nothing about visitors.
