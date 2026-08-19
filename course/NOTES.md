# Working notes

## Teaching preferences

- **No em dashes anywhere.** Hyphens only. This applies to lessons, reference docs and
  chat.
- Natural, human prose. No AI-sounding filler: no "in today's landscape", no "delve",
  no "it's important to note", no "leverage" where "use" works.
- Reasonably concise. Get to the point.
- Skip beginner scaffolding. He ships production systems and uses Claude Code daily.

## Session design

- Short lessons. Real job, ~50 reports, limited evenings.
- Bias toward **decision practice** over terminology recall. The exam's distractors are
  real techniques applied at the wrong time, so the skill being trained is
  constraint-spotting, not definition-matching.
- Every quiz item should be scenario-first with a binding constraint buried in it.

## Course structure decision

The official Lesson 1, "Claude Platform & Solution Design", is 238 minutes and spans
exam Domains 1 and 2. That is far too much for one sitting. This track breaks it into
tightly-scoped lessons, each one tangible win:

| # | Lesson | Covers | Status |
|---|---|---|---|
| 0001 | Workflow or agent | The three tiers, the predictability test | Written |
| 0002 | The six patterns, and their traps | Pattern selection, sectioning vs orchestrator-workers | Planned |
| 0003 | Multi-agent economics | 4x/15x, when breadth beats cost | Planned |
| 0004 | Where the human goes | Checkpoints, reversibility, blast radius | Planned |
| 0005 | Model routing under a latency SLA | Tier selection, adaptive thinking, effort | Planned |
| 0006 | Context engineering | Compaction, retrieval over stuffing, caching | Planned |
| 0007 | Architecture to business value | SLAs, cost per task, the CFO conversation | Planned |

## Open questions to revisit

- Mission assumes an early-September sitting. Confirm once the Partner Network
  eligibility question is settled, since that gates registration entirely.
- Weak-area self-rating in MISSION.md is self-reported and untested. Replace it with
  measured per-domain accuracy from the practice bank once there are 40+ attempts.
