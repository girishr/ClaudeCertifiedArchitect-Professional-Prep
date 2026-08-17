# CCAR-P Revision Notes 03: Governance, Safety and Risk + Stakeholder Communication and Lifecycle

Scope: Domains 5 and 6, 28% of the exam combined (roughly 17-18 of 63 questions). Wrong answers here are real techniques applied at the wrong severity, wrong stage, or to the wrong audience. Read every stem for three signals before looking at the options: **who is harmed**, **can it be undone**, **what lifecycle stage are we in**. Those three usually determine the key.

Currency note: verified August 2026 against Anthropic docs, the EU Commission AI Act service desk, and India's DPDP Rules 2025. Two things moved recently: EU AI Act high-risk deadlines were deferred by the Digital Omnibus, and Anthropic's residency controls moved from a legacy org-level opt-out to per-request `inference_geo` plus workspace geo. Anything I could not confirm from a primary source is flagged inline.

---

## Domain 5: Governance, Safety and Risk Management (14%)

**What the exam is really testing.** Not whether you can list controls, but whether you can pick a *proportionate* stack and justify it. Almost every distractor is a legitimate control that is either too heavy for the stated risk (kills the business case) or too light (leaves unacceptable residual risk). The examiner wants an architect who can say "reversible, low blast radius, internal, so sampled review plus logging is enough" and equally "irreversible external financial action, so a synchronous gate is non-negotiable even at a latency cost." Stem words that are load-bearing: *irreversible*, *externally visible*, *regulated*, *customer-facing*, *PHI*, *minors*, *autonomous*.

### 5.1 The layered guardrail stack

Five layers. Each catches a different failure class, and each has a different cost. You are expected to know what each layer *cannot* do.

| Layer | Mechanism | Catches | Misses | Cost | Reach for it when |
|---|---|---|---|---|---|
| Input filtering | Regex/deny-lists, PII redaction, a cheap classifier (Haiku-class) screening the user turn | Known-pattern injection, obvious abuse, PII entering the boundary at all | Novel phrasing, indirect injection arriving later via tools | Low latency, low cost | Always for PII; when abuse volume is high enough to justify pre-screening |
| Prompt-level constraints | System prompt scope, refusal instructions, declaring untrusted content as untrusted, role boundaries | Drift, scope creep, casual misuse | Determined adversaries. Never a security boundary on its own | Free | Always, but never as the only control |
| Tool permissioning | Least-privilege scopes, read-only defaults, allow/approve/block per action, sandboxing, egress restriction | Exfiltration, confused deputy, over-broad blast radius | Anything within the granted scope | Design cost, some friction | Any agent with write access or network reach |
| Output validation | Schema/structured-output enforcement, groundedness/citation checks, a safety classifier on the response, business-rule assertions | Hallucinated facts and fields, unsafe content, malformed handoffs to downstream systems | Plausible-but-wrong content that passes every rule | Adds a model call and latency | When the output is consumed by a system or shown to a customer |
| Post-hoc monitoring | Logging, sampled human review, drift/refusal-rate dashboards, incident alerting, red-team cadence | Slow-moving degradation, novel attacks, aggregate bias | Nothing in real time. It is detection, not prevention | Ongoing operational cost | Always. This is the layer teams skip and the exam punishes |

**Proportionality rule.** Control cost should track expected loss (severity x likelihood), not the loudest stakeholder's anxiety. Maximum control is wrong when the stem gives a low-severity, reversible, internal use case and mentions latency or cost pressure. Correct there: prompt constraints + logging + sampled review, and *nothing else yet*.

**Defence in depth is about independence.** Two layers that fail for the same reason are one layer. A prompt instruction plus a model-based refusal are correlated; a prompt instruction plus a hard tool-permission boundary are not. "Strengthen the system prompt" offered against a security problem is almost always the distractor.

### 5.2 Human in the loop

Placement is the whole question. The deciding factor is **reversibility**, with blast radius as the tiebreaker.

| Situation | Pattern | Notes |
|---|---|---|
| Irreversible, externally visible (payment, email to customer, filing, deletion, contract) | Synchronous approval gate before the action | Gate the *action*, not the reasoning. Approving a plan is cheaper than approving each step |
| Reversible with cheap rollback (draft, internal ticket, staged change) | Post-hoc sampled review + easy undo | Build the undo before you build the gate |
| High volume, low unit severity | Statistical sampling, risk-weighted (sample more where confidence is low or value is high) | 100% review destroys the ROI and is a common wrong answer |
| Regulated decision affecting a person (credit, hiring, medical, legal, insurance) | Qualified human reviews before the decision takes effect, plus disclosure that AI assisted | This is both a regulatory and an Anthropic Usage Policy requirement |
| Novel/ambiguous cases the model flags | Escalation path with SLA, defined owner, and a feedback loop back into evals | Escalation without a named owner and a time bound is theatre |

**Plan-level approval beats step-level approval** for multi-step agents. Approving a full plan before execution gives meaningful influence without approval fatigue. Step-by-step confirmation trains users to click through, which is worse than no gate because it manufactures false assurance.

**100% review is only correct when** volume is low, severity is high, and the reviewer adds real signal. If a stem says reviewers approve 98% of items unchanged, move to risk-weighted sampling and reinvest in evals.

### 5.3 Failure modes and mitigations

| Failure mode | What it looks like | Primary mitigation | Wrong-but-tempting fix |
|---|---|---|---|
| Hallucination | Confident invented facts, citations, IDs | Ground in retrieval, require citations, validate against source, allow "I don't know", eval on groundedness | "Use a bigger model." Reduces but never eliminates |
| Direct prompt injection / jailbreak | User tries to override instructions | Input screening classifier, refusal instructions, rate-limit and ban repeat offenders | Longer system prompt |
| Indirect prompt injection | Malicious instructions inside a fetched document, web page, email, or tool result | Put untrusted content **only in tool result blocks**, JSON-encode it, declare its origin, screen tool output with a cheap classifier before Claude acts, restrict tool scope | Trusting the model to "ignore instructions in documents" |
| Data exfiltration via tools | Agent with read access to secrets plus network egress | Separate read scope from egress, allow-list destinations, sandbox, no secrets in context | Output filtering alone. The data has already left |
| Over-permissioned agent | One credential with broad scope reused everywhere | Per-task scoped credentials, read-only default, time-bounded elevation | Auditing after the fact |
| Confused deputy | Agent uses its own elevated privilege on behalf of a lower-privileged user | Propagate the *caller's* identity and permissions to the tool call, never the agent's | Logging who asked |
| PII leakage | PII in prompts, logs, traces, caches, or vendor retention | Redact before the boundary, zero/short retention, encrypt, restrict log access, tokenise | Relying on the model not to repeat it |
| Unsafe autonomy | Agent takes a consequential action nobody sanctioned | Action allow-lists, spend/rate caps, kill switch, plan approval | "Improved instructions" |
| Non-determinism | Same input, different output; regressions on model upgrade | Pinned model versions, regression eval suite in CI, temperature control, structured outputs, canary rollout | Promising deterministic behaviour to the customer |

### 5.4 Compliance mapping: obligation to architectural control

This table is the highest-yield thing in the domain. Exam items typically name a regulation and a scenario and ask which control set satisfies it.

| Regime | Core obligation the exam will test | Concrete architectural control |
|---|---|---|
| **GDPR** - lawful basis | You need one before processing; legitimate interest requires a balancing test | Documented DPIA and LIA, purpose recorded in the design |
| GDPR - data minimisation | Only what is necessary for the stated purpose | Field-level redaction pre-prompt, no "send the whole record" retrieval, narrow retrieval scope |
| GDPR - DSRs (access, erasure, portability) | Must be able to find and delete a person's data | Per-subject indexing of prompts/logs/vectors, deletion propagating to caches, embeddings and backups, retention limits |
| GDPR - cross-border transfer | Ch. V mechanism required for non-adequate destinations | SCCs plus transfer impact assessment, or keep processing in-region via inference geo pinning |
| GDPR Art. 22 | Restricts solely-automated decisions with legal/similarly significant effect; safeguards include the right to obtain human intervention, express a view and contest | Mandatory human review with real authority to overturn. Note: "right to explanation" as a hard term appears in Recital 71, not Art. 22 text. The enforceable duty is meaningful information about the logic (Arts. 13-15). Do not overstate this |
| **HIPAA** | PHI handling; BAA with any business associate; minimum necessary | Signed BAA with the model provider, HIPAA-configured deployment, de-identification where possible, audit logging, encryption in transit and at rest, role-scoped retrieval |
| **SOC 2** | Trust Services Criteria, evidence of operating effectiveness over a period | Change management, access reviews, immutable audit logs, vendor SOC 2 reports collected and reviewed. Type II is the one that proves controls *operated*; Type I is design only |
| **FedRAMP** | US federal cloud authorisation; High for CUI | Deploy via an authorised path. Claude via Amazon Bedrock in AWS GovCloud carries FedRAMP High and DoD IL4/IL5 approval; the first-party commercial API does not |
| **EU AI Act** | Risk tiers: unacceptable (prohibited), high-risk, limited/transparency, minimal | Tier the use case first. Transparency (Art. 50) duties: disclose AI interaction, label synthetic content. High-risk brings risk management system, data governance, technical documentation, logging, human oversight, accuracy/robustness/cybersecurity |
| **India DPDP Act 2023 + DPDP Rules 2025** | Notice and consent, purpose limitation, erasure on withdrawal, breach notification, Significant Data Fiduciary extras | Itemised standalone notice, easy withdrawal, deletion on purpose completion, breach reporting to the Data Protection Board with a detailed report inside 72 hours, security logs retained at least one year, grievance redressal |

**EU AI Act dates (verified against the Commission's service desk, August 2026).** In force 1 Aug 2024. Prohibitions and AI literacy from 2 Feb 2025. GPAI provider obligations from 2 Aug 2025. Most provisions including Art. 50 transparency from 2 Aug 2026. Additional deepfake/CSAM prohibitions and transitional deadlines from 2 Dec 2026. **Annex III high-risk rules deferred to 2 Dec 2027**, and Annex I embedded high-risk to 2 Aug 2028. If a practice question still uses "August 2026 for high-risk", it predates the Digital Omnibus deferral.

**DPDP dates.** Rules notified 14 November 2025, phased: Data Protection Board stood up first, Consent Manager provisions at 12 months (14 Nov 2026), the bulk of operational duties at 18 months (14 May 2027). Treat the exact dates as directionally right and re-check; the phasing is the examinable point, not the day.

### 5.5 Anthropic-specific posture

**Training data.** By default Anthropic does not use commercial product inputs or outputs (API, Claude for Work, Claude Gov) to train models. Exceptions are opt-in: thumbs feedback (retains the related conversation up to five years and may be used for training) and programmes like the Development Partner Program. Consumer plans (Free, Pro, Max) have a separate regime. On the API, Anthropic is a **processor**; you are the controller.

**Retention and ZDR.** Commercial API conversation content is not retained by default. ZDR agreements cover the Messages and Token Counting APIs on eligible features, Claude Code with commercial API keys, and Claude Platform on AWS. ZDR does **not** cover Console/Workbench, consumer products, or stateful managed-agent sessions, and is incompatible with features that inherently need storage: Files API, Batch, code execution, MCP connector, agent skills. Some newer "covered models" carry mandatory 30-day retention and are excluded from ZDR entirely (docs currently name Claude Fable 5 and Mythos 5; verify the current list). Retained data is never used for training without express permission.

**ZDR is not the healthcare answer.** For PHI the recommended arrangement is a HIPAA-ready configuration with a BAA (encryption, access control, audit logging) rather than ZDR's immediate deletion, which destroys the auditability HIPAA wants. Classic distractor pair.

**Certifications.** SOC 2 Type I and II, ISO/IEC 27001:2022, ISO/IEC 42001:2023 (AI management systems), HIPAA-ready configuration with BAAs. Evidence via the Trust Center. Commercial products only, not consumer plans.

**Data residency (first-party API).** Two independent settings. `inference_geo` (`"global"` default, or `"us"`) sets where inference runs, per request, on Claude 4.6+ models; US pinning costs 1.1x. Workspace geo governs storage at rest and endpoint processing, is fixed at workspace creation, and is currently `"us"` only. Legacy global-routing opt-outs auto-migrated to `allowed_inference_geos: ["us"]`. On Bedrock and Vertex the parameter does not apply; region comes from the endpoint or inference profile.

| Deployment | Contract and BAA | Residency lever | Notable posture |
|---|---|---|---|
| Claude API (first-party) | Anthropic commercial terms, DPA, BAA available | `inference_geo` per request + workspace geo | Fastest access to new models and features; ZDR available on eligible surfaces |
| Amazon Bedrock | AWS contract; AWS BAA; AWS is your processor relationship | AWS region / GovCloud | The path to FedRAMP High and DoD IL4/IL5; inherits AWS controls, IAM, CloudTrail, KMS |
| Google Vertex AI | Google Cloud contract and BAA | GCP region / inference profile | Useful when the enterprise is already GCP-standardised for VPC-SC, CMEK, org policy |

Exam framing: deployment choice changes **who you contract with, which audit evidence you inherit, and where data sits**. It does not change model behaviour or your obligation to build guardrails.

**Usage Policy.** Universal restrictions cover CSAM, weapons, critical infrastructure attack, malicious cyber activity, fraud, election interference and privacy violation. Separately, **High-Risk Use Case Requirements** apply to consumer-facing outputs in legal, healthcare and mental health, insurance, financial and lending decisions, employment and housing eligibility, academic assessment, and automated journalism. Those require **review by a qualified professional** plus **disclosure that AI was involved**. The 2025 update confirmed these apply to consumer-facing, not pure B2B, contexts. Consumer-facing chatbots must disclose AI at session start.

### 5.6 Responsible AI in practice

- **Bias**: test disaggregated slices, not aggregate accuracy. Build a counterfactual eval set (swap protected attributes, expect stable outputs). Keep monitoring after launch, because bias shows up in production distributions you never sampled.
- **Transparency**: disclose at first contact, not in the terms. Model and system cards document intended use, limitations and evaluation results; they feed EU AI Act technical documentation rather than replacing it.
- **Explainability limits**: a chain of thought is a plausible narrative, not a faithful account of the computation, and it is not an audit trail. What you can legitimately provide: retrieved sources, inputs, prompt and model versions, the policy applied, and the human who signed off.
- **Incident response**: severity levels, a kill switch that works without a deploy, rollback to the previous prompt/model version, user-notification criteria, and a post-incident review that produces a new eval case. An incident that does not generate a regression test will recur.

### 5.7 Risk framing (NIST AI RMF style)

- **Govern**: policy, roles, accountability, culture. Cuts across the other three.
- **Map**: context, use case, stakeholders, what could go wrong.
- **Measure**: evals, metrics, red teaming, quantify residual risk.
- **Manage**: prioritise, treat, monitor, respond.

Practical artefact: a risk register with owner, severity x likelihood score, inherent vs residual risk, control mapping, and an accepted-risk sign-off by a named business owner. **Risk acceptance is a business decision, not an architect's decision.** If a stem has an architect unilaterally accepting residual risk, that is the wrong answer.

### Decision heuristics (Domain 5)

- If the action is **irreversible and externally visible**, insert a synchronous approval gate. Everything else is secondary.
- If the action is **reversible**, invest in rollback and monitoring before you invest in gates.
- If the threat is **injection or exfiltration**, the answer involves **tool scope and sandboxing**, not prompt wording.
- If untrusted third-party content enters the loop, it goes in a **tool result block**, JSON-encoded, with its origin declared, and gets screened before the model acts on it.
- If the scenario is **PHI**, the answer is **BAA + HIPAA configuration + audit logging**, not ZDR.
- If the requirement is **data must not leave the region**, pin inference geo (first-party) or choose the region/endpoint (Bedrock/Vertex), and confirm the feature you need is available there.
- If the requirement is **US federal / CUI**, route to **Bedrock in GovCloud**.
- If reviewers approve nearly everything, **switch to risk-weighted sampling** and spend the savings on evals.
- If the decision is **solely automated with legal or significant effect on a person**, add human intervention with authority to overturn.
- If the use case is **consumer-facing in law, medicine, finance, employment, housing or insurance**, you need qualified human review *and* AI disclosure.
- If the stem mentions **cost or latency pressure and low severity**, the correct control stack is smaller than the maximal one.
- If a model version changes, run the **regression eval suite** and canary before rollout. Never rely on "it should be better".

### Common distractors (Domain 5)

- **"Strengthen the system prompt" as a fix for prompt injection or exfiltration.** Prompts are not a security boundary. Right answer lives in permissioning.
- **"Apply ZDR" for a healthcare scenario.** ZDR removes the audit trail HIPAA expects. BAA plus HIPAA configuration is the pairing.
- **"Review 100% of outputs" for a high-volume, low-severity workflow.** Correct-sounding, kills the ROI, and induces rubber-stamping.
- **"Fine-tune to remove bias."** Fine-tuning changes behaviour but is not a bias control programme. You still need disaggregated testing and monitoring.
- **"Use a larger model to eliminate hallucination."** Reduces rate, never eliminates. Grounding and validation are the controls.
- **"Show chain of thought to satisfy the right to explanation."** Reasoning traces are not faithful explanations and not an audit artefact.
- **"Get a DPA" as the whole answer to a cross-border transfer question.** A DPA covers processor duties; the transfer needs a Chapter V mechanism or in-region processing.
- **"Anthropic is SOC 2 certified so we are compliant."** Vendor attestations cover the vendor. Your application's controls are yours.
- **"Log everything, forever."** Over-retention creates its own GDPR and DPDP exposure and expands breach blast radius.
- **"The architect accepts the residual risk."** Risk acceptance belongs to the accountable business owner.
- **"High-risk EU AI Act obligations bite in August 2026."** Deferred to December 2027 (Annex III). August 2026 is the transparency and general applicability date.
- **"Deploying on Bedrock makes us FedRAMP compliant."** It makes an authorised path available. Your own system still needs its own authorisation.

### One-line recalls (Domain 5)

1. Reversibility decides where the human gate goes; blast radius breaks ties.
2. Approve the plan, not every step, for multi-step agents.
3. Untrusted content belongs in tool result blocks, JSON-encoded, origin declared.
4. Screen tool output with a cheap classifier before the model acts on it.
5. Confused deputy is fixed by propagating the caller's identity, not the agent's.
6. Exfiltration is a scope-and-egress problem, not an output-filtering problem.
7. Commercial Anthropic data is not used for training by default; thumbs feedback is the main opt-in exception and retains the conversation up to five years.
8. Anthropic is a processor on the API; you are the controller.
9. ZDR excludes Console/Workbench, consumer products, managed agent sessions, Files/Batch/code execution/MCP connector.
10. Anthropic holds SOC 2 Type I and II, ISO 27001:2022, ISO 42001:2023, and offers HIPAA-ready configuration with BAAs.
11. `inference_geo` is `"global"` or `"us"`, per request, Claude 4.6+, 1.1x price for US pinning; workspace geo is set at creation and immutable.
12. Bedrock in AWS GovCloud is the FedRAMP High / DoD IL4-IL5 path.
13. EU AI Act: prohibitions Feb 2025, GPAI Aug 2025, transparency Aug 2026, Annex III high-risk Dec 2027, Annex I Aug 2028.
14. DPDP Rules 2025 phase in through roughly Nov 2026 (consent managers) to May 2027 (full compliance); breach report to the Board within 72 hours; security logs kept at least a year.
15. GDPR Art. 22 gives the right to human intervention and to contest; the strong "right to explanation" language sits in Recital 71.
16. SOC 2 Type II proves controls operated over time; Type I only proves they were designed.
17. Anthropic's High-Risk Use Case Requirements (law, health, insurance, finance, employment, housing, academia, journalism) require qualified human review plus AI disclosure for consumer-facing outputs.
18. NIST AI RMF is Govern, Map, Measure, Manage; Govern is the cross-cutting one.

---

## Domain 6: Stakeholder Communication and Lifecycle Management (14%)

**What the exam is really testing.** Judgement about people and money under uncertainty: a sponsor who wants a guarantee, a compliance lead who wants a veto, an engineering lead who wants a spec, and a pilot sitting at 78% against a 90% target. The examiner rewards answers that **make uncertainty explicit and agree a decision rule in advance**, and punishes answers that promise determinism, over-engineer before value is proven, or escalate before diagnosing. When every option looks like something a consultant might reasonably do, pick the one that either reduces ambiguity about success criteria or surfaces bad news early with a recommendation attached.

### 6.1 Discovery

Separate the **stated ask** ("a chatbot on our docs"), the **underlying job** ("tickets cost too much and take three days"), and the **success measure** ("deflection rate, time to first response"). Design against the last two. Solving the stated ask literally when the stem describes a different job is a reliable wrong answer.

**Qualification questions:** Who is the user and what do they do with the output? What happens today without AI and what does it cost? What does a wrong answer cost, and can it be undone? Where is ground truth, is it current and permissioned? How will we know it worked, in a number? Who owns it after go-live?

**Is AI even the right tool?** Deterministic, fully specified, rule-expressible tasks go to conventional software, which wins on cost, latency and auditability. LLMs earn their place where inputs are unstructured, language is central, the long tail is wide, and "approximately right, reviewed by a human" beats nothing.

**Feasibility x value scoring.** Value = frequency x unit value x adoption likelihood. Feasibility = data availability, evaluability, integration cost, risk tier. High/high goes first. **High value + low feasibility is where projects die**, and it is exactly where sponsors want to start. Low value + high feasibility builds the easy thing nobody needed.

### 6.2 Expectation management for probabilistic systems

- Never quote a **guarantee**. Quote an **accuracy target measured on a named eval set**, with a confidence interval and a stated fallback when it misses.
- Define **"good enough" against the human baseline**. If humans are 92% consistent, 90% with a review gate and audit trail is a win.
- Explain non-determinism in business terms: same question, differently worded answers; controlled by pinned model versions, structured outputs and a regression suite, with drift monitoring. No temperature talk with executives.
- Agree **acceptance criteria before the pilot starts**, in writing: metric, dataset, threshold, measurement method, signatory. The most common exam scenario is a pilot with no agreed criteria and a stakeholder moving goalposts. The fix is always to pause and agree criteria, not to argue about the number.
- Separate **quality** metrics (accuracy, groundedness, task completion), **experience** metrics (latency, adoption, CSAT) and **business** metrics (cost per task, deflection, cycle time). Only the last belongs in the business case.

### 6.3 SLAs, business cases, build vs buy

- **Cost per task** is the unit that travels. Count input + output tokens, retries, guardrail/classifier calls, retrieval, and human review minutes. Teams forget review cost and guardrail model calls, then miss the target.
- **Latency budget** splits across retrieval, model, validation and network; allocate up front. Levers when tight: smaller model for sub-steps, prompt caching, streaming to cut *perceived* latency, validation off the critical path where safe.
- **SLA framing**: commit to availability, latency percentiles (p50/p95/p99), and a *process* for quality (eval set, monthly review, remediation path). Never a contractual accuracy percentage on open-ended generation.
- **ROI**: (baseline cost - new cost - run cost) x volume, minus build cost, over a stated horizon. Discount for adoption ramp; a 40% saving at 30% adoption is a 12% saving.
- **Pilot to production gates**: eval threshold met on held-out data, cost and latency inside budget, guardrail incidents at or below threshold, named owner, runbook complete, rollback tested, security and compliance signed off.
- **Build vs buy**: buy undifferentiated capability where a vendor roadmap outruns yours. Build where the workflow is your differentiator, data cannot leave your boundary, or integration depth is the value. When the stem pairs a tight timeline with a proprietary workflow, the answer is usually hybrid: buy the platform, build the domain logic.

### 6.4 Documentation and handoff

What implementation teams actually need, in rough priority order:

| Artefact | Contains | Why it matters |
|---|---|---|
| Architecture decision records | Decision, context, options, consequences, date, owner | Stops relitigating and explains why the obvious alternative was rejected |
| Prompt artefacts | Versioned prompts, rationale, few-shot sets, changelog | Prompts are code; unversioned prompts are the top handoff failure |
| Eval suite | Golden dataset, scoring method, thresholds, CI integration | Without it nobody can safely change anything |
| Runbook | Failure modes, alerts, kill switch, rollback steps, escalation contacts, on-call | The difference between a pilot and a product |
| Guardrail and permission spec | Which layer catches what, tool scopes, approval matrix | Audit evidence and engineer onboarding |
| Cost and capacity model | Token math, rate limits, scaling assumptions | Prevents the surprise invoice |
| Known limitations | What it cannot do, out-of-scope inputs, disclosure text | Sets user expectations, protects the team |

### 6.5 Lifecycle and rollout

**POC** proves the task is technically possible, on a handful of examples, no production constraints. Output is a yes/no. A POC promoted straight to production is a named exam scenario and always the wrong answer.

**Pilot** proves value with real users, real data, real constraints and a measured baseline. Needs pre-agreed acceptance criteria, an eval set, monitoring and an end date.

**Production** adds SLOs, on-call, rollback, security review, cost controls and a named owner.

**Phased rollout**: internal dogfood, friendly cohort, percentage ramp with canary and automatic rollback triggers, then GA. At each stage ask whether the previous stage's metrics held at higher volume and a wider input distribution.

**Change management is not training.** Identify who loses time or status, name the "what's in it for me", recruit champions per team, train on the *new workflow* rather than the tool, publish what the system cannot do, and give a visible feedback path with evidence that feedback changed something. Adoption failures in exam stems come from workflow disruption or lack of trust, rarely from missing features.

**Post-launch loop**: feedback signals into a triage queue, failure cases converted into eval cases, monthly eval review, quarterly re-baselining against newer models, drift monitoring on input distribution and refusal rate.

### 6.6 Communicating to different audiences

| Audience | They actually want | Lead with | Avoid |
|---|---|---|---|
| Executives | Decision, money, risk, timing | Recommendation first, then the two or three numbers behind it, then the ask | Architecture diagrams, token economics, hedging without a recommendation |
| Legal and compliance | Where data goes, who can see it, what is logged, what the human control is, what the contract says | Data flow, residency, retention, BAA/DPA status, the approval gate and audit trail | "The model is very accurate" as a compliance argument |
| Engineering | Interfaces, constraints, failure modes, how to test | Contracts and schemas, eval harness, latency and cost budgets, non-goals | Business rationale as a substitute for a spec |
| End users | Will this make my day better, and can I trust it | What it does well, what it does badly, how to override it, how to escalate | Overselling capability, hiding limitations |
| Procurement/finance | Total cost, commitment, exit | Cost per task, run rate, contract shape, switching cost | Per-token pricing without volume assumptions |

One-artefact rule: write the deck once, then cut three versions. The exec version is the recommendation and three numbers. Never send the engineering deck to the exec sponsor.

### 6.7 Managing failure conversations

Sequence when a pilot misses its target:

1. **Diagnose before you report.** Is the gap capability, data, scope or measurement? A large share of misses are measurement problems: the eval set does not reflect real inputs, or the target was set against an unmeasured human baseline.
2. **Report early with a recommendation.** Bad news arriving with three options and a preferred one keeps you credible. Late bad news destroys the relationship whatever the technical outcome.
3. **Descope when a subset clears the bar.** 94% on the top three intents covering 70% of volume, 61% on the long tail: ship the three, route the rest to humans. Narrowing scope is the most common correct answer in this domain.
4. **Change the control stack when a human closes the gap.** 82% with a review gate can still beat baseline economics.
5. **Kill when** the underlying job is not valuable, the data does not exist, the risk tier makes controls uneconomic, or two focused iterations barely moved the number. Frame kills around what was learned and where the budget should go.

Never: quietly extend the pilot, re-run against an easier eval set, or take the target down without telling the sponsor the target moved.

### Decision heuristics (Domain 6)

- If acceptance criteria were never agreed, **stop and agree them** before arguing about performance.
- If the stated ask and the underlying job differ, design for the job and say so explicitly.
- If the task is deterministic and rule-expressible, recommend conventional software.
- If a subset of the scope meets the bar, **descope and ship the subset**.
- If the sponsor asks for a guarantee, offer an accuracy target on a named eval set plus a fallback path.
- If a POC is being promoted straight to production, insert a pilot with real users and a measured baseline.
- If adoption is low but accuracy is fine, the problem is workflow, trust or enablement, not the model.
- If the audience is compliance, lead with data flow and human control, not accuracy.
- If a pilot is behind, report early with options; never let the sponsor discover it.
- If cost per task exceeds budget, look at model routing, caching, prompt size and review minutes before declaring it infeasible.
- If the vendor capability is undifferentiated, buy it; if the workflow is the differentiator, build it.
- If a stem offers "add more features" as a response to a missed target, it is wrong. Narrow, or fix measurement.

### Common distractors (Domain 6)

- **"Extend the pilot by a quarter"** with no change to hypothesis, scope or measurement. Time is not an intervention.
- **"Build the full production architecture during discovery."** Over-engineering before value is proven.
- **"Present the architecture to the executive sponsor."** Wrong artefact for the audience.
- **"Commit to 99% accuracy in the SLA."** Open-ended generation quality is not contractually guaranteeable.
- **"Train users more"** when the workflow itself got worse for them.
- **"Escalate to the steering committee"** before diagnosing. Escalation without a recommendation reads as abdication.
- **"Start with the highest-value use case"** ignoring feasibility. That quadrant is where pilots die.
- **"Swap to a bigger model"** before checking whether the eval set is representative.
- **"Hand over prompts in a shared doc."** Prompts need versioning, evals and a changelog.
- **"Roll out to everyone because the pilot went well."** Pilot distribution rarely survives the full population.
- **"Let the sponsor lower the target"** without recording that it moved and why.

### One-line recalls (Domain 6)

1. Design against the underlying job, not the stated ask.
2. Agree acceptance criteria, dataset, threshold and sign-off before the pilot starts.
3. "Good enough" is defined against the human baseline, not perfection.
4. Cost per task includes retries, guardrail model calls, retrieval and human review minutes.
5. Latency budget is allocated across retrieval, model, validation and network before build.
6. SLA availability and latency percentiles yes; contractual accuracy percentage no.
7. POC proves feasibility, pilot proves value, production adds SLOs, on-call and rollback.
8. Production gates: eval threshold, cost, latency, guardrail incidents, owner, runbook, tested rollback, compliance sign-off.
9. Descoping to the high-confidence subset is usually better than missing the target on everything.
10. Bad news travels early and arrives with options and a recommendation.
11. ROI must be discounted by the adoption ramp.
12. Buy the undifferentiated platform, build the differentiating workflow.
13. Every incident and every failure case becomes a new eval case.
14. Prompts are versioned artefacts with a changelog, not documents.
15. Exec message: recommendation, three numbers, the ask.
16. Compliance message: data flow, residency, retention, human control, audit trail.
17. Low adoption with good accuracy means workflow, trust or enablement.
18. Kill criteria are defined at pilot start, not invented at pilot end.

---

## Cross-domain reminders

- Multiple-response items ("Select TWO/THREE") in these domains usually pair **one preventive control with one detective control**, or **one technical action with one stakeholder action**. If your two picks are both technical or both preventive, re-read.
- When two options are both correct in isolation, pick the one that matches the **stage** named in the stem. A control that is right in production is often wrong during discovery, and vice versa.
- The word "immediately" in an option is often a tell for an over-reaction. The words "before proceeding" often flag the correct sequencing answer.
- Anything you cannot verify against a primary source, treat as directional. The two areas most likely to have moved since these notes: EU AI Act sub-deadlines, and the exact list of Anthropic features and models eligible for ZDR.
