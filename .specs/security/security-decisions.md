---
fileID: SEC-002
description: Security ADR log with decisions, rationale, and trade-offs
lastUpdated: 2026-09-13
version: 1.0
contributors: [girishr]
relatedFiles: [security/threat-model.md, architecture/architecture.md]
---

# Security Decisions

## Decisions [SEC-002.1]

**Summary:** Auth strategy: none (public site, no accounts). Compliance: none required. CI/CD: none.

---

### SEC-DEC-001 — No accounts, no authentication

- **Decision:** The site is public with no login, no roles and no sessions.
- **Rationale:** Nothing needs protecting. The material is free and public by intent, and the alternative would mean holding candidate data for no gain.
- **Trade-off:** Progress cannot follow a visitor across devices. Accepted.

### SEC-DEC-002 — Collect nothing

- **Decision:** No analytics, no tracking, no error reporting, no email. Quiz and plan state is in-memory and session-only; `localStorage` carries only the theme and the OpenDyslexic toggle.
- **Rationale:** The strongest privacy position is having no data. It also removes the third-party script surface entirely.
- **Trade-off:** No usage signal — no way to know which domains candidates struggle with, or whether anyone finishes a mock. Accepted deliberately; revisit only by changing the non-goal, not quietly.

### SEC-DEC-003 — Zero runtime dependencies

- **Decision:** No package manager, no CDN, no third-party scripts. Fonts and assets self-hosted.
- **Rationale:** Removes supply-chain risk outright and means nothing rots or needs patching over the site's life.
- **Trade-off:** Shared behaviour is duplicated across 55 hand-edited course pages.

### SEC-DEC-004 — Compliance: none applicable

- **Decision:** No GDPR, CCPA, HIPAA, PCI, SOC 2 or COPPA obligations are engaged.
- **Rationale:** This follows directly from SEC-DEC-002 — no personal data is collected, stored or processed, and there are no payments, health data or business customers.
- **Trade-off:** None. **This conclusion depends entirely on collecting nothing:** introducing analytics, accounts or any visitor data collection re-opens the question, and for EU visitors GDPR would then apply.

### SEC-DEC-005 — No CI/CD

- **Decision:** GitHub Pages serves from the default branch; a push to `main` is the deploy. No pipeline, no automated tests.
- **Rationale:** Proportionate to a solo static site. See `quality/tests.md` for the manual checklist that stands in.
- **Trade-off:** No automated guard against a broken build or a hand-edited `index.html` reaching the live site. If one CI job is ever added, make it the rebuild-and-diff check on `index.html`.

### SEC-DEC-006 — Repository access is the security boundary

- **Decision:** Treat GitHub account and repository access as the one credential-bearing path to the live site; keep strong authentication on the owning account.
- **Rationale:** With no server and no secrets in the codebase, repo write access *is* deploy access (SEC-002.5).
- **Trade-off:** None — but it means no secret, token or key should ever be committed, since the repo is public.

### SEC-DEC-007 — Factual integrity as a security property

- **Decision:** Exam facts come solely from Anthropic's official CCAR-P Exam Guide (obtained 20 Aug 2026). No testimonials, pass rates, user counts or endorsements may be invented, and the official path is stated to be authoritative.
- **Rationale:** Candidates make paid, time-boxed decisions on this material. Misinformation is the most realistic harm this project can cause — larger than any technical risk in the threat model.
- **Trade-off:** Coverage is bounded by what the official guide confirms.

## Availability

No availability or response-time commitment. Prototype tier, static hosting, GitHub Pages' uptime. Not monitored, by design.
