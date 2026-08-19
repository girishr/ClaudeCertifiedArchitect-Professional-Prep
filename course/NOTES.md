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

The official Lesson 1, "Claude Platform & Solution Design", is 238 minutes and spans exam
Domains 1 and 2. Too much for one sitting, so this track breaks it into short lessons,
each one tangible win.

**Restructured 19 Aug 2026.** The first plan was invented from the domain list. Then the
gated course page gave up its **learning objectives**, which are the real syllabus, and
two of them were missing from my plan entirely: platform entry points, and delivery
routes. The sequence now follows Anthropic's published objectives rather than my guess.
See learning record 0002.

| # | Lesson | Official objective it covers | Status |
|---|---|---|---|
| 0001 | Workflow or agent | Selecting between augmented calls, workflows, and agents | Written |
| 0002 | Splitting the work | Breaking requests into Claude, system, and human responsibilities | Written |
| 0003 | The six patterns, and their traps | Picking appropriate reference architectures | Written |
| 0004 | When multi-agent pays | Reference architectures, the expensive end | Written |
| 0005 | Platform entry points | Identifying platform entry points | Written |
| 0006 | Delivery routes and governance | User-facing vs build-time vs enterprise delivery routes | Written |
| 0007 | Model and context strategy | Making model and context decisions | Written |

Course 1 is complete. Courses 2 to 5 of the official path are still unwritten:
Enterprise Integration & Production (158 min), Responsible AI, Safety & Risk (114 min),
Stakeholder Engagement, Lifecycle & GTM (178 min), Team Enablement & Operational
Productivity (45 min).

`index.html` at the workspace root is the front door and every lesson links back to it.

## Open questions to revisit

- Mission assumes an early-September sitting. Confirm once the Partner Network
  eligibility question is settled, since that gates registration entirely.
- Weak-area self-rating in MISSION.md is self-reported and untested. Replace it with
  measured per-domain accuracy from the practice bank once there are 40+ attempts.
