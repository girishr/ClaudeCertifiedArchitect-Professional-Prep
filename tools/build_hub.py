#!/usr/bin/env python3
"""Rebuild index.html from the question bank and the HTML template.

Run from anywhere:  python3 tools/build_hub.py

Edit tools/hub-template.html for layout or the study plan data below, and
questions.json for the question bank. The template has two placeholders,
__QUESTIONS__ and __PLAN__, which are replaced with JSON literals.
"""
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent

PLAN = [
  {"title": "Week 1 - cover the ground",
   "goal": "Roughly 2.5 hours on weekdays, 5 on the weekend. Get all seven domains onto the page, starting with the two heaviest.",
   "days": [
    {"n": 1, "date": "Mon 17 Aug", "focus": "Setup and diagnostic", "work": "Confirm Partner Network eligibility, register on the Partner Academy, download the official exam guide, book the Pearson VUE slot. Take a 25-question mixed diagnostic, untimed. Record the per-domain split."},
    {"n": 2, "date": "Tue 18 Aug", "focus": "Integration part 1", "work": "Notes: mechanism choice and MCP architecture. Read the MCP spec overview alongside it."},
    {"n": 3, "date": "Wed 19 Aug", "focus": "Integration part 2", "work": "Notes: tool design, capability bloat, auth and security. Then Lab 1, build an MCP server and break the tool descriptions."},
    {"n": 4, "date": "Thu 20 Aug", "focus": "Integration part 3", "work": "Notes: RAG pipeline design and observability. Read Anthropic's contextual retrieval post. Drill 14 Integration questions."},
    {"n": 5, "date": "Fri 21 Aug", "focus": "Evals part 1", "work": "Notes: eval set construction, grading methods, metric selection."},
    {"n": 6, "date": "Sat 22 Aug", "focus": "Evals part 2 and lab", "work": "Notes: agent evaluation, rollout strategies, root-cause diagnosis, optimisation levers. Then Lab 4, build an eval harness with a CI gate. Drill 12 Evals questions."},
    {"n": 7, "date": "Sun 23 Aug", "focus": "Governance", "work": "Notes: Domain 5 end to end. Rebuild the regulation-to-control mapping table from memory, then check it. Drill 11 Governance questions."}
   ]},
  {"title": "Week 2 - close the weak gaps",
   "goal": "Same hours. Labs carry this week: judgement you cannot get from reading.",
   "days": [
    {"n": 8, "date": "Mon 24 Aug", "focus": "Stakeholder and lifecycle", "work": "Notes: Domain 6 end to end. The domain most likely to be underestimated. Drill 10 Stakeholder questions."},
    {"n": 9, "date": "Tue 25 Aug", "focus": "Integration security", "work": "Lab 2: OAuth, scoping, least privilege, prompt-injection test. Re-read the injection and confused-deputy sections."},
    {"n": 10, "date": "Wed 26 Aug", "focus": "Retrieval judgement", "work": "Lab 3: RAG eval. recall@k, naive vs contextual chunking vs reranking, and when long context wins outright."},
    {"n": 11, "date": "Thu 27 Aug", "focus": "Solution design review", "work": "Notes: Domain 1. Focus on the pattern-selection table and the rules for when a workflow beats an agent. Drill 13 Design questions."},
    {"n": 12, "date": "Fri 28 Aug", "focus": "Models and context", "work": "Notes: Domain 2. Prompt caching mechanics, model routing, context management. Drill 10 Models questions."},
    {"n": 13, "date": "Sat 29 Aug", "focus": "Guardrails lab", "work": "Lab 7: layered guardrails, human-in-the-loop gates, audit logging, compliance control mapping. Add Lab 6 if you have energy left."},
    {"n": 14, "date": "Sun 30 Aug", "focus": "Consulting artifacts", "work": "Lab 8: mock discovery, ADR, success metrics, phased rollout, executive one-pager. Then re-read the Domain 6 distractor list."}
   ]},
  {"title": "Week 3 - calibrate and consolidate",
   "goal": "No new material after day 18. This week is about timing, review discipline and recall.",
   "days": [
    {"n": 15, "date": "Mon 31 Aug", "focus": "Developer productivity", "work": "Notes: Domain 7. Claude Code at team scale, settings precedence, hooks, subagents. Drill 5 questions. Small domain, do not overinvest."},
    {"n": 16, "date": "Tue 1 Sep", "focus": "Full mock 1", "work": "63 questions, 120 minutes, timed, no notes, no breaks. Score it and stop. Do not review today."},
    {"n": 17, "date": "Wed 2 Sep", "focus": "Mock 1 review", "work": "Review every wrong answer and every right answer you were unsure of. Write one line each on why the distractor was tempting. Highest-value session in the plan."},
    {"n": 18, "date": "Thu 3 Sep", "focus": "Targeted repair", "work": "Re-read notes for the two worst-scoring domains. Redo those domain drills."},
    {"n": 19, "date": "Fri 4 Sep", "focus": "Full mock 2 and recalls", "work": "Mock 2 in the morning if you can, otherwise a 30-question timed set. Evening: read every one-line recalls list across all three notes files, twice."},
    {"n": 20, "date": "Sat 5 Sep", "focus": "Exam day", "work": "Light re-read of recalls and distractor lists in the morning. Nothing new. Sit the exam."},
    {"n": 21, "date": "Sun 6 Sep", "focus": "Buffer", "work": "Reserve day in case you need to move the exam. Keep it free."}
   ]}
]


def main() -> None:
    questions = json.loads((ROOT / "questions.json").read_text(encoding="utf-8"))["questions"]
    template = (ROOT / "tools" / "hub-template.html").read_text(encoding="utf-8")
    out = (template
           .replace("__QUESTIONS__", json.dumps(questions, ensure_ascii=False))
           .replace("__PLAN__", json.dumps(PLAN, ensure_ascii=False)))
    target = ROOT / "index.html"
    target.write_text(out, encoding="utf-8")
    print(f"wrote {target} ({len(out)} bytes, {len(questions)} questions)")


if __name__ == "__main__":
    main()
