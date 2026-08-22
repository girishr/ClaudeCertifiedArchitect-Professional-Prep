# CCAR-P: Study Plan

**Today: Thursday 20 August 2026. Target exam date: Saturday 5 September 2026.** Seventeen study days, counting today.

## How to actually use this

There is one spine and three supports. Get this right and the rest is scheduling.

| | What it is | When |
|---|---|---|
| **The spine** | [Anthropic's official CCAR-P Prep Course](https://anthropic-partners.skilljar.com/path/claude-certified-architect-professional). Free, 733 minutes, five courses | Every study day. This is where the knowledge comes from |
| Support 1 | The `course/` lessons in this repo. 35 scenario drills | Straight after the matching official course, same evening |
| Support 2 | The `notes/` files | Week 3 revision, not week 1 reading |
| Support 3 | `questions.json` and the hub. 75 questions | Calibration. Domain drills as you go, one full mock at the end |

Watching alone will not get you to 720. Twelve hours of video builds recognition, and the exam tests decisions under time pressure. The drills exist to close exactly that gap.

## The five official courses

"Course 1" and "Course 2" below mean the five lessons inside the official prep path. Here they are with their real names, their length, and the exam domains each one buys you.

| # | Official course | Length | Exam domains it covers | Weight |
|---|---|---|---|---|
| 1 | Claude Platform & Solution Design | 238 min | 1 Solution Design, 2 Models/Prompting/Context | 30% |
| 2 | Enterprise Integration & Production | 158 min | 3 Integration, 4 Evaluation & Testing | 35% |
| 3 | Responsible AI, Safety & Risk for Architects | 114 min | 5 Governance, Safety & Risk | 14% |
| 4 | Stakeholder Engagement, Lifecycle & GTM | 178 min | 6 Stakeholder Communication & Lifecycle | 14% |
| 5 | Team Enablement & Operational Productivity | 45 min | 7 Developer Productivity | 7% |

Courses 1 and 2 are 54% of the video and 65% of the exam. They come first.

The course lists six prerequisite courses (Claude 101, Claude Code in Action, AI Fluency, Building with the Claude API, Introduction to MCP, AI Capabilities and Limitations). Skim the list and skip anything covering ground you already work in daily. Most of it will be a skip.

## Exam facts, confirmed

Every line below now comes from **Anthropic's own [CCAR-P Exam Guide PDF](https://everpath-course-content.s3-accelerate.amazonaws.com/instructor%2F6nizmqk8tpzpfjvt6qmmav7rh%2Fpublic%2F1783542810%2FClaude+Certified+Architect+%E2%80%93+Professional+Exam+Guide.pdf)**, not third-party guesswork.

| Item | Detail |
|---|---|
| Items | 63 |
| Time | 120 minutes |
| Types | Multiple choice and multiple response. Each item states how many to select |
| Scoring | Scaled 100 to 1,000, pass at **720** |
| Validity | 12 months from award |
| Cost | 175 USD |
| Delivery | Pearson VUE, online proctored or test centre. Closed book |
| Retakes | 14 days, then 30, then 90. Four attempts per rolling 12 months |
| Prerequisites | None. "There are no mandatory prerequisites or courses required to sit this exam" |

Recommended experience per the guide: 3+ years systems architecture or platform engineering, 6+ months hands-on Claude or comparable LLM production experience, and end-to-end delivery experience. You clear all three.

## Domain weightings, confirmed

The official blueprint matches what this repo was already built on, so the hour allocations below stand.

| # | Domain | Weight | Items | Confidence | Hours |
|---|---|---|---|---|---|
| 3 | Integration | 19% | 12 | Weak | 11 |
| 1 | Solution Design & Architecture | 17% | 11 | Stronger | 6 |
| 4 | Evaluation, Testing & Optimization | 16% | 10 | Weak | 10 |
| 5 | Governance, Safety & Risk Management | 14% | 9 | Weak | 9 |
| 6 | Stakeholder Communication & Lifecycle | 14% | 9 | Weak | 8 |
| 2 | Claude Models, Prompting & Context Engineering | 13% | 8 | Stronger | 5 |
| 7 | Developer Productivity & Operational Enablement | 7% | 4 | Stronger | 3 |

Those four weak domains are 63% of the exam.

Do not try to convert 720 into "questions I can miss". A scaled score is not a percentage of items correct, and with a floor of 100 the arithmetic does not work the way it looks. The structural version: losing one weak domain outright is probably survivable, losing two is not.

## The scheduling problem

The SpecPilot web launch is targeted for **Wednesday 26 August**, which sits in the middle of these seventeen days. Launch week will take your evenings whether you plan for it or not.

So this plan front-loads. The heavy lifting happens before the 26th, launch week is deliberately near-empty, and the second sprint picks up afterwards. Do not try to run both at full intensity, and do not schedule the exam earlier to "get it out of the way" - the retake ladder starts at 14 days and there is no second attempt before the launch settles.

## Sprint 1: before the launch

**Thu 20 to Tue 25 August. Six days, roughly 2 hours a night.** This is the expensive stretch. It buys 65% of the exam.

| Day | Date | Official course | Then |
|---|---|---|---|
| 1 | Thu 20 Aug | Course 1, first third (~80 min) | Course lessons 0001 and 0002 |
| 2 | Fri 21 Aug | Course 1, second third (~80 min) | Course lessons 0003 and 0004 |
| 3 | Sat 22 Aug | Course 1, final third (~78 min) | Course lessons 0005, 0006, 0007. Then 13 Domain 1 questions |
| 4 | Sun 23 Aug | Course 2, first half (~80 min) | Notes: Integration, mechanism choice and MCP architecture |
| 5 | Mon 24 Aug | Course 2, second half (~78 min) | Notes: Evals. Then 14 Integration questions |
| 6 | Tue 25 Aug | Catch up on anything slipped | 12 Evals questions. Then stop and launch |

**Checkpoint:** you should be able to say, without notes, when MCP beats a direct API integration, and name four grading methods with the situation each suits.

## Launch week: protected

**Wed 26 to Fri 28 August. Three days, 30 minutes a night maximum.** No new heavy material.

| Day | Date | Work |
|---|---|---|
| 7 | Wed 26 Aug | Launch day. Course 5 (45 min) only if the launch is calm. Otherwise nothing |
| 8 | Thu 27 Aug | Course 5 if not done. Otherwise re-read one-line recalls from the Domain 1 notes |
| 9 | Fri 28 Aug | 5 Domain 7 questions. Small domain, do not overinvest |

Course 5 sits here on purpose: 45 minutes, 7% of the exam, the least demanding thing in the path.

## Sprint 2: the consulting half

**Sat 29 August to Wed 2 September. Five days, back to 2 hours.** This is the half that technically strong candidates underestimate. Course 4 is the second-longest in the whole path, which tells you how seriously Anthropic weights it.

| Day | Date | Official course | Then |
|---|---|---|---|
| 10 | Sat 29 Aug | Course 3, all of it (114 min) | Notes: Governance Domain 5. Rebuild the regulation-to-control table from memory |
| 11 | Sun 30 Aug | Course 4, first half (~90 min) | 11 Governance questions |
| 12 | Mon 31 Aug | Course 4, second half (~88 min) | Notes: Stakeholder Domain 6 |
| 13 | Tue 1 Sep | Any official course material still outstanding | 10 Stakeholder questions. Then Lab 8, the consulting artifact lab |
| 14 | Wed 2 Sep | Notes: Domain 2, models and context. Light | 10 Models questions |

**Checkpoint:** every official course finished. If any weak domain is still under 60% on the drills, the taper below buys it a repair block.

## Taper: calibrate, do not cram

**Thu 3 to Sat 5 September.** No new material.

| Day | Date | Work |
|---|---|---|
| 15 | Thu 3 Sep | **Full mock 1.** 63 questions, 120 minutes, timed, no notes, no breaks. Score it and stop. Do not review today |
| 16 | Fri 4 Sep | **Mock review**, morning if you can. Every wrong answer and every right answer you were unsure of, one line each on why the distractor was tempting. Evening: all one-line recalls across the three notes files, twice. This is the highest-value day in the plan |
| 17 | Sat 5 Sep | **Exam.** Light re-read of recalls and distractor lists in the morning. Nothing new |

Mock 2 is deliberately cut. With seventeen days and a launch inside them, one mock properly reviewed beats two mocks skimmed.

## Extra reps, if you want them

This repo's 75 questions plus the 35 course drills is enough. If you burn through them and want more:

- [CertSafari - Anthropic](https://certsafari.com/anthropic) - free, no signup, and the only third-party bank that covers CCAR-P directly rather than Foundations
- [Claude Certification Guide mock exam](https://claudecertificationguide.com/mock-exam) - free timed mock. It is built for **Foundations**, 60 items and a five-domain split, so use it to rehearse working against the clock, not to judge where you stand by domain

Neither is a substitute for the official course. If time is tight, drop these before you drop anything on days 15 and 16.

## The daily shape

A two-hour evening that works:

1. 10 min: re-read yesterday's one-line recalls
2. 60-80 min: the official course segment
3. 10 min: break, away from the screen
4. 30 min: the matching drills from `course/`, or the domain question set
5. 10 min: write your own one-line summary of anything you got wrong

Step 5 is the one people skip and the one that moves the score.

## Exam technique

- Read the last sentence first, then the scenario. The ask is narrower than the setup.
- Find the binding constraint: a latency SLA, a compliance regime, a budget, a team maturity level, a residency rule. The right answer respects it. The best-sounding answer that violates it is the trap.
- Each item states how many responses to select, so read that line before the options. On a select-two, the correct answers usually sit at different layers, one architectural and one operational.
- Distractors are real techniques applied at the wrong time. If two answers both look right, one is right under a slightly different constraint. Work out which constraint separates them.
- Watch for absolutes. "Always" and "never" are usually wrong in a domain of tradeoffs, unless the absolute is a hard compliance rule.
- Budget under two minutes per item. Flag anything over three and move on. A ten-minute reserve at the end beats a perfect answer on question 12.
- On governance and stakeholder items, when in doubt pick the option that preserves the ability to undo.

## If you fall behind

Cut in this order:

1. All labs except Lab 8
2. The `notes/` re-reads for Domains 1, 2 and 7, keeping only the question sets
3. Course 5, and accept the 7%

Never cut: the day 16 mock review, the official Courses 2 and 4, and the drills on your four weak domains.
