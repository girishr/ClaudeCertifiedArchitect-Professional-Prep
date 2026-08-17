# CCAR-P: 3-Week Study Plan

**Target exam date: Saturday 5 September 2026** (day 20). Book it now, on day 1. An unbooked exam slips.

## Read this before day 1: the eligibility gate

Anthropic's certification FAQ states that certification is available to people at Claude Partner Network organisations, and that **registration requires a work email on a recognised company domain. Personal email addresses will not work.** So step zero is not studying, it is confirming that your employer is in the Claude Partner Network and that your work address gets you into the Partner Academy. If it is not, sorting that out is a lead time you need to know about on day one, not in week three. Joining at the Registered entry level is free, but it is an organisation-level action, not something you can do on your own account.

## The exam you are preparing for

| Item | Detail |
|---|---|
| Name | Claude Certified Architect - Professional (CCAR-P) |
| Format | 63 scenario-based questions, all scored |
| Time | 120 minutes, about 1.9 minutes per question |
| Question types | Single-answer multiple choice, plus roughly 25% multiple-response ("Select TWO/THREE") |
| Scoring | Scaled score from 100 to 1000, pass mark 720 |
| Cost | 175 USD |
| Delivery | Pearson VUE, online proctored or test centre. Closed book, no Claude, no docs |
| Validity | 12 months, free on-time renewal via a non-proctored assessment |
| Registration | Anthropic Partner Academy on Skilljar, then schedule through Pearson VUE |

The 120 minutes, the 720 pass mark on a 100 to 1000 scale, the 175 USD price, the 12-month validity and the Pearson VUE delivery are all confirmed on Anthropic's own certification pages and FAQ. The **63-question count and the domain weightings below are not**. They come only from third-party prep sites citing "Exam Guide v1.0, July 2026", and those sites copy each other freely. Download the real exam guide from the Academy on day 1 and re-derive the hour allocations from it before you commit three weeks to this split.

One more thing the FAQ confirms and most guides skip: retakes wait 14, then 30, then 90 days, capped at four attempts per rolling 12 months. That is a good reason not to sit it early to "see what it's like".

## Domain weightings, and what they mean for your time

The "confidence" column below is filled in for the author of this plan: strong on the architecture and Claude Code side from day-to-day work, weaker on integration depth, evaluation practice, governance and the consulting half of the role. **Re-rate it honestly for yourself before you use the hours.** If your weak set is different, move the hours, not the plan structure.

| # | Domain | Weight | Questions (approx) | Confidence | Hours to spend |
|---|---|---|---|---|---|
| 3 | Integration | 19% | 12 | Weak | 11 |
| 1 | Solution Design & Architecture | 17% | 11 | Stronger | 6 |
| 4 | Evaluation, Testing & Optimization | 16% | 10 | Weak | 10 |
| 5 | Governance, Safety & Risk Management | 14% | 9 | Weak | 9 |
| 6 | Stakeholder Communication & Lifecycle | 14% | 9 | Weak | 8 |
| 2 | Claude Models, Prompting & Context Engineering | 13% | 8 | Stronger | 5 |
| 7 | Developer Productivity & Operational Enablement | 7% | 4 | Stronger | 3 |

Those four weak domains are 63% of the exam. That is where the plan puts its weight. Domains 1, 2 and 7 are the ones an experienced architect's day job already covers, so they get review passes rather than study blocks.

Do not try to convert 720 into "questions I can miss". A scaled score is not a percentage of items correct, and with a floor of 100 the arithmetic does not work the way it looks. The useful version of the same thought is structural: losing one weak domain outright is probably survivable, losing two is not.

## How to use the three assets together

- **Notes** are for the first pass and for the final week's re-reads. Read the "what the exam is really testing" framing and the "common distractors" list first, then the body.
- **Labs** are for building judgement you cannot get from reading. Do the five priority labs even if you skip everything else.
- **Question bank** is for calibration. Do not burn it all in week 1. Split it: a diagnostic on day 1, domain-specific sets as you finish each domain, and two full mocks in week 3.

## Week 1: cover the ground

Roughly 2.5 hours on weekdays, 5 on the weekend.

| Day | Date | Focus | Work |
|---|---|---|---|
| 1 | Mon 17 Aug | Setup and diagnostic | Register on the Partner Academy, download the official exam guide, book the Pearson VUE slot for 5 Sep. Take a 25-question mixed diagnostic from the bank, untimed. Record your per-domain score. |
| 2 | Tue 18 Aug | Integration part 1 | Notes: Integration, sections on mechanism choice and MCP architecture. Read the MCP spec overview alongside it. |
| 3 | Wed 19 Aug | Integration part 2 | Notes: tool design, capability bloat, auth and security. Then Lab 1 (build an MCP server, break the tool descriptions). |
| 4 | Thu 20 Aug | Integration part 3 | Notes: RAG pipeline design and observability. Read Anthropic's contextual retrieval post. Do 14 Integration questions from the bank. |
| 5 | Fri 21 Aug | Evals part 1 | Notes: eval set construction, grading methods, metrics selection. |
| 6 | Sat 22 Aug | Evals part 2 + lab | Notes: agent-specific evaluation, rollout strategies, root-cause diagnosis, optimisation levers. Then Lab 4 (build an eval harness with a CI gate). Do 12 Evals questions. |
| 7 | Sun 23 Aug | Governance | Notes: Domain 5 end to end. Build your own regulation-to-control mapping table from memory, then check it against the notes. Do 11 Governance questions. |

**End of week 1 checkpoint:** you should be able to explain, without notes, when MCP beats a direct API integration, and name four grading methods with the situation each suits.

## Week 2: close the weak gaps

Roughly 2.5 hours on weekdays, 5 on the weekend.

| Day | Date | Focus | Work |
|---|---|---|---|
| 8 | Mon 24 Aug | Stakeholder and lifecycle | Notes: Domain 6 end to end. This is the domain most likely to be underestimated. Do 10 Stakeholder questions. |
| 9 | Tue 25 Aug | Integration security | Lab 2 (OAuth, scoping, least privilege, prompt-injection test). Re-read the injection and confused-deputy sections. |
| 10 | Wed 26 Aug | Retrieval judgement | Lab 3 (RAG eval: recall@k, naive vs contextual chunking vs reranking, when long context wins). |
| 11 | Thu 27 Aug | Solution design review | Notes: Domain 1. Focus on the pattern-selection table and the "when a workflow beats an agent" rules. Do 13 Design questions. |
| 12 | Fri 28 Aug | Models and context | Notes: Domain 2. Prompt caching mechanics, model routing, context management. Do 10 Models questions. |
| 13 | Sat 29 Aug | Guardrails lab | Lab 7 (layered guardrails, HITL gates, audit logging, compliance control mapping). Then Lab 6 if you have energy left (caching, routing, batch, measure before and after). |
| 14 | Sun 30 Aug | Consulting artifacts | Lab 8 (mock discovery, ADR, success metrics, phased rollout, exec one-pager). Then re-read the Domain 6 distractor list. |

**End of week 2 checkpoint:** re-score the day 1 diagnostic questions you got wrong. If any weak domain is still under 60%, week 3 buys it a dedicated re-read block.

## Week 3: calibrate and consolidate

Roughly 2.5 hours on weekdays, 4 on the weekend. No new material after day 18.

| Day | Date | Focus | Work |
|---|---|---|---|
| 15 | Mon 31 Aug | Dev productivity | Notes: Domain 7. Claude Code at team scale, settings precedence, hooks, subagents. Do 5 questions. Small domain, do not overinvest. |
| 16 | Tue 1 Sep | Full mock 1 | 63 questions, 120 minutes, timed, no notes, no breaks. Score it. Do not review yet. |
| 17 | Wed 2 Sep | Mock 1 review | Review every wrong answer AND every right answer you were unsure of. For each, write one line on why the distractor was tempting. This is the highest-value session in the plan. |
| 18 | Thu 3 Sep | Targeted repair | Re-read notes for the two domains that scored worst in the mock. Redo those domain question sets. |
| 19 | Fri 4 Sep | Full mock 2 + recalls | Mock 2 in the morning if you can, otherwise a 30-question timed set. Evening: read every "one-line recalls" list across all three notes files, twice. |
| 20 | Sat 5 Sep | Exam day | Light re-read of the recalls and distractor lists in the morning. Nothing new. Sit the exam. |
| 21 | Sun 6 Sep | Buffer | Reserve day if you need to move the exam. Keep it free. |

## Daily session shape

A 2.5 hour weekday session that works:

1. 10 min: re-read yesterday's "one-line recalls"
2. 60 min: new material or lab
3. 15 min: break, away from the screen
4. 45 min: questions on what you just covered
5. 20 min: write your own one-line summary of anything you got wrong

The last step is the one people skip and the one that moves the score.

## Exam technique

- Read the last sentence of the question first, then the scenario. The scenario is long and the actual ask is often narrower than it looks.
- Find the binding constraint. Almost every question has one: a latency SLA, a compliance regime, a budget, a team maturity level, a data residency requirement. The right answer is the one that respects it. The best-sounding answer that violates it is the trap.
- On "Select TWO", the two correct answers usually sit at different layers, for example one architectural and one operational. Two answers from the same layer is a warning sign.
- Watch for absolutes. "Always", "never" and "all" are usually wrong in a domain built on tradeoffs. Watch for the reverse trap too: sometimes the absolute is correct because it is a hard compliance rule.
- Distractors here are real techniques applied at the wrong time. If two answers both look right, one of them is right for a slightly different scenario. Work out which constraint separates them.
- Budget 1.9 minutes per question. Flag anything over 3 minutes and move on. A 10-minute reserve at the end is worth more than a perfect answer on question 12.
- Governance and stakeholder questions often have a "do the reversible thing first" answer. When in doubt on those two domains, pick the option that preserves the ability to undo.

## What to do if you fall behind

Cut in this order:

1. Labs 5 and 6 (nice to have, your day job partly covers them)
2. Domain 1, 2 and 7 study blocks, keep only the question sets
3. Mock 2

Never cut: the day 17 mock review, the four weak-domain notes, and Labs 2, 3, 4, 7, 8.
