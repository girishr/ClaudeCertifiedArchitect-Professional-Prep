# Claude Certified Architect - Professional: Prep Kit

Study material for the Anthropic **Claude Certified Architect - Professional** (CCAR-P) exam.

The spine is Anthropic's own free [prep course](https://anthropic-partners.skilljar.com/path/claude-certified-architect-professional), 733 minutes across five courses. Everything here is built to sit around it: a day-by-day plan, a seven-lesson drill track, notes for all seven domains, a 75-question scenario bank, eight hands-on labs, and a single-file web hub. None of it replaces the official course.

## Contents

| File | What it is |
|---|---|
| [`study-plan.md`](study-plan.md) | **Start here.** Day-by-day plan built around Anthropic's official prep course, with this repo's material slotted in around it |
| [`index.html`](index.html) | The prep hub: plan tracker, practice engine, per-domain scoring. Open it in a browser |
| [`notes/01-solution-design-models-devprod.md`](notes/01-solution-design-models-devprod.md) | Domains 1, 2 and 7: solution design and architecture, Claude models and prompting and context engineering, developer productivity |
| [`notes/02-integration-evals.md`](notes/02-integration-evals.md) | Domains 3 and 4: integration and MCP, evaluation and testing and optimisation. The two heaviest domains |
| [`notes/03-governance-stakeholder.md`](notes/03-governance-stakeholder.md) | Domains 5 and 6: governance and safety and risk, stakeholder communication and lifecycle |
| [`labs.md`](labs.md) | Eight time-boxed builds, 60 to 150 minutes each |
| [`questions.json`](questions.json) | The question bank, with explanations and per-distractor notes |
| [`course/`](course/) | A seven-lesson teaching track shadowing official Course 1, with 35 scenario drills. Open [`course/index.html`](course/index.html) |
| [`tools/`](tools/) | `build_hub.py` and the HTML template that generate `index.html` |

Each notes file follows the same shape per domain: a framing paragraph on what the exam is really testing, comparative tables, decision heuristics, a common-distractors list, and a set of one-line recalls for the final week.

## Before you plan anything: eligibility

Anthropic's certification FAQ states that certification is available to people at **Claude Partner Network organisations**, and that registration requires a work email on a recognised company domain. Personal addresses are rejected. Confirm your organisation is in the Partner Network before you commit three weeks to a study plan.

## Exam facts

| Item | Detail |
|---|---|
| Code | CCAR-P |
| Time | 120 minutes |
| Scoring | Scaled score 100 to 1000, pass mark 720 |
| Cost | 175 USD |
| Delivery | Pearson VUE, online proctored or test centre. Closed book |
| Validity | 12 months, free on-time renewal via a non-proctored assessment |
| Retakes | 14 days, then 30, then 90. Four attempts per rolling 12 months |
| Items | 63 |
| Types | Multiple choice and multiple response. Each item states how many to select |
| Prerequisites | None. "There are no mandatory prerequisites or courses required to sit this exam" |

All of the above is from Anthropic's own [CCAR-P Exam Guide](https://everpath-course-content.s3-accelerate.amazonaws.com/instructor%2F6nizmqk8tpzpfjvt6qmmav7rh%2Fpublic%2F1783542810%2FClaude+Certified+Architect+%E2%80%93+Professional+Exam+Guide.pdf) (PDF), obtained 20 Aug 2026. Earlier versions of this repo flagged the question count and weightings as third-party guesswork. The official guide confirms both exactly.

## Domain weightings (official)

From the official exam guide.

| # | Domain | Weight |
|---|---|---|
| 3 | Integration | 19% |
| 1 | Solution Design & Architecture | 17% |
| 4 | Evaluation, Testing & Optimization | 16% |
| 5 | Governance, Safety & Risk Management | 14% |
| 6 | Stakeholder Communication & Lifecycle Management | 14% |
| 2 | Claude Models, Prompting & Context Engineering | 13% |
| 7 | Developer Productivity & Operational Enablement | 7% |

## Key links

### Registration and official exam material

- [Anthropic Partner Academy - CCAR-P certification](https://anthropic-partners.skilljar.com/claude-certified-architect-professional-certification) - purchase and exam access
- [Certification FAQ](https://anthropic-partners.skilljar.com/page/faq-certifications) - eligibility, scoring, retake policy, renewal
- [Pearson VUE - Anthropic](https://www.pearsonvue.com/us/en/anthropic.html) - scheduling, online proctoring and test centres
- [Anthropic Academy](https://anthropic.skilljar.com/) - the free course catalogue that overlaps the exam blueprints

### Documentation to work from

- [Claude platform docs](https://platform.claude.com/docs/) - the primary reference for everything in Domains 2, 3 and 4
- [Model overview](https://platform.claude.com/docs/en/docs/about-claude/models/overview) and [pricing](https://platform.claude.com/docs/en/docs/about-claude/pricing) - model selection questions turn on these tradeoffs
- [Prompt caching](https://platform.claude.com/docs/en/docs/build-with-claude/prompt-caching) - breakpoints, TTLs, invalidation. Frequently examined
- [Extended and adaptive thinking](https://platform.claude.com/docs/en/docs/build-with-claude/extended-thinking) and [effort](https://platform.claude.com/docs/en/build-with-claude/effort)
- [Structured outputs](https://platform.claude.com/docs/en/docs/build-with-claude/structured-outputs)
- [Batch processing](https://platform.claude.com/docs/en/docs/build-with-claude/batch-processing) - the standard cost lever for async work
- [Tool search tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool) - the answer to capability bloat
- [Agent Skills](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview) - progressive disclosure
- [MCP connector](https://platform.claude.com/docs/en/agents-and-tools/mcp-connector)
- [Claude Code docs](https://code.claude.com/docs/) - Domain 7. See [settings](https://code.claude.com/docs/en/settings), [memory](https://code.claude.com/docs/en/memory), [hooks](https://code.claude.com/docs/en/hooks), [MCP](https://code.claude.com/docs/en/mcp), [headless](https://code.claude.com/docs/en/headless), [monitoring](https://code.claude.com/docs/en/monitoring-usage)

### Model Context Protocol

- [MCP specification](https://modelcontextprotocol.io/specification/latest) - read the current revision, not a blog summary
- [Authorization chapter](https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization) - OAuth 2.1, resource indicators, audience validation
- [Spec release notes, 2026-07-28](https://blog.modelcontextprotocol.io/posts/2026-07-28/) - statelessness, `server/discover`, and the Sampling / Roots / Logging deprecations. Most study material still describes the old model

### Anthropic engineering posts

These are the source of the architectural vocabulary the exam uses.

- [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) - the pattern catalogue for Domain 1
- [How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system) - orchestrator-workers in practice, and the token cost multipliers
- [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) - compaction, note-taking, just-in-time retrieval
- [Writing tools for agents](https://www.anthropic.com/engineering/writing-tools-for-agents) - tool description and schema design for Domain 3
- [Contextual retrieval](https://www.anthropic.com/news/contextual-retrieval) - the RAG quality ladder and its measured failure-rate reductions
- [Code execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp) - the context-cost argument for progressive discovery

### Governance, safety and compliance

- [Anthropic Usage Policy](https://www.anthropic.com/legal/aup) - including the high-risk use case requirements and their consumer-facing scope
- [API and data retention](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention) - zero data retention scope and its exclusions
- [Data residency](https://platform.claude.com/docs/en/manage-claude/data-residency) - `inference_geo` and workspace geo
- [Anthropic certifications](https://privacy.claude.com/en/articles/10015870-what-certifications-has-anthropic-obtained) - SOC 2, ISO 27001, ISO 42001, HIPAA readiness
- [Trust Center](https://trust.anthropic.com/)
- [EU AI Act regulatory framework](https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai) - note the Digital Omnibus deferral of the high-risk dates
- [GDPR Article 22](https://gdpr-info.eu/art-22-gdpr/) - automated decision-making safeguards

## Third-party practice and community material

All of the below is **unofficial**. Useful for extra reps, never as a substitute for the official exam guide or the prep course.

### Practice question banks

- [CertSafari - Anthropic](https://certsafari.com/anthropic) - the only third-party bank here that covers **CCAR-P directly**. Exam-style questions with explanations, free, no signup. Says it refreshes every three weeks and checks itself against the current exam guides. Worth using for extra reps once you have exhausted this repo's 75
- [Claude Certification Guide - mock exam](https://claudecertificationguide.com/mock-exam) - free timed mock, either 28 questions in 56 minutes or a full 60 in 120, scored out of 1,000 with a 720 pass mark. **It targets Foundations (CCAR-F), not Professional**, so it runs the five-domain Foundations blueprint and its 60-item format rather than your 63. Good for timing practice and for the shared architecture ground, wrong for domain-level calibration. The site does not say where its questions come from

### Community study repos

Both repos below are **unofficial and target Foundations (CCAR-F), not Professional**, so their domain split is the five-domain Foundations blueprint rather than the seven domains above. Useful for the shared ground on agentic architecture, tool design and MCP, less so for the Professional-only material on governance, stakeholder communication and lifecycle management.

- [paullarionov/claude-certified-architect](https://github.com/paullarionov/claude-certified-architect) - Foundations study guides in eleven languages, markdown and PDF, plus HTML practical tests covering tool design, MCP integration, structured output, context management and reliability
- [dnacenta/claude-certified-architect](https://github.com/dnacenta/claude-certified-architect) - Foundations study guide with per-domain guides, code examples and anti-patterns, exam scenarios, decision frameworks, practice questions and a four-week plan. Published as both a site and a PDF

One thing to watch across all four: three of them are built for Foundations, whose five-domain blueprint has no equivalent of the Professional-only weight in governance, stakeholder communication and lifecycle management. That is 28% of your exam that Foundations material simply does not cover. Treat anything third party, this repo included, as secondary to the official exam guide, and cross-check before you memorise.

## Using this yourself

The plan is written for one person's starting point: strong on architecture and Claude Code from daily work, weaker on integration depth, evaluation practice, governance and the consulting side. Re-rate the confidence column in `study-plan.md` before you follow the hour allocations. The structure holds for anyone, the weighting does not.

The dates in the plan and the countdown in the hub are anchored to a specific sitting. Shift them to yours.

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

[CC BY 4.0](LICENSE). Share and adapt it, with credit.

Unofficial study material, not produced or endorsed by Anthropic. The question bank is original work written against public documentation; it is not derived from, and does not reproduce, any actual exam content.
