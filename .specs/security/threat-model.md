---
fileID: SEC-001
description: Threat model and attack surface analysis
lastUpdated: 2026-09-13
version: 1.0
contributors: [girishr]
relatedFiles: [security/security-decisions.md, architecture/architecture.md, project/requirements.md]
---

# Threat Model

## Overview [SEC-001.1]

The attack surface here is close to nil, and that is a design outcome rather than luck. The site is static files on GitHub Pages: no server, no database, no accounts, no user input crossing a trust boundary, no secrets, and no third-party code at runtime. Most of the usual web threat model simply has nothing to attach to.

What remains worth stating is what protects that property, since the risks would arrive with a change of architecture rather than with an attacker.

## Threat Model [SEC-002]

### Security concerns

No active mitigations are required beyond the structural ones below.

| # | Concern | Assessment |
|---|---|---|
| SEC-002.1 | Dependency / supply-chain compromise | **Not applicable.** No package manager, no lockfile, no CDN, no third-party scripts. Fonts and assets are self-hosted. There is nothing to compromise. |
| SEC-002.2 | Personal data exposure | **Not applicable.** Nothing is collected. Quiz state is in-memory and session-only; `localStorage` holds only the theme and font toggle. No analytics, no tracking, no email. |
| SEC-002.3 | Injection / XSS | **Low.** Visitor input never leaves the page or reaches a server. Residual risk is confined to the build: `build_hub.py` inlines `questions.json` into HTML, so the bank is trusted input authored in-repo. |
| SEC-002.4 | Auth / access control flaws | **Not applicable.** Public site, no login, no roles, no sessions. |
| SEC-002.5 | Repository takeover | **The real risk.** Push access to the repo is push access to the live site — a push to `main` is the deploy. Protected by GitHub account security (strong auth on the owning account), not by anything in this codebase. |
| SEC-002.6 | Content integrity / misinformation | **Reputational, not technical.** The site makes factual claims about a paid certification exam. Wrong exam facts, invented pass rates or fabricated endorsements would harm candidates who rely on them. Guarded by REQ-007 and REQ-010: facts come only from the official exam guide (obtained 20 Aug 2026). |
| SEC-002.7 | Outbound link integrity | **Low.** Links to Anthropic domains, modelcontextprotocol.io and w3.org are navigation targets, not code. They should stay HTTPS and be checked when Anthropic reorganises its docs. |

### Integration-derived threat entries

None. There are no integrations.

## Attack Surface Summary [SEC-003]

- **Network surface:** none served by this project. GitHub Pages terminates TLS and serves static files.
- **Runtime surface:** the visitor's own browser. All JS is first-party and does no network I/O.
- **Build surface:** `python3 tools/build_hub.py`, run locally by the maintainer over in-repo inputs.
- **Write surface:** the GitHub repository itself — the one credential-bearing path to the live site (SEC-002.5).

## Out of Scope [SEC-004]

- Anything Anthropic operates: the Partner Academy, the exam guide PDF, Pearson VUE, and the certification process itself. This site only links to them.
- The visitor's browser, OS and extensions.
- GitHub's own platform security.
- Availability and DDoS: GitHub Pages' concern, and a prototype-tier static site has no availability commitment (see `security-decisions.md`).

## Revisit this document if

Any of these would invalidate the assessment above and warrant a real threat model:

1. A backend, API or database is added.
2. Accounts, login or any persistence of user data appears.
3. Analytics, error reporting or any third-party script is introduced.
4. A package manager, CDN or build dependency enters the project.
5. Visitor-supplied content is stored or displayed to anyone else.

Each of these is currently an explicit non-goal (see `project/requirements.md`).