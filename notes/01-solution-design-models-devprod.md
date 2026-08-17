# CCAR-P Revision Notes: Solution Design, Models & Prompting, Developer Productivity

Covers Domain 1 (17%), Domain 2 (13%), Domain 7 (7%). Combined weight ~37%, so roughly 23 of the 63 questions.

Grounded in Anthropic docs as of August 2026: `platform.claude.com/docs`, `code.claude.com/docs`, and the engineering posts "Building effective agents", "How we built our multi-agent research system", and "Effective context engineering for AI agents". Where third-party exam guides disagree with these, the docs win. Two places where cram guides are commonly stale: (a) `thinking: {type: "enabled", budget_tokens: N}` is deprecated on 4.6 and rejected with a 400 on 4.7+, replaced by `thinking: {type: "adaptive"}` plus `output_config.effort` (five levels, default `high`); (b) long context above 200K carries no price premium on 4.6+ models, so "switch models to avoid the long-context surcharge" is no longer a valid answer.

---

## Domain 1: Solution Design & Architecture (17%)

### What the exam is really testing

Not whether you can name the six patterns. Whether you can read a scenario, spot the constraint that actually binds (latency SLA, audit requirement, unpredictable subtask count, token budget, blast radius of a wrong action), and pick the least complex architecture that clears it. Anthropic's stated position is explicit: start with a single augmented LLM call, add complexity only when simpler solutions demonstrably underperform. Most wrong answers on this domain are architectures that would work but are one or two tiers more complex than the scenario justifies.

### The three tiers

| Tier | Definition | Control flow | Pick when |
|---|---|---|---|
| Augmented LLM | One model call plus retrieval, tools, memory | None beyond the single call | Task fits in one call; you need a baseline before anything else |
| Workflow | LLMs and tools orchestrated through predefined code paths | You write the path | Steps are known in advance; you need predictable cost, latency and auditability |
| Agent | LLM dynamically directs its own process and tool use | Model decides the path | You genuinely cannot predict the number or order of steps |

The dividing line the exam will test: predictability of the path, not difficulty of the task. A hard task with a fixed sequence is still a workflow.

### Pattern selection table

| Pattern | Use when | Do NOT use when |
|---|---|---|
| Prompt chaining | Task decomposes cleanly into fixed subtasks; you will trade latency for accuracy; you want a programmatic gate between steps | Subtasks are not known ahead of time; latency budget is tight; a single call already passes eval |
| Routing | Distinct input categories are better handled separately AND classification is accurate; cheap model for easy cases, expensive for hard | Categories blur into each other (misroutes degrade everything downstream); one prompt handles all cases without loss |
| Parallelisation: sectioning | Independent subtasks can run concurrently for wall-clock speed; separate guardrail/moderation call alongside the main call | Subtasks depend on each other's output (that is chaining) |
| Parallelisation: voting | Multiple perspectives raise confidence; you can tolerate N times the cost per item; false negatives are expensive (security review, content safety) | Cost sensitive, or there is a single objectively correct answer that one call already gets right |
| Orchestrator-workers | You cannot predict the subtasks; decomposition depends on the input itself; e.g. changes spanning an unknown set of files | The set of subtasks is fixed and known (use sectioning, which is cheaper and has no planner hop) |
| Evaluator-optimizer | Clear articulable evaluation criteria exist AND iterative refinement measurably improves output; a human reviewer would give useful feedback on a first draft | Criteria are vague or subjective; the model cannot tell good from bad on this task; latency budget forbids multiple rounds |
| Autonomous agent | Open-ended problem, step count unpredictable, model must act on environment feedback in a loop | Path can be hardcoded; failures are costly and irreversible; you cannot sandbox or checkpoint |

Distinguishing orchestrator-workers from sectioning is a favourite exam trap. Sectioning: you decide the split in code. Orchestrator-workers: the model decides the split at runtime.

### Multi-agent (lead agent plus subagents)

The research-system post gives the numbers you should carry into the exam:

- Single agent uses about **4x** the tokens of a chat interaction.
- Multi-agent uses about **15x** the tokens of a chat interaction.
- Lead Opus + Sonnet subagents beat single-agent Opus by **90.2%** on an internal breadth-first research eval.
- Lead agent typically spawns **3 to 5** subagents in parallel.
- Subagents may burn tens of thousands of tokens each but return only a condensed **1,000 to 2,000 token** summary.

Multi-agent wins on breadth-first tasks with heavy parallelism where information exceeds one context window and the value per task is high. It loses on tasks needing shared context across agents, tight interdependencies, real-time coordination, and most coding work (fewer parallelisable components, agents cannot see each other's edits).

### Feedback loops, checkpoints, recovery

- Human checkpoints belong at **irreversible or high blast-radius** actions: money movement, production writes, external communications, permanent deletions. Not at every step, which destroys the efficiency case.
- Prefer **resumable checkpointing** over restart-from-scratch. Persist the plan to external memory so a truncated context window does not lose the task.
- Combine model adaptability with deterministic safeguards: retry logic, timeouts, circuit breakers, regular checkpoints. Telling the agent a tool is failing and letting it adapt works surprisingly well.
- **Rainbow deployments** shift traffic gradually so long-running agents are not killed mid-run by a deploy.
- Non-determinism makes debugging hard: instrument decision patterns and interaction structure, not just final outputs.
- Guardrail calls run in parallel with the main call (sectioning), not serially, when latency matters.

### Tying architecture to business value

| Business driver | Architectural lever |
|---|---|
| Latency SLA | Fewer sequential hops; parallelise; route easy traffic to a smaller model; avoid evaluator-optimizer loops |
| Unit cost | Workflow over agent; prompt caching; Batch API for async; smaller model for classification and routing |
| Reliability / auditability | Workflow with explicit gates; structured output; deterministic validation between steps |
| Time-to-value | Ship the augmented LLM baseline first, instrument it, then add complexity where eval shows a gap |
| Throughput on bulk backlog | Batch API at 50% discount, not more parallel real-time agents |

### Decision heuristics

- If the number of steps is knowable at design time, it is a workflow. If not, it is an agent.
- If subtasks are fixed, use sectioning. If the input determines the subtasks, use orchestrator-workers.
- If you can write the rubric, evaluator-optimizer is on the table. If you cannot, it is not.
- If the scenario says "strict p95 latency" plus "multi-step reasoning", route and parallelise; do not add refinement loops.
- If the scenario mentions cost blowout on an agent, first check for caching and model routing, then downgrade agent to workflow. Do not add more agents.
- If an action is irreversible, insert a human checkpoint or a deterministic validator before it, not after.
- If the task is breadth-first research over many independent sources, multi-agent is justified. If it is coding or anything with shared state, it is not.
- If a subagent's verbose output would pollute the main context, isolate it and return a summary.
- If the answer options include both "add an orchestrator" and "improve the single prompt plus retrieval", and eval evidence is absent, the simpler option is correct.

### Common distractors

- **Multi-agent for a coding task.** Real technique, wrong context: coding has few parallelisable components and agents cannot see each other's edits.
- **Evaluator-optimizer where success criteria are subjective.** The evaluator has no signal, so you pay 2-4x for noise.
- **Voting to reduce cost.** Voting multiplies cost. It buys confidence, not savings.
- **Autonomous agent because "the task is complex".** Complexity is not the trigger; unpredictable step count is.
- **Adding a human checkpoint at every step to improve reliability.** Kills the throughput case and does not fix systematic model error. Deterministic validators are usually the right answer for mechanical checks.
- **Routing when categories overlap.** A misroute sends the request down a specialised path that cannot recover.
- **Prompt chaining to reduce latency.** Chaining adds sequential hops and increases latency; it buys accuracy.
- **Restart the agent from scratch on failure.** Expensive and user-hostile. Checkpoint and resume.

### One-line recalls

1. Workflow = predefined code paths; agent = model directs its own process.
2. Augmented LLM (model + retrieval + tools + memory) is the baseline building block.
3. Six patterns: chaining, routing, parallelisation (sectioning, voting), orchestrator-workers, evaluator-optimizer, autonomous agents.
4. Agentic systems trade latency and cost for task performance.
5. Sectioning is code-decided; orchestrator-workers is model-decided.
6. Voting = same task N times for confidence; sectioning = different subtasks concurrently for speed.
7. Multi-agent ~15x chat tokens; single agent ~4x.
8. Lead agent spawns 3-5 subagents; each returns ~1-2k tokens of distilled findings.
9. Opus lead + Sonnet subagents outperformed single-agent Opus by 90.2% on internal research eval.
10. Multi-agent fails on shared-context, high-interdependency, real-time tasks.
11. Persist the plan to external memory: context beyond the window is truncated.
12. Rainbow deployments avoid disrupting in-flight agents.
13. Guardrails run parallel to the main call, not in series.
14. Only add complexity when simpler solutions demonstrably underperform on eval.
15. Document and test the agent-computer interface as carefully as a human UI.

---

## Domain 2: Claude Models, Prompting & Context Engineering (13%)

### What the exam is really testing

Matching a workload profile to a model tier and a set of levers, and knowing which lever is idle in a given scenario. Expect questions where prompt caching is offered but the prefix changes every request, or where Batch API is offered but the feature is user-facing. Context engineering questions test whether you know that more context is not better: attention is a finite budget with diminishing returns.

### Model tiers and selection

| Model | Context | Max output | Input / output per MTok | Positioning |
|---|---|---|---|---|
| Claude Fable 5 | 1M | 128k | $10 / $50 | Frontier; long-running agents, highest capability |
| Claude Opus 5 | 1M | 128k | $5 / $25 | Complex agentic coding and enterprise work; recommended default |
| Claude Sonnet 5 | 1M | 128k | $2 / $10 | Best speed-to-intelligence balance |
| Claude Haiku 4.5 | 200k | 64k | $1 / $5 | Fastest; latency-sensitive, high-volume, narrow tasks |

Routing rules that show up in scenarios: classification, routing, extraction, moderation and short summarisation go to Haiku; general build-and-ship work goes to Sonnet; deep multi-step reasoning, hard debugging, and lead-agent planning go to Opus. Sonnet 5 at $2/$10 is cheaper than Sonnet 4.6 at $3/$15, so "downgrade from Sonnet to Haiku for cost" is often a weaker answer than it looks once caching is applied.

Thinking configuration:

- **Adaptive thinking** (`thinking: {type: "adaptive"}`) is supported on Claude 4.6 and later, including Opus 5, Sonnet 5 and Fable 5. On 4.6 the older extended thinking still works but is deprecated; on 4.7+ it is rejected. Depth is controlled with `output_config.effort`, which has five levels: `low`, `medium`, `high`, `xhigh`, `max`. **`high` is the default**, and setting it explicitly is the same as omitting the parameter. `xhigh` is the recommended starting point for coding and agentic work on Opus 4.7/4.8; `max` is available on 4.6 and later. Interleaves automatically, no beta header. The model decides per request whether to think at all.
- **Extended thinking** (`type: "enabled"`, `budget_tokens`) is the only mode on 4.5 and earlier, deprecated on 4.6, and returns 400 on 4.7+. Minimum budget 1,024 tokens; must be below `max_tokens` except with interleaved thinking.
- Changing `budget_tokens` or `effort` between requests **invalidates the message cache**. Pick one and hold it.
- Manual extended thinking is incompatible with `tool_choice: any` and `tool_choice: tool`. Adaptive thinking supports forced tool use.
- Track spend via `usage.output_tokens_details.thinking_tokens`; thinking tokens bill as output.

### Prompting techniques

Apply in this order: clarity, examples (multishot), chain of thought, XML tags, system prompt / role, prefill, chaining, long-context handling.

| Technique | Use when | Do NOT use when |
|---|---|---|
| Zero-shot with explicit instructions | Task is common and well-specified | Output format is idiosyncratic |
| Few-shot / multishot | Format or edge-case handling is hard to describe but easy to show | Examples would bias toward one answer class, or eat cache-unfriendly space |
| Chain of thought | Multi-step reasoning, maths, analysis | Simple lookup or classification; it adds output tokens and latency for no gain |
| XML tags | Multiple content types in one prompt (docs, instructions, examples) | Trivially short prompts |
| System prompt / role | Persistent persona, domain framing, tone, tool guidance | Per-request instructions (those belong in the user turn, after the cache breakpoint) |
| Prefill assistant turn | Force a format, skip preamble, sustain a persona | Using structured outputs (prefill is incompatible) or extended thinking |
| Structured outputs (`output_config.format` json_schema) | You need machine-parseable output with near-zero schema violations | You need citations, or prefill, or unsupported schema keywords: `minimum`/`maximum`, `minLength`/`maxLength`, `minItems`/`maxItems`, `minProperties`/`maxProperties`. Note `pattern` (regex) IS supported |
| Strict tool use (`strict: true`) | Tool inputs must validate exactly | More than 20 strict tools, >24 optional params, >16 union params |
| `tool_choice: any` / `tool` | You must guarantee a tool call | You want narrative text first: forced modes prefill the assistant turn and suppress leading prose |

Structured outputs are grammar-constrained sampling, so they are strictly stronger than "ask nicely for JSON" or prefilling `{`. Schema changes invalidate the 24-hour grammar cache and add first-request latency.

### Context engineering

Prompt engineering is writing the instruction. Context engineering is curating the whole token set at every inference step. The governing constraint is **context rot**: recall accuracy degrades as token count grows, because transformer attention spreads across n-squared pairwise relationships. Treat context as a finite resource with diminishing returns and aim for the smallest set of high-signal tokens.

Techniques, in the order a scenario usually needs them:

1. **Retrieval over stuffing.** Just-in-time retrieval keeps lightweight identifiers (file paths, queries, links) in context and loads content at runtime. Slower per hop than pre-computed retrieval, but cheaper and higher-signal. Hybrid is often right: pre-load the obvious core, let the agent explore for the rest.
2. **Compaction.** Summarise and reinitialise when approaching the limit. The skill is choosing what to discard; over-aggressive compaction loses subtle but load-bearing detail. Tune for recall first, then precision.
3. **Structured note-taking / external memory.** Persistent notes outside the window. Cheapest way to survive long-horizon tasks across dozens of tool calls.
4. **Sub-agent context isolation.** Subagent explores in its own window and returns a 1-2k token distillation. Detailed search context stays isolated; the lead agent synthesises.
5. **Skills and progressive disclosure.** Three levels: metadata (name + description) always in the system prompt at roughly 100 tokens per skill; SKILL.md body loaded on trigger, under 5k tokens; bundled files and scripts loaded only when read or executed, zero cost until then. Script code never enters context, only its output. This is why a skill can bundle enormous reference material for free.
6. **Tool curation.** Bloated overlapping tool sets create ambiguous decision points. Tools should be self-contained, error-robust, and unambiguous about intended use.

Use a **Skill** for packaged static expertise in one agent's context, a **subagent** for independent orchestration with its own reasoning loop, and an **MCP server** for live external systems and network access.

### Prompt caching

- Order is fixed and hierarchical: **tools, then system, then messages**. Cache the static prefix; put volatile content after the breakpoint.
- Up to **4 breakpoints** per request; the system looks back at most **20 block positions** from a breakpoint for a match.
- Minimums: **512 tokens** for Opus 5 / Fable 5 / Mythos 5; **1,024** for Opus 4.8, Sonnet 5, Sonnet 4.6, Sonnet 4.5, Opus 4.1, Opus 4; **2,048** for Opus 4.7, Mythos Preview and Haiku 3.5; **4,096** for Opus 4.6, Opus 4.5 and Haiku 4.5. Below the minimum, caching is silently skipped with no error. Do not memorise this as three buckets: there are four, and Opus 4.7 sits in the one people forget.
- TTL: 5 minutes default at **1.25x** write cost, 1 hour at **2x**. Reads are **0.1x** in both cases. TTL is measured from the start of the request that writes or reads, not from completion.
- Break-even: one read pays back the 5-minute write, two reads pay back the 1-hour write.
- Invalidated by: any tool definition change, web search or citations toggle, speed setting, `tool_choice` change, adding or removing images, thinking or effort config change. Adding a new tool result does not invalidate.
- Verify with `cache_read_input_tokens` and `cache_creation_input_tokens` in usage. Both zero means you fell under the minimum.
- Concurrency trap: a cache entry only exists after the first response begins, so firing N parallel requests against a cold prefix writes N times.

### Other cost levers

- **Batch API**: 50% off input and output, most batches finish within 1 hour, 24-hour ceiling, up to 100,000 requests or 256MB per batch, results retained 29 days. Supports vision, tools, system prompts, extended thinking and prompt caching. Does not support streaming, fast/speed mode, or cache pre-warming with `max_tokens: 0`. Wrong answer for anything user-facing or interactive.
- **Long context is not surcharged** on 4.6+ models: a 900k-token request bills at the same per-token rate as a 9k one. Cost control there is about attention quality and caching, not tier pricing.
- Model routing, caching, and batching stack. Applying all three to a bulk classification pipeline is usually the intended "select TWO/THREE" answer.

### Decision heuristics

- If the same large prefix repeats across requests, cache it and move volatile content after the breakpoint.
- If the prefix changes every call (timestamps, per-user data at the top), caching pays nothing. Reorder first, then cache.
- If the prompt is under the model minimum, do not bother caching.
- If requests are async and not user-facing, batch them before you consider downgrading the model.
- If the task is classification, extraction, routing or moderation at volume, use Haiku.
- If the agent is planning and decomposing, use Opus as lead and a cheaper tier for workers.
- If output must be machine-parsed, use structured outputs, not "please respond in JSON".
- If a tool call must happen every time, use `tool_choice: any` plus `strict: true`, and accept that no prose precedes it.
- If context is filling on a long task, choose in this order: retrieve instead of stuff, isolate in subagents, take notes externally, compact last.
- If a scenario mentions degraded recall over a long session, the answer is context rot, not model capability.

### Common distractors

- **Cache the whole request including the user message.** Guarantees a miss every turn.
- **Put the changing instruction in the system prompt.** System sits before messages in the cache order, so it invalidates everything after it.
- **Use the 1-hour TTL for a single follow-up.** 2x write for one read is a loss.
- **Batch API for a chat feature.** Latency SLA rules it out; batches take up to 24 hours.
- **Stuff the whole knowledge base into the 1M window because there is no long-context premium.** Price is fine, attention is not: context rot degrades recall.
- **Chain of thought on a classification task.** Adds output tokens and latency, no accuracy gain.
- **Prefill to force JSON when structured outputs are available.** Prefill is incompatible with structured outputs and gives weaker guarantees.
- **`budget_tokens` on a Claude 5 model.** 400 error; use adaptive thinking with effort.
- **Raise `budget_tokens`/effort mid-conversation to improve quality.** Invalidates the message cache for every following turn.
- **Add an MCP server to give the agent a documented workflow.** That is a Skill. MCP is for external systems and network access.

### One-line recalls

1. Cache order: tools, then system, then messages. Static first, always.
2. Max 4 cache breakpoints; 20-block lookback window.
3. Cache minimums: 512 (Opus 5 / Fable 5), 1,024 (Sonnet 5, Opus 4.8, Sonnet 4.6/4.5), 2,048 (Opus 4.7), 4,096 (Opus 4.6/4.5, Haiku 4.5).
4. 5m write 1.25x, 1h write 2x, reads 0.1x. TTL counts from request start.
5. Batch API: 50% off, most under 1 hour, 24h max, 100k requests or 256MB, results kept 29 days, no streaming.
6. Sonnet 5 is $2/$10, Opus 5 $5/$25, Haiku 4.5 $1/$5, Fable 5 $10/$50.
7. 1M context on 4.6+ has no long-context price premium.
8. Adaptive thinking from 4.6 onward (4.6 supports both modes); extended thinking with budget_tokens is 400 on 4.7+.
9. Effort levels: low, medium, high, xhigh, max. Default is high, not medium.
10. Manual extended thinking blocks `tool_choice: any` and `tool`; adaptive does not.
11. Skill levels: ~100 tokens metadata, <5k body, bundled files free until read.
12. Subagents return roughly 1-2k tokens after spending tens of thousands.
13. Context rot: recall degrades as context grows; attention is a finite budget.
14. Structured outputs use grammar-constrained sampling; incompatible with prefill and citations; `pattern` is supported, but min/max keywords are not.
15. Strict tools cap: 20 strict tools, 24 optional params, 16 union params.
16. Claude 4.7+ models use a newer tokenizer that produces roughly 30% more tokens for the same text. Any cost comparison across model generations has to account for this, not just the per-token price.

---

## Domain 7: Developer Productivity & Operational Enablement (7%)

### What the exam is really testing

Whether you know which mechanism enforces and which merely suggests. CLAUDE.md is context, so it shapes behaviour without guaranteeing it. Hooks and permissions are enforcement. Roughly half the wrong answers in this domain are "put it in CLAUDE.md" for something that must happen deterministically, or "write a hook" for something that is just guidance.

### CLAUDE.md hierarchy

Loaded broadest to most specific, all concatenated rather than overriding:

| Scope | Location |
|---|---|
| Managed policy | macOS `/Library/Application Support/ClaudeCode/CLAUDE.md`; Linux/WSL `/etc/claude-code/CLAUDE.md`; Windows `C:\Program Files\ClaudeCode\CLAUDE.md` |
| User | `~/.claude/CLAUDE.md` |
| Project | `./CLAUDE.md` or `./.claude/CLAUDE.md` |
| Local | `./CLAUDE.local.md` (gitignore it) |

Claude walks up the directory tree from cwd, loading every CLAUDE.md and CLAUDE.local.md, ordered root-down so the file closest to cwd is read last. Subdirectory CLAUDE.md files load on demand when Claude reads files there. `@path` imports expand at launch, relative to the importing file, max depth 4 hops; imports inside backticks or code fences are not followed. Managed policy CLAUDE.md cannot be excluded; everything else can be filtered with `claudeMdExcludes` globs. `claudeMd` inside `managed-settings.json` is an alternative to shipping the file.

Practical rules: keep each file under 200 lines, be concrete ("use 2-space indentation", not "format properly"), remove contradictions since Claude may pick arbitrarily between conflicting rules. Use `.claude/rules/*.md` with `paths:` frontmatter for anything that only matters for part of the tree, so it loads only when matching files are touched. Project-root CLAUDE.md is re-injected after `/compact`; nested and path-scoped rules are not.

### Settings and permissions precedence

Highest to lowest: **managed settings, command-line args, `.claude/settings.local.json`, `.claude/settings.json`, `~/.claude/settings.json`**. Note that managed policy outranks CLI flags, which is the inverse of the usual intuition and a likely exam item.

- `permissions.allow` / `ask` / `deny` with rule syntax like `Bash(npm run test *)`, `Read(./.env)`. The space before `*` matters: `Bash(git diff *)` prefix-matches, `Bash(git diff*)` also catches `git diff-index`.
- `allowManagedPermissionRulesOnly` (managed only) stops user and project settings defining any rules.
- `allowedMcpServers` / `deniedMcpServers` for org-level MCP control.
- Enforcement belongs in settings; behavioural guidance belongs in CLAUDE.md.

### Extension mechanisms

| Mechanism | Scope | Use for | Enforces? |
|---|---|---|---|
| CLAUDE.md / rules | Always in context (rules can be path-scoped) | Standing conventions, architecture, build commands | No |
| Skill (`SKILL.md`) | Loads on trigger | Repeatable multi-step workflows, packaged expertise | No |
| Subagent (`.claude/agents/*.md`) | Isolated fresh context | Verbose or self-contained work returning a summary; tool restriction by role | Tool allowlist yes |
| Hook | Fires at lifecycle events | Anything that must happen every time regardless of model choice | Yes |
| MCP server | Tool surface | External systems, live data, APIs | No |
| Plugin | Bundle of all the above | Team and org distribution with versioning | Via bundled settings/hooks |

Subagent precedence: managed settings, `--agents` flag, `.claude/agents/`, `~/.claude/agents/`, plugin `agents/`. Frontmatter worth knowing: `name`, `description` (drives auto-delegation, add "use proactively"), `tools` / `disallowedTools`, `model` (including `inherit`), `permissionMode`, `maxTurns`, `memory`, `skills`, `isolation: worktree`, `effort`. A subagent starts fresh: it gets CLAUDE.md and a git status snapshot but **not** conversation history, output style, or the main thread's auto memory. A **fork** (`/subtask`) is the exception, inheriting the full conversation and sharing the parent's prompt cache.

Hooks worth memorising: `PreToolUse` (can block), `PostToolUse`, `UserPromptSubmit` (can block), `SessionStart` / `SessionEnd`, `SubagentStart` / `SubagentStop`, `PreCompact` / `PostCompact`, `PermissionRequest`, `InstructionsLoaded` (debug which instruction files loaded), `ConfigChange`. Exit code 0 succeeds, exit code **2 blocks** and beats a JSON `permissionDecision: "allow"`, other codes are non-blocking unless JSON says otherwise. JSON control lives under `hookSpecificOutput` with `permissionDecision` of allow / deny / ask.

MCP scopes: `local` (default, this project only, stored in `~/.claude.json`), `project` (`.mcp.json`, committed, shared with the team), `user` (all your projects). Precedence: local, project, user, plugin, claude.ai connectors. Project servers prompt for approval interactively, but `claude -p`, Agent SDK and cloud sessions load them without asking, so use `disabledMcpjsonServers` or `--setting-sources` to keep one out.

### Headless and CI/CD

- `claude -p "prompt"` for non-interactive runs. Exit 0 on success, non-zero on failure.
- `--output-format text | json | stream-json`. `json` includes `total_cost_usd` and per-model cost (client-side estimates). Add `--json-schema` for a validated `structured_output` field.
- `--bare` skips auto-discovery of hooks, skills, plugins, MCP servers, auto memory and CLAUDE.md. This is the recommended mode for CI and scripts because it gives the same result on every machine, and it is slated to become the `-p` default. Without it, a `-p` run in an untrusted folder still executes the repo's hooks and connects its `.mcp.json` servers, since there is no trust dialog. Bare mode needs `ANTHROPIC_API_KEY`, not subscription login.
- Permission control: `--allowedTools "Bash,Read,Edit"`, or `--permission-mode dontAsk` for locked-down CI (denies anything not explicitly allowed or read-only), or `acceptEdits` for lint-fix style jobs.
- `--append-system-prompt` for per-run role framing; `--continue` / `--resume <session_id>` for multi-step pipelines.
- CI gating: check `plugin_errors` and `mcp_server_errors` in the `system/init` event to fail the build when a plugin or server did not load.
- Piped stdin caps at 10MB; write larger inputs to a file and reference the path.

### Rollout and operational readiness

Standardise in this order: commit a project CLAUDE.md (`/init` bootstraps it, `/doctor` proposes trims), add `.claude/settings.json` with a shared allow/deny baseline, add `.claude/agents/` for reviewer and explorer roles, add hooks for the non-negotiables (format on write, block secret reads, run lint), then package the lot as a plugin with a private marketplace once more than one repo needs it. Managed settings plus a managed CLAUDE.md handle the org-wide floor that individuals cannot override.

For reproducibility and audit: `--bare` in CI, `/context` to verify what loaded, `/status` to see setting sources, `InstructionsLoaded` hooks to log instruction provenance, `--output-format json` to capture cost and session IDs per run, and `CLAUDE_CODE_ENABLE_TELEMETRY` for fleet metrics. Auto memory is machine-local and not shared across machines, so never treat it as a team artefact.

### Decision heuristics

- If it must happen every time regardless of what Claude decides, use a hook or a permission rule. Never CLAUDE.md.
- If it is guidance the model should weigh, use CLAUDE.md or a rule.
- If it only matters for part of the tree, use `.claude/rules/` with `paths:` frontmatter.
- If it is a multi-step procedure invoked occasionally, use a Skill so it stays out of context until needed.
- If output would be verbose and you only need the conclusion, use a subagent.
- If you need the current conversation's context in a side task, use a fork, not a fresh subagent.
- If the org must not be able to opt out, use managed settings and managed CLAUDE.md.
- If the run is in CI, add `--bare` and an explicit tool allowlist.
- If a team member's local config could change CI results, that is the argument for `--bare`.
- If two repos need the same setup, promote `.claude/` config into a plugin.

### Common distractors

- **Put the security policy in the project CLAUDE.md.** Committed CLAUDE.md is advisory and any contributor can edit it. Use managed settings `permissions.deny`.
- **Use a PostToolUse hook to prevent a dangerous command.** Too late; PostToolUse cannot block. Use PreToolUse.
- **Rely on `.claude/settings.local.json` for team standards.** It is gitignored and personal.
- **Give every engineer their own subagent definitions in `~/.claude/agents/`.** Not shared and not reviewable. Use `.claude/agents/` in the repo.
- **Assume CLI flags beat managed settings.** Managed settings sit above CLI args.
- **Import a large doc into CLAUDE.md for organisation.** Imports still load fully at launch and cost the same context. Path-scoped rules or Skills reduce context; imports do not.
- **Expect a subagent to know what the main thread just discussed.** It does not, unless it is a fork.
- **Run `claude -p` in CI without `--bare` and expect reproducibility.** It picks up repo hooks, `.mcp.json` and the runner's `~/.claude`.
- **Use auto memory as the team knowledge base.** Machine-local, Claude-authored, not versioned.

### One-line recalls

1. Settings precedence: managed, CLI args, local, project, user.
2. CLAUDE.md load order: managed policy, user, project, local; all concatenated, closest to cwd read last.
3. Managed policy CLAUDE.md cannot be excluded; `claudeMdExcludes` handles the rest.
4. `@path` imports expand at launch, max 4 hops, skipped inside code spans.
5. Target under 200 lines per CLAUDE.md; longer files reduce adherence.
6. `.claude/rules/*.md` with `paths:` frontmatter loads only for matching files.
7. Project-root CLAUDE.md survives `/compact`; nested and path-scoped rules do not.
8. Hook exit 2 blocks and overrides a JSON allow; exit 0 is success.
9. PreToolUse, UserPromptSubmit, Stop, SubagentStop and PreCompact can block; PostToolUse cannot.
10. Subagent precedence: managed, `--agents`, project, user, plugin.
11. Subagents get CLAUDE.md and git status but not conversation history or parent auto memory; forks get everything.
12. MCP scopes: local (default), project (`.mcp.json`, shared), user; precedence local > project > user > plugin > connector.
13. `-p` and SDK sessions load project MCP servers without an approval prompt.
14. `--bare` skips hooks, skills, plugins, MCP, auto memory and CLAUDE.md; recommended for CI.
15. `--output-format json` gives `total_cost_usd` and `session_id`; `--json-schema` adds `structured_output`.
16. Plugin skills are namespaced `/plugin-name:skill-name`; project and user agents override same-named plugin agents.
