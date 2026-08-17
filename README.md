# Claude Certified Architect - Professional: Prep Kit

Study material for the Anthropic **Claude Certified Architect - Professional** (CCAR-P) exam: a three-week plan, notes for all seven domains, a 75-question scenario bank, eight hands-on labs, and a single-file web hub that ties them together.

## Start here

| File | What it is |
|---|---|
| [`study-plan.md`](study-plan.md) | Three-week day-by-day plan, weighted to the domain split. Read the eligibility section first |
| [`index.html`](index.html) | The prep hub: plan tracker, practice engine, per-domain scoring. Open it in a browser |
| [`notes/`](notes/) | Domain notes with decision heuristics, distractor traps and one-line recalls |
| [`labs.md`](labs.md) | Eight time-boxed builds, 60 to 150 minutes each |
| [`questions.json`](questions.json) | The question bank, with explanations and per-distractor notes |

## Before you plan anything: eligibility

Anthropic's certification FAQ states that certification is available to people at **Claude Partner Network organisations**, and that registration requires a work email on a recognised company domain. Personal addresses are rejected. Confirm your organisation is in the Partner Network before you commit three weeks to a study plan.

## Exam facts

Confirmed on Anthropic's own certification pages:

| Item | Detail |
|---|---|
| Code | CCAR-P |
| Time | 120 minutes |
| Scoring | Scaled score 100 to 1000, pass mark 720 |
| Cost | 175 USD |
| Delivery | Pearson VUE, online proctored or test centre. Closed book |
| Validity | 12 months, free on-time renewal via a non-proctored assessment |
| Retakes | 14 days, then 30, then 90. Four attempts per rolling 12 months |
| Prerequisites | None. You can sit Professional without holding Foundations |

**Not confirmed by Anthropic:** the 63-question count and the seven domain weightings below. Those come only from third-party prep sites citing "Exam Guide v1.0, July 2026", and those sites copy each other. Download the real exam guide from the Academy and re-derive your hour allocations from it.

## Domain weightings (third-party sourced)

| # | Domain | Weight |
|---|---|---|
| 3 | Integration | 19% |
| 1 | Solution Design & Architecture | 17% |
| 4 | Evaluation, Testing & Optimization | 16% |
| 5 | Governance, Safety & Risk Management | 14% |
| 6 | Stakeholder Communication & Lifecycle Management | 14% |
| 2 | Claude Models, Prompting & Context Engineering | 13% |
| 7 | Developer Productivity & Operational Enablement | 7% |

## The hub

`index.html` is self-contained, no build step and no network calls at runtime. Four tabs:

- **Study plan** - the 21 days with checkboxes and a progress meter
- **Practice** - domain drill with instant feedback, a timed 20-question set, or a full 63-question 120-minute mock
- **Results** - per-domain accuracy against the pass line, plus a weighted score estimate
- **Exam brief** - the facts above and the exam technique list

Progress is held in memory for the session only. Nothing is stored and nothing leaves the page.

To rebuild it after editing `questions.json` or `tools/hub-template.html`:

```bash
python3 tools/build_hub.py
```

## Accuracy

The notes were fact-checked against primary sources before publishing: `platform.claude.com`, `code.claude.com`, `modelcontextprotocol.io`, Anthropic's engineering posts, and official regulator sites for the compliance material. That pass corrected six errors, including the `output_config.effort` levels and default, the Claude version at which adaptive thinking starts, JSON Schema keyword support in structured outputs, the Opus 4.7 prompt-cache minimum, and the MCP `2026-07-28` deprecation list.

Claims the notes could not verify against a primary source are flagged inline rather than asserted. Anything sourced from a third-party prep site is labelled as such.

Model behaviour, MCP spec revisions and regulatory dates all move. Re-check anything version-specific against the current docs before you rely on it.

## Licence

Personal study material. The question bank is original work written against public documentation; it is not derived from any exam.
