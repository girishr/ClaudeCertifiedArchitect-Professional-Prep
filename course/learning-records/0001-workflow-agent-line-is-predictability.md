# 0001 - The workflow/agent line is predictability, not difficulty

- **Date:** 2026-08-19
- **Lesson:** [0001 - Workflow or agent](../lessons/0001-workflow-or-agent.html)
- **Domain:** 1, Solution Design & Architecture (17%)
- **Status:** taught, not yet tested under time pressure

## The insight

The dividing line between a workflow and an agent is **predictability of the path**, not
difficulty of the task. A hard task with a fixed sequence is still a workflow.

This is non-obvious because scale and difficulty in a scenario both create a feeling that
autonomy is required. A 40,000-claim backlog reads as agentic. If 85% of those claims
follow one of three known paths, it is a router plus three chains.

## Why it needed teaching

The starting point here is unusual: someone who builds agentic systems daily. That is a
liability on this domain rather than an advantage. When agents are cheap for you to
imagine, they feel proportionate, and the exam is scored from the position of someone
asking whether a client should pay for variable latency and a harder audit story.

Predicted failure mode on the real exam: over-selecting the agent answer on scenarios
that describe hard-but-predictable work.

## What was actually established

1. The three tiers, and that the augmented LLM call is the baseline every other
   architecture has to beat before it is allowed to exist.
2. The three-question escalation test, stopping at the first "no".
3. The **irreversibility veto**: unpredictability argues for an agent, irreversibility
   argues louder against one. This is the piece most likely to be missing from
   build-first intuition, because in practice you rarely feel the veto until something
   goes wrong in production.
4. Sectioning vs orchestrator-workers: you decide the split in code, or the model decides
   it at runtime. Named as the favourite trap in this domain.
5. Checkpoints go at irreversible or high blast-radius actions, not at every step.

## Open question flagged during the lesson

Drill 4 included "the stakeholder asked specifically for an agentic AI solution" as a
distractor. The right move is to re-run discovery rather than build what was named. That
is a Domain 6 reflex appearing inside a Domain 1 question, and it is worth watching
whether that cross-domain framing helps or muddies things. Revisit after the Domain 6
lessons.

## To revise later

- The self-rated weak areas in `MISSION.md` are self-reported. Replace with measured
  per-domain accuracy once there are 40+ attempts in the practice bank.
- Multi-agent economics (4x, 15x, 90.2%, 3-5 subagents) was put in the reference sheet
  but deliberately kept out of the lesson, to protect working memory. It needs its own
  lesson, and those numbers need spaced repetition rather than a single exposure.

## Next

Lesson 0002 on the six patterns and their traps. Spaced retrieval of this lesson's
escalation test should be folded into Lesson 0003 rather than repeated immediately.
