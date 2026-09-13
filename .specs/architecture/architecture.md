---
title: Architecture
description: System design, components, data flow, and architecture decisions
project: ClaudeCertifiedArchitect-Professional-Prep
language: en
lastUpdated: 2026-09-13
sourceOfTruth: project/project.yaml
---

# ClaudeCertifiedArchitect-Professional-Prep Architecture

## Overview

A static, dependency-free study site for the Claude Certified Architect - Professional (CCAR-P) exam, served from GitHub Pages. There is no server, no database and no runtime network call. The whole product is HTML, CSS and vanilla JS, plus one Python build script.

Two surfaces:

- **The hub** — [`index.html`](../../index.html), a single generated page with five tabs (Course, Study plan, Practice, Results, Exam brief). This is the workbench: the practice engine, the plan tracker and per-domain scoring live here.
- **The course** — 55 hand-edited pages under [`course/`](../../course/), long-form reading with a persistent side nav and previous/next links.

## Architecture Patterns

- **Language**: HTML / CSS / vanilla JS (ES5-compatible, no modules, no transpile). Python 3 for the build only.
- **Architecture Style**: Static site with a build-time data-inlining step. No framework, no bundler, no package manager, no lockfile.
- **Data Flow**: Build time only. `tools/build_hub.py` reads `questions.json` and the `PLAN` literal in the script, JSON-serialises both, and substitutes them into the `__QUESTIONS__` and `__PLAN__` placeholders in `tools/hub-template.html` to emit `index.html`. At runtime the question bank is already inline; the page fetches nothing.

## Core Components

### Application Structure

```text
index.html                  GENERATED — never hand-edit. 215 KB, question bank inlined
questions.json              75 scenario questions: {meta, questions[]}
tools/
  build_hub.py              The build. Reads questions.json + PLAN literal -> index.html
  hub-template.html         Hub layout + JS. Placeholders: __QUESTIONS__, __PLAN__
course/
  index.html                Lists all five official modules in official order
  module-01/                12 sections, distilled from Anthropic's official module
  module-02/ .. module-05/  35 sections, built from this repo's own domain notes
  reference/                Revision sheets (pattern-selection is a print target)
  learning-records/         Decision records for course content
  assets/
    lesson.css nav.css print.css   Shared styling; print.css backs the print targets
    nav.js quiz.js                 Side nav; in-page checkpoint quizzes
    fonts/                         Self-hosted, incl. OpenDyslexic
notes/                      Domain notes, markdown, for reading outside the browser
labs.md study-plan.md       Eight labs; the 21-day plan
assets/                     Badge and favicons
```

### The question bank

`questions.json` is `{meta, questions[]}` with 75 items. Each carries `id`, `domain`,
`type` (`single` | `multi`), `selectCount`, `scenario`, `question`, `options`,
`correct`, `explanation`, `distractorNotes`, `reference`, `difficulty`.

The domain split is deliberately weighted to the published exam weighting, not spread evenly:

| Count | Domain | Official weight |
|---|---|---|
| 14 | Integration | 19% |
| 13 | Solution Design & Architecture | 17% |
| 12 | Evaluation, Testing & Optimization | 16% |
| 11 | Governance, Safety & Risk Management | 14% |
| 10 | Stakeholder Communication & Lifecycle Management | 14% |
| 10 | Claude Models, Prompting & Context Engineering | 13% |
| 5 | Developer Productivity & Operational Enablement | 7% |

Types: 56 single-answer, 19 multi-answer.

## Scale

- Tier: prototype
- Active users: < 100
- Team size: solo

## Deployment targets

- GitHub Pages, from the repository's default branch. No CI: a push to `main` is the deploy.
- Public URL: `girishr.github.io/ClaudeCertifiedArchitect-Professional-Prep/`

## Data layer

- **No database, no backend, no accounts.**
- **Offline support**: No (though nothing but the outbound reference links needs the network).
- **Session state** — quiz answers, scores, study-plan ticks — is held in memory for the session only and is deliberately not persisted across visits.
- **`localStorage`** holds exactly two display preferences: the light/dark theme and the OpenDyslexic toggle.

## Integrations

None. No analytics, no tracking, no email, no third-party scripts, no CDN. Fonts and assets are self-hosted. The only external references are outbound documentation links (Anthropic Partner Academy, platform/code docs, the exam guide PDF, modelcontextprotocol.io, w3.org).

## Design Decisions

### Decision 1: `index.html` is generated, not authored

- **Date**: pre-dates this spec (recorded 2026-09-13)
- **Context**: The hub needs the full 75-question bank available with no fetch, so the site works as a single file with zero runtime dependencies.
- **Decision**: `tools/build_hub.py` inlines `questions.json` and the `PLAN` literal into `tools/hub-template.html`.
- **Consequences**: The hub is self-contained and instant. **Editing `index.html` directly is always a mistake** — the next build silently discards it. Hub changes go to `tools/hub-template.html` (layout/JS), `questions.json` (bank) or the `PLAN` literal (study plan).

### Decision 2: No framework, no dependencies

- **Context**: A study site with a five-year-plus useful life and one maintainer.
- **Decision**: Plain HTML/CSS/JS. Nothing to install, nothing to upgrade, no supply chain.
- **Consequences**: Nothing rots or needs patching; the cost is that shared behaviour is duplicated across 55 hand-edited course pages rather than componentised.

### Decision 3: Modules 2–5 have a different provenance from Module 1

- **Context**: Module 1 was distilled from Anthropic's official module. Modules 2–5 sit behind Partner Academy enrolment.
- **Decision**: Build 2–5 from this repo's own domain notes, in official module order, and say so on every affected page.
- **Consequences**: Full coverage, honestly labelled. Every one of those pages must keep its provenance notice.

### Decision 4: Session-only state

- **Context**: No accounts, and nothing should be collected about a visitor.
- **Decision**: Progress and quiz state live for the session; `localStorage` carries only theme and font preference.
- **Consequences**: Refresh loses progress — accepted, in exchange for zero data collection and no privacy surface.

## Deployment Architecture

Push to `main`; GitHub Pages serves the repository root. Rebuild the hub first when the bank, the plan or the template changed:

```bash
python3 tools/build_hub.py    # regenerates index.html
```

No build step, no pipeline and no artefact store beyond that.

## Security Considerations

The attack surface is close to nil: static files, no server, no user input crossing a trust boundary, no secrets in the repo, no dependencies to compromise. See [`../security/threat-model.md`](../security/threat-model.md).

## Performance Considerations

`index.html` is ~215 KB because the bank is inlined — a deliberate trade of first-byte size for zero fetches and offline-capable practice. Course pages are small and share three cached stylesheets. Self-hosted fonts avoid a third-party round trip.

## Monitoring and Observability

None, by design. No analytics, no error reporting, no logs — there is no server to log and nothing is collected about visitors.

## Assumptions

> Label each assumption with [ASSUMPTION] so it can be reviewed and revised.

- [ASSUMPTION] GitHub Pages remains the host; no custom domain or CDN is planned.
- [ASSUMPTION] Visitors use a current browser; no polyfills or legacy-browser support are carried.
- [ASSUMPTION] The official exam guide's domain weightings (obtained 20 Aug 2026) hold until Anthropic publishes a revision; a change there invalidates both the bank's weighting and the scoring.

---
*Last updated: 2026-09-13*