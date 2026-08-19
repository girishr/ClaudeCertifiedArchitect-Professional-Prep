# 0002 - The syllabus was hiding in the learning objectives

- **Date:** 2026-08-19
- **Type:** course structure change, not a mission change
- **Supersedes:** the provisional lesson plan in NOTES.md

## What happened

The first seven-lesson plan was reverse-engineered from the exam domain list. It looked
reasonable. It was also wrong in a way that would not have surfaced until the exam.

Fetching the gated course page at
`/path/claude-certified-architect-professional/claude-platform-solution-design` returned
its **learning objectives** even though the module content is behind enrolment. Those
objectives are the actual syllabus, and two of the six had no lesson at all in the
original plan:

- **Identifying platform entry points** (claude.ai, API, SDK, Claude Code, MCP server)
- **Distinguishing user-facing, build-time and enterprise delivery routes** while
  accounting for governance constraints

Both are squarely examinable and neither is deducible from a domain title like "Solution
Design & Architecture". The plan also over-invested in things I found interesting:
"architecture to business value" was a planned lesson and is not a stated objective of
this course at all. It belongs to Course 4, Stakeholder Engagement.

## The lesson about learning, not about Claude

**A gated course will often still tell you what it teaches.** The objectives, the
prerequisites and the description are usually public even when the video is not. That is
enough to build a syllabus against, and it beats inferring one from a domain list.

Generalised: when a plan is reverse-engineered from an artifact's *output* (the exam
blueprint), check whether the *source* (the course) has published its own structure.
Cheap to check, and it caught two missing topics here.

## What changed

Sequence now mirrors the six official objectives. Lesson 0001 survived unchanged, since
"selecting between augmented calls, workflows, and agents" is an objective almost
verbatim. 0002 through 0007 were written against the rest.

## Corrections that came out of the writing

Three claims I had held loosely turned out to need qualifying, all caught by checking
primary sources rather than trusting the summary:

1. The "subagent burns tens of thousands of tokens and returns 1,000 to 2,000" figure is
   **not** in Anthropic's multi-agent post. The mechanism is documented, the numbers are
   not. Teaching the mechanism, dropping the numbers.
2. "Agents cannot see each other's edits" is my phrasing, not Anthropic's. Their line is
   that most coding tasks involve fewer truly parallelisable tasks than research.
3. Data residency has **no EU option**: `inference_geo` supports `us` and `global` only,
   and `us` is the only workspace geo. "That constraint cannot be met with this control"
   is a real consulting answer and now a drill.

## Still open

- The granular module breakdown remains gated. If enrolment reveals a different split,
  restructure rather than defend this one.
- Courses 2 to 5 unwritten. Course 4, Stakeholder Engagement at 178 minutes, is the
  second-longest in the path and lands on a self-rated weak domain, so it is the highest
  priority next.
