# Resources

Trust ratings are my own judgement of how much weight to put on a source when it
conflicts with another.

- **Primary** - Anthropic's own documentation or an official exam artifact. Wins every
  conflict.
- **Strong** - written by the people who built the thing, but a blog post rather than
  spec or docs. Can go stale.
- **Secondary** - third party, useful, verify before memorising.

---

## Primary: official exam and course material

| Resource | Trust | Why it matters | Status |
|---|---|---|---|
| [CCAR-P Prep Course](https://anthropic-partners.skilljar.com/path/claude-certified-architect-professional) | Primary | Free, 733 min, five lessons. Lesson 1 "Claude Platform & Solution Design" (238 min) is what this teaching track shadows | Path page read; course content behind enrolment |
| [Certification FAQ](https://anthropic-partners.skilljar.com/page/faq-certifications) | Primary | Confirms 120 min, 100-1000 scale, 720 pass, retake ladder, Partner Network eligibility | Read |
| [CCAR-P certification page](https://anthropic-partners.skilljar.com/claude-certified-architect-professional-certification) | Primary | 175 USD, purchase and access | Read |
| [Official Exam Guide PDF](https://everpath-course-content.s3-accelerate.amazonaws.com/instructor%2F6nizmqk8tpzpfjvt6qmmav7rh%2Fpublic%2F1783542810%2FClaude+Certified+Architect+%E2%80%93+Professional+Exam+Guide.pdf) | Primary | The real domain blueprint. Linked from the certifications page, no login needed | **Obtained 20 Aug 2026.** Confirms 63 items, 120 min, 100-1000 scale, 720 pass, and all seven domain weightings exactly as this repo had them |
| [Pearson VUE - Anthropic](https://www.pearsonvue.com/us/en/anthropic.html) | Primary | Scheduling and proctoring | Read |

## Primary: platform documentation

| Resource | Trust | Use it for |
|---|---|---|
| [Claude platform docs](https://platform.claude.com/docs/) | Primary | The reference for Domains 2, 3 and 4 |
| [Model overview](https://platform.claude.com/docs/en/docs/about-claude/models/overview) | Primary | Model selection tradeoffs |
| [Prompt caching](https://platform.claude.com/docs/en/docs/build-with-claude/prompt-caching) | Primary | Breakpoints, TTLs, invalidation |
| [Extended and adaptive thinking](https://platform.claude.com/docs/en/docs/build-with-claude/extended-thinking) | Primary | Adaptive thinking from 4.6; `budget_tokens` 400s on 4.7+ |
| [Effort](https://platform.claude.com/docs/en/build-with-claude/effort) | Primary | Five levels, default `high` |
| [Claude Code docs](https://code.claude.com/docs/) | Primary | Domain 7 |
| [MCP specification](https://modelcontextprotocol.io/specification/latest) | Primary | Domain 3. Read the revision, not a summary |

## Strong: Anthropic engineering posts

These supply the vocabulary the exam is written in. Read these before any third-party
guide.

| Resource | Trust | Use it for |
|---|---|---|
| [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) | Strong | **The** source for Domain 1. Three tiers, six patterns, and the "start simple" position |
| [How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system) | Strong | Multi-agent economics: 4x and 15x token multipliers, 90.2% result, 3-5 subagents |
| [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) | Strong | Compaction, note-taking, just-in-time retrieval, context rot |
| [Writing tools for agents](https://www.anthropic.com/engineering/writing-tools-for-agents) | Strong | Tool description and schema design |
| [Contextual retrieval](https://www.anthropic.com/news/contextual-retrieval) | Strong | The RAG quality ladder with measured numbers |
| [Code execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp) | Strong | Context cost argument for progressive discovery |

## Primary: governance and regulation

| Resource | Trust | Use it for |
|---|---|---|
| [Anthropic Usage Policy](https://www.anthropic.com/legal/aup) | Primary | High-risk use case requirements, consumer-facing scope |
| [API and data retention](https://platform.claude.com/docs/en/manage-claude/api-and-data-retention) | Primary | ZDR scope and its many exclusions |
| [Data residency](https://platform.claude.com/docs/en/manage-claude/data-residency) | Primary | `inference_geo`, workspace geo |
| [EU AI Act framework](https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai) | Primary | Application dates including the Omnibus deferral |
| [GDPR Article 22](https://gdpr-info.eu/art-22-gdpr/) | Primary | Automated decision-making safeguards |

## Secondary: third-party prep

Useful for shape and extra reps, unreliable for detail. Three of the four target
**Foundations**, not Professional, so their five-domain split is the wrong blueprint and
they carry nothing on governance, stakeholder communication or lifecycle management,
which together are 28% of the Professional paper. CertSafari is the exception.

| Resource | Trust | Note |
|---|---|---|
| [CertSafari - Anthropic](https://certsafari.com/anthropic) | Secondary | The only third-party bank covering **CCAR-P directly**. Exam-style questions with explanations, free, no signup, refreshed every three weeks. Best of the third-party options |
| [Claude Certification Guide - mock exam](https://claudecertificationguide.com/mock-exam) | Secondary | Free timed mock, 28 in 56 min or 60 in 120, scored to 1,000 with a 720 pass mark. **Foundations, not Professional**: five-domain blueprint, 60 items not 63. Use for timing practice, not domain calibration. Question sourcing undisclosed |
| [paullarionov/claude-certified-architect](https://github.com/paullarionov/claude-certified-architect) | Secondary | Foundations guides in eleven languages, HTML practical tests |
| [dnacenta/claude-certified-architect](https://github.com/dnacenta/claude-certified-architect) | Secondary | Foundations guide, anti-patterns, four-week plan |
| Third-party exam guide sites | Secondary | Were the sole source for the question count and weightings until the official guide turned up. Both matched. No longer needed |

## Communities

Wisdom comes from arguing these calls with people who have shipped them.

| Community | Why |
|---|---|
| [Anthropic Discord](https://www.anthropic.com/discord) | Closest thing to talking to practitioners and Anthropic staff |
| [r/ClaudeAI](https://www.reddit.com/r/ClaudeAI/) | Mixed signal, but certification threads surface real exam experience |
| [MCP GitHub discussions](https://github.com/modelcontextprotocol/modelcontextprotocol/discussions) | Where spec ambiguity gets resolved by the people writing it |
| Claude Partner Network channels | Once eligibility is sorted, the highest-signal room available |

## Gaps to close

1. ~~The official Exam Guide PDF.~~ **Closed 20 Aug 2026.** It was linked from the
   certifications page all along, no login required. Lesson: check the policies and
   certifications pages before assuming a document is gated.
2. ~~The prep course itself.~~ **Enrolled.** 733 minutes across five courses, and it is
   now the spine of the study plan rather than a footnote.
3. **A practitioner to argue with.** No community contact made yet. This is the only
   real gap left, and it is the one that produces wisdom rather than knowledge.
