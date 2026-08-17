# CCAR-P Revision Notes: Integration + Evaluation, Testing & Optimization

Domain 3 (Integration, 19%) and Domain 4 (Evaluation, Testing & Optimization, 16%). Together about 35% of a 63-question paper, so roughly 22 questions, of which 5-6 will be multiple-response.

**Sourcing note.** Checked against platform.claude.com, code.claude.com, modelcontextprotocol.io (spec revision `2026-07-28`) and anthropic.com/engineering. Where third-party exam guides still describe the older MCP model (an `initialize` handshake, connection-scoped sessions, `sampling/createMessage` as a live client primitive, Dynamic Client Registration as the recommended path), they are behind the spec. Trust the spec. Those deltas are flagged in 3.2 and 3.5 because stale distractors are built from exactly them.

---

## Domain 3: Integration (19%)

**What the exam is really testing.** Not "name the MCP primitives" but "given this constraint, which coupling mechanism is correct, and what breaks if you pick wrong". Almost every scenario hands you a constraint that eliminates three of four options: the tool is stateful, the data changes hourly, there are 400 tools, a third party owns the API, the corpus is 80k tokens. Find the constraint, then pick. The second recurring theme is blast radius: who holds the token, what the tool can destroy, what happens when a tool result contains attacker-controlled text.

### 3.1 Choosing the integration mechanism

| Mechanism | Use when | Do not use when |
|---|---|---|
| Direct API/SDK tool use | You own both ends, small stable tool set, tight control over schemas and latency | The same tools must be reusable across many hosts, or a third party supplies the capability |
| MCP server, local (stdio) | Needs filesystem/process access on the user's machine, or data must not leave the device | Many clients need it concurrently, or it must be centrally patched |
| MCP server, remote (Streamable HTTP) | Many hosts share one capability; you need central auth, audit, versioning | Data is local-only, or the latency budget cannot absorb a network hop per call |
| MCP connector on the Messages API | You want a remote MCP server attached to API calls without writing an MCP client | You need MCP prompts or resources (connector is tools-only), or the server is stdio |
| Agent-to-agent / subagent delegation | The remote unit is opaque, reasons over multiple steps, has its own context window, returns a condensed result | The remote unit is a plain schema-shaped function call |
| Plain RAG (retrieve then answer) | Read-only grounded QA over a corpus, citations required, no actions | The task requires acting, the corpus fits in context, or freshness is per-second |

Anti-patterns to recognise on sight:
- Wrapping every REST endpoint as a tool. Anthropic's guidance is explicit: build for high-impact workflows, not API parity. One `schedule_event` beats `list_users` + `list_events` + `create_event`.
- Using MCP as an inter-service RPC layer between backends you own. It is a context protocol for model-facing capability, not a service mesh.
- Using an agent where a workflow suffices. Workflows orchestrate LLMs through predefined code paths; agents let the model direct its own process. Agents cost more, need sandboxing, compound errors. Order of preference: single call, workflow, agent.
- Standing up a vector DB for a corpus under ~200k tokens. Inline it and use prompt caching.

### 3.2 MCP in depth

**Participants.** The host (AI application) creates one **client** per **server**, each holding a dedicated connection. "Local" and "remote" describe where the server runs, not different protocols. Local stdio servers typically serve one client; remote HTTP servers serve many.

**Layers.** Data layer = JSON-RPC 2.0 messages, capabilities, primitives, notifications. Transport layer = framing, connection, authorization.

| Transport | Shape | Notes |
|---|---|---|
| stdio | Newline-delimited JSON-RPC over a client-launched subprocess | Credentials come from the environment, not OAuth. One-click install MUST show the exact command and get explicit consent |
| Streamable HTTP | Each message is an HTTP POST to one MCP endpoint; reply is JSON or a request-scoped SSE stream | Bearer token on every request. Never put tokens in the query string |

**Primitives.** Server-side: **tools** (model-controlled), **resources** (application-controlled, read-only, URI-addressed, direct or templated), **prompts** (user-controlled templates, surfaced as slash commands). Client-side: **elicitation** (`elicitation/create`) for asking the user for input or confirmation mid-call. Methods: `*/list`, `*/get`, `tools/call`, `resources/read`.

**Spec deltas that make good distractors.**
- **Sampling, Roots and Logging are all deprecated** as of `2026-07-28`, along with the legacy HTTP+SSE transport, with a twelve-month minimum deprecation window. "Use MCP sampling so the server stays model-agnostic" is now the stale-but-plausible answer; integrate with the provider directly. Elicitation is the surviving client-facing feature.
- **Logging (the server-to-client utility) is deprecated.** Log to stderr on stdio, or use OpenTelemetry.
- **MCP is stateless.** No `initialize`, no protocol-level session. Every request carries protocol version and client capabilities in `_meta`. Servers advertise through `server/discover`. The caching hints `ttlMs` and `cacheScope` are documented on the list responses (`tools/list`, `prompts/list`, `resources/list`), not on `server/discover` itself.
- **Server state uses explicit handles** returned from a creation tool and passed back as an ordinary argument. A handle is a name, not a capability: bind it server-side to the authenticated user and validate every call.
- **Change notifications are opt-in.** The client opens `subscriptions/listen` naming the types it wants; the server then sends `notifications/tools/list_changed`. Best-effort, so still poll.
- **Tasks extension** returns a durable handle for long-running requests instead of holding a connection open.

**Connectors** in the Claude apps are packaged remote MCP servers for end users. The **MCP connector** on the Messages API is the API equivalent: `mcp_servers` gives url/name/`authorization_token`, and an `mcp_toolset` entry in `tools` enables or disables individual tools (`default_config` plus per-tool `configs`) so you can allowlist or denylist without touching the server. Tools only, HTTPS only, no stdio.

### 3.3 Tool design Claude can use reliably

- **Description quality matters more than anything else you control.** Write it as you would for a new engineer: what it does, when to use it and when not to, resource relationships, niche query syntax. Anthropic attributes Sonnet 3.5's SWE-bench Verified result largely to refined tool descriptions.
- **Name parameters unambiguously**: `user_id`, not `user`. Tool names: 1-128 chars, `[A-Za-z0-9_.-]`, case-sensitive, unique per server.
- **Namespace by service and resource**: `asana_projects_search`, `jira_search`. Prefix vs suffix conventions measurably change accuracy, so evaluate rather than assume. Aggregating proxies must disambiguate collisions themselves; `serverInfo.name` is not guaranteed unique.
- **Return semantically meaningful output.** Resolve UUIDs to names; Anthropic reports this reduces hallucination in retrieval tasks. Offer a `response_format` enum (`concise`/`detailed`) so the model requests IDs only when it needs them downstream. Their Slack example: 206 tokens detailed vs 72 concise.
- **Bound response size.** Pagination with sane defaults, filters, range selection, and truncation that tells the model what to do instead ("narrow your search"). Claude Code's default tool-response ceiling is 25,000 tokens.
- **Errors are prompts.** Two channels: JSON-RPC protocol errors (unknown tool, malformed request) which the model usually cannot fix, and tool execution errors returned as a normal result with `isError: true`. Put actionable text in the second: "Invalid departure date: must be in the future. Current date is 08/08/2025." Clients SHOULD feed execution errors back to the model for self-correction.
- **Idempotency.** Annotations (`readOnlyHint`, `destructiveHint`, `idempotentHint`, `openWorldHint`) are hints for UI and policy, and clients MUST treat them as untrusted from untrusted servers. Real idempotency comes from server-side keys.
- **`outputSchema` + `structuredContent`** when the result feeds code or another tool; required for typed stubs in programmatic tool calling.
- **Deterministic `tools/list` ordering** so clients can cache and provider prompt caches hit.

### 3.4 Capability bloat

Symptoms: selection accuracy degrades past roughly 30-50 tools; a five-server setup (GitHub, Slack, Sentry, Grafana, Splunk) burns ~55k tokens on definitions before reading the user's message; naive multi-server hosts can spend ~150k tokens on definitions alone.

| Technique | Mechanism | Reach for it when |
|---|---|---|
| Consolidation | Collapse chatty endpoints into workflow-shaped tools | Always, first, at design time |
| Split servers by domain | One server per bounded domain, connect only what the task needs | Ownership or permissions differ per domain |
| Tool search tool (Anthropic API) | Mark tools `defer_loading: true`, add `tool_search_tool_regex_20251119` or `..._bm25_20251119`; the API expands matches into `tool_reference` blocks inline | 10+ tools, definitions over ~10k tokens, or 200+ aggregated tools. Reported >85% context reduction. Cap 10,000 deferred tools, at least one must stay non-deferred, keep the 3-5 hottest loaded |
| Progressive discovery (MCP client pattern) | Three layers: `search_tools` catalog, `get_tool_details` inspect, execute. Strategies: keyword/BM25, embedding, subagent (Haiku-class), hybrid | Build your own only when the provider has no native tool search or you need access-control-aware ranking. Switch on at 1-5% of context window spent on definitions |
| Dynamic server management | Connect/disconnect whole servers at runtime from a registry | General-purpose agents where intent is unknown upfront; pairs with skills declaring required servers |
| Programmatic tool calling (code mode) | Model writes code against generated typed stubs; sandbox executes; only console output returns | Chained calls with large intermediates. Illustrative: ~100k tokens direct vs a ~200-token script plus ~15-token summary |

**Caching interaction, a favourite trap.** Providers cache the prompt prefix including the `tools` array. Adding or removing definitions mid-conversation invalidates it, and the miss can cost more than the definitions you saved. Mitigations: append discovered definitions after the cache breakpoint, or route everything through a stable `call_tool({name, args})` meta-tool, and treat server disconnection as a conversation boundary. On the Anthropic API, `defer_loading: true` plus `cache_control` on the same tool is a 400.

### 3.5 Security and authentication

**OAuth 2.1 for remote MCP servers.** The MCP server is the OAuth **resource server**, the MCP client is the OAuth client, the authorization server is separate. Chain: unauthenticated request, `401` with `WWW-Authenticate` carrying `resource_metadata` and a `scope` hint, client fetches Protected Resource Metadata (RFC 9728, MUST be implemented), discovers the AS (RFC 8414 or OIDC Discovery), obtains a client ID, runs authorization code + PKCE with a `resource` parameter (RFC 8707) naming the canonical server URI, validates `iss` on the response (RFC 9207), exchanges, then sends `Authorization: Bearer` on **every** request.

Rules worth memorising verbatim:
- Servers **MUST** validate that the token's audience is themselves, and **MUST NOT** accept or transit tokens issued for anything else. Clients **MUST NOT** send a token to a server other than the one its AS issued it for.
- **Token passthrough is the named anti-pattern**: accepting a client token and forwarding it unmodified downstream. Breaks rate limiting, audit trails and trust boundaries, and creates the confused deputy.
- Tokens **MUST NOT** appear in URI query strings.
- **Client ID Metadata Documents** are the preferred registration path; **Dynamic Client Registration is deprecated**, retained only for backwards compatibility.
- stdio servers **SHOULD NOT** use this flow; take credentials from the environment.
- `401` = unauthenticated or invalid token, `403` = insufficient scope (with `error="insufficient_scope"` and the needed `scope`), `400` = malformed request.

**Confused deputy.** Conditions: an MCP proxy uses a **static client ID** with a third-party AS, lets MCP clients register dynamically, the third-party AS sets a consent cookie, and the proxy does no per-client consent. Attacker registers a client with `redirect_uri: attacker.com`; the victim's cookie skips the third-party consent screen; the auth code lands at the attacker. Mitigation: per-user, per-`client_id` consent checked **before** forwarding; exact-string `redirect_uri` matching, no wildcards; single-use `state` stored only **after** consent approval; `__Host-` prefixed, `Secure`, `HttpOnly`, `SameSite=Lax` cookies.

**Other named risks.** SSRF via attacker-controlled OAuth discovery URLs (block private and link-local ranges including `169.254.169.254`, enforce HTTPS, validate each redirect hop, use an egress proxy). Mix-up attacks (PKCE does not stop these; `iss` validation does). State handle hijacking (bind handles to the authenticated principal, high-entropy opaque IDs, expiry). Local server compromise (sandbox, least privilege, show the exact startup command). Malicious authorization URLs (allowlist `https:`, reject `javascript:`/`data:`/`file:`, never open a URL through a shell).

**Prompt injection in tool-calling systems.** Treat every tool result as untrusted input, including results flowing from one server into another. Defences that appear as correct answers: human-in-the-loop confirmation for sensitive or destructive calls, showing tool inputs before execution, allowlisting tools per agent role, least-privilege OAuth scopes, sandboxing with no direct network egress, output validation and truncation, and per-call authorization even for calls originating inside an approved script. Approving a script is not blanket approval for every call it makes.

**Least privilege on scopes.** `scopes_supported` should be the minimal set for basic function, with incremental escalation through `WWW-Authenticate` challenges. Wildcard or omnibus scopes (`*`, `full-access`) are a listed common mistake. Clients accumulate scopes by union when re-authorizing.

### 3.6 RAG pipeline design

Baseline: chunk (a few hundred tokens), embed, retrieve top-K, rerank, generate with citations.

**Contextual retrieval**, Anthropic's measurements at top-20, baseline failure rate 5.7%:

| Configuration | Failure rate | Reduction |
|---|---|---|
| Embeddings + BM25 baseline | 5.7% | - |
| Contextual embeddings | 3.7% | 35% |
| Contextual embeddings + contextual BM25 | 2.9% | 49% |
| Plus reranking | 1.9% | 67% |

Mechanics: prepend 50-100 tokens of chunk-specific context (generated by a cheap model that saw the whole document) before both embedding and BM25 indexing. One-time cost about $1.02 per million document tokens with prompt caching on the source. Retrieve top-150, rerank down to 20; top-20 beat top-10 and top-5 in their tests, subject to your context budget. Hybrid matters because embeddings capture semantics while BM25 captures exact lexical matches (error codes, SKUs, identifiers).

**When not to build RAG at all:**
- Corpus under ~200k tokens: inline it with prompt caching. Faster, cheaper, no retrieval failure mode. This is the cache-augmented approach.
- A handful of navigable files: give the agent search/read tools and let it retrieve just-in-time. Anthropic's context-engineering guidance favours just-in-time retrieval for many agent workloads, with a hybrid (small core upfront, runtime exploration) as the pragmatic middle.
- Answers must reflect the live system of record: call the API, do not index a stale copy.

**Evaluate retrieval separately from generation.** Measure recall@k and retrieval failure rate against a labelled query-to-chunk set, independent of the final answer. High recall plus wrong answers means the problem is the prompt or the model, not the index.

### 3.7 Observability across multi-step systems

Model the run as a trace: one span per agent turn, child spans per model request and per tool call. The Claude Agent SDK emits exactly that: `claude_code.interaction` (one turn), `claude_code.llm_request` (model, latency, token counts), `claude_code.tool` with children `claude_code.tool.blocked_on_user` and `claude_code.tool.execution`, and `claude_code.hook`. Subagent spans nest under the parent's tool span, so a delegation chain reads as one trace.

- Three independent signals, separate switches: metrics (`OTEL_METRICS_EXPORTER`), log events (`OTEL_LOGS_EXPORTER`), traces (`OTEL_TRACES_EXPORTER`, beta, needs `CLAUDE_CODE_ENHANCED_TELEMETRY_BETA=1`). Master switch `CLAUDE_CODE_ENABLE_TELEMETRY=1`.
- Telemetry is **structural by default**: durations, model names, tool names, token counts. Prompt and tool content is opt-in (`OTEL_LOG_USER_PROMPTS`, `OTEL_LOG_TOOL_DETAILS`, `OTEL_LOG_TOOL_CONTENT`, `OTEL_LOG_RAW_API_BODIES`). Leave them off unless the pipeline is cleared for that data. This is the answer to "traces without exporting customer PII".
- W3C trace context propagates automatically, so the agent run nests inside your application's trace.
- Cost and token attribution: stitch calls with `session.id`; add `enduser.id` and `tenant.id` as resource attributes for per-tenant cost and a per-user audit trail from `tool_decision`, `tool_result`, `mcp_server_connection` and `permission_mode_changed` events into a SIEM.
- Short-lived processes drop batched telemetry. Lower `OTEL_*_EXPORT_INTERVAL` (metrics default 60s, traces/logs 5s). Never use the `console` exporter under the SDK; it collides with the message channel.
- For replay and debugging, keep raw transcripts of tool calls and results, not just final answers. Anthropic's own tool-improvement loop reads raw transcripts, and what the agent omits from its feedback is often more informative than what it says.

### Decision heuristics (Domain 3)

- Capability must touch the user's machine, then stdio MCP server. Many users share it, then remote MCP over Streamable HTTP.
- You need MCP resources or prompts, then you need a real MCP client. The Messages API connector is tools-only.
- Corpus under ~200k tokens and reasonably static, then long context plus prompt caching, not RAG.
- Retrieval misses exact identifiers, then add BM25 (hybrid), not a bigger embedding model.
- Retrieval recall is fine but answers are wrong, then fix generation, not the index.
- Tool definitions exceed roughly 1-5% of the context window, or you cross ~30-50 tools, then defer loading and add tool search.
- Task chains tools with large intermediates, then programmatic tool calling in a sandbox.
- An MCP server proxies a third-party API with a static client ID, then per-client consent stored server-side is mandatory.
- A token was not issued for this server, then reject it. Never forward it.
- A tool result feeds another tool, then treat it as untrusted user input.
- The model calls a tool with bad arguments repeatedly, then fix the description and the error message before the system prompt.
- The model needs a confirmation or a missing value mid-call, then elicitation, not a guess and not a new tool.

### Common distractors (Domain 3)

- **"Use MCP sampling so the server stays model-agnostic."** Deprecated in `2026-07-28`.
- **"Register the client dynamically (RFC 7591)."** Deprecated in favour of Client ID Metadata Documents.
- **"Validate the token's signature."** Necessary but insufficient; the named requirement is **audience** validation.
- **"Add PKCE to prevent mix-up attacks."** PKCE protects the code, not the AS identity. Issuer validation is the stated mitigation.
- **"Expose all endpoints as tools for full capability."** Directly contradicted; consolidate around workflows.
- **"Increase top-K to fix retrieval."** Wrong when the failure is lexical or the chunks are context-poor.
- **"Chunk smaller to improve recall."** Smaller chunks lose the context that makes them retrievable; add chunk-level context instead.
- **"Set `idempotentHint: true` to make retries safe."** Annotations are untrusted hints, not behaviour.
- **"Enable `OTEL_LOG_RAW_API_BODIES` for better debugging."** Only when the pipeline is approved for full conversation content.
- **"Sandbox the code, so the script's calls are pre-approved."** The broker must still evaluate each call.
- **"Cache the deferred tool definitions."** `defer_loading` plus `cache_control` on one tool is a 400.

### One-line recalls (Domain 3)

1. One MCP client per server; the host owns many clients.
2. Two transports: stdio and Streamable HTTP.
3. Tools are model-controlled, resources application-controlled, prompts user-controlled.
4. MCP `2026-07-28` is stateless: `server/discover`, no `initialize`, no protocol session.
5. Sampling, Roots and Logging are deprecated (plus HTTP+SSE); elicitation is the live client primitive.
6. Notifications are opt-in via `subscriptions/listen` and best-effort.
7. Tool execution errors use `isError: true`; protocol errors use JSON-RPC error codes.
8. Claude Code truncates tool responses at 25,000 tokens by default.
9. Concise vs detailed responses: 72 vs 206 tokens in Anthropic's Slack example.
10. Selection accuracy degrades past ~30-50 tools; tool search cuts definition context by >85%.
11. Deferred tools cap 10,000; at least one tool must stay non-deferred.
12. Progressive discovery threshold: 1-5% of context window spent on definitions.
13. Servers MUST implement RFC 9728; clients MUST send the RFC 8707 `resource` parameter.
14. Servers MUST NOT accept or transit tokens not issued for them.
15. Confused deputy needs static client ID + dynamic registration + consent cookie + no per-client consent.
16. Contextual retrieval: 35% / 49% / 67% failure reduction; ~$1.02 per million document tokens.
17. Chunks a few hundred tokens, context prefix 50-100 tokens, retrieve 150, rerank to 20.
18. Under ~200k tokens of corpus, skip RAG and cache the whole thing.

---

## Domain 4: Evaluation, Testing & Optimization (16%)

**What the exam is really testing.** Whether you attach the right measurement to the right failure, and whether you reach for the cheapest fix first. Scenarios read like incident reports: quality dropped after a model upgrade, cost tripled, the agent completes tasks but takes twelve tool calls. Wrong answers are real techniques applied too early (fine-tune before prompt work) or at the wrong layer (few-shot examples to fix a retrieval miss). Multiple-response items cluster here around "select TWO metrics" and "select TWO grading methods".

### 4.1 Building an eval set

- **Mirror the real task distribution**, then deliberately add edge cases. An eval whose distribution differs from production tells you nothing about production.
- **Volume beats per-item polish.** Anthropic's stated preference is many questions with slightly noisier automated grading over a few hand-graded gems. Use Claude to expand a hand-written seed set.
- **Golden dataset**: inputs plus verified expected outputs or acceptance criteria, version-controlled, owned, with provenance. Every production bug becomes a new case.
- **Holdout set.** Tune on one split, validate on a split you never iterate against. Anthropic says this explicitly for agent-assisted tool refinement, to avoid overfitting descriptions to your eval.
- **Sample sizing.** Enough that the difference you care about exceeds the noise. At ~90% accuracy, tens of cases give roughly ±10 points; detecting a few-point regression needs a few hundred. If two variants differ by 2 points on 50 cases, you have measured nothing.
- **Avoid over-strict verification.** Pair each prompt with a verifiable outcome, but do not fail valid alternative phrasings or formatting.
- Agent eval tasks should be **realistic and multi-step** (schedule the meeting, attach the doc, book the room), not single lookups.

### 4.2 Grading methods

| Method | Speed | Reliability | Scale | Nuance | Use when |
|---|---|---|---|---|---|
| Code/exact match | Fastest | Highest | Highest | None | Classification, extraction, schema conformance, tool-argument checks |
| Fuzzy/structural (regex, contains, embedding similarity) | Fast | Medium | High | Low | Required facts present, format checks |
| LLM-as-judge | Fast | Good if validated | High | High | Open-ended text, summaries, tone, multi-criteria rubrics |
| Human review | Slow | High | Poor | Highest | Calibrating the judge, safety sign-off, ambiguous new domains |

LLM-judge discipline, where the pitfall questions live:
- Detailed rubric with hard rules ("must mention Acme Inc. in the first sentence, otherwise incorrect").
- Force **discrete output**: correct/incorrect or a 1-5 scale, never free-form praise.
- Ask it to **reason first, then score**, and discard the reasoning.
- **Validate the judge against human labels** before trusting it. An unvalidated judge is an opinion with a p-value.
- Known biases: position bias in pairwise comparisons (randomise order), verbosity bias, self-preference, leniency drift as rubrics get vaguer.
- Never use the same model and prompt as both generator and sole judge for a gate you will act on.

### 4.3 Metrics and picking the primary one

| Metric | Definition | Primary when |
|---|---|---|
| Accuracy / task fidelity | Correct outputs over total | Classification, extraction, deterministic answers |
| Task completion rate | Goal achieved end to end without human rescue | Agents doing multi-step work |
| TTFT | Time to first token | Streaming, chat, anything a human watches |
| Total latency | Prompt to final token | Synchronous batch-ish jobs, API contracts |
| Throughput | Requests or tokens per unit time | Bulk pipelines, capacity planning |
| Cost per task | All model calls in one task, not per request | Agents, where one task is many calls |
| Safety / security | Refusal correctness, injection resistance, PII leakage, unsafe tool-call rate | Anything with write-capable tools or user-generated input |
| Business KPI | Deflection, time saved, conversion, resolution rate | The thing your sponsor funds |

Cost per **task** is the right unit for agents: per-token cost can fall while task cost rises when the agent takes more turns. Agent latency is dominated by the number of sequential tool calls, not tokens per second. Define success criteria as SMAR (specific, measurable, achievable, relevant) and expect **multidimensional** criteria rather than one number.

### 4.4 Agent-specific evaluation

- **Final-outcome (end-state) evaluation**: did the database end up right, was the ticket created with the right fields. Robust to alternative valid paths; use as the primary signal.
- **Trajectory evaluation**: was the sequence of calls correct, efficient and safe. Diagnostic by default; primary only when the path itself matters (compliance, irreversible actions, cost control). Do not grade against a single golden path when many paths are valid.
- **Tool-call correctness** decomposes into: right tool, right arguments, right order, correct handling of a returned error, no unnecessary calls.
- **Instrument beyond accuracy**: per-call runtime, total task duration, number of tool calls, total tokens, error rate by error type. Repeated near-duplicate calls point at pagination defaults; invalid-parameter errors point at descriptions.
- **Multi-turn evaluation**: scripted user simulators for state carry-over, correction handling ("no, the other account"), context retention. Grade the conversation, not isolated turns.

### 4.5 Rollout safety and regression control

| Mechanism | Gives you | Cost or risk |
|---|---|---|
| Offline regression suite in CI | Blocks known-bad changes pre-merge | Only covers what you encoded |
| Shadow (mirror traffic, discard output) | Real-distribution comparison, zero user risk | Doubles inference spend, no user-reaction signal |
| Canary (small live percentage) | Real user signal, bounded blast radius | Needs fast rollback and per-cohort metrics |
| A/B test | Statistically comparable effect on the KPI | Needs traffic volume and a fixed stopping rule |
| Progressive rollout by tenant | Contains risk for high-value accounts | Slower, more operational overhead |

- **Pin model versions** in production and CI. A floating alias is how "nothing changed but quality dropped" happens.
- Run the golden set on a new model version **before** switching, and keep the old one available for rollback.
- Treat prompt, tool schemas, retrieval index and model version as four independently versioned inputs. Change one at a time when diagnosing.
- Use the **Message Batches API for large eval runs**: 50% cheaper, most batches within an hour, 24-hour ceiling, up to 100,000 requests or 256 MB. No streaming.
- Log a request ID and config hash with every eval run so a regression can be bisected.

### 4.6 Root-cause diagnosis decision tree

1. **Reproduce with the raw transcript**, not the summary. Actual calls, arguments, results, token counts.
2. **Was the needed information in context at generation time?** Not there but in the corpus: **retrieval failure** (check recall@k; fix with hybrid search, contextual chunks, reranking). Never existed: **coverage gap**, no prompt change helps. There earlier but not now: **context overflow or compaction loss** (check input tokens against the window; fix with compaction policy, structured note-taking, subagents returning summaries).
3. **Did a tool fail or return something unusable?** Error-rate spikes, `isError` results, truncated payloads, opaque UUIDs. That is a **tool failure** (schema, description, response shape, pagination), not a model failure.
4. **Facts present but the assertion is false?** **Hallucination**. Ground with citations, require quoting sources, allow "I do not know", penalise unsupported claims in the eval.
5. **Facts present, reasoning wrong, consistently across phrasings?** **Prompt problem** if clearer instructions, decomposition or few-shot fix it on a sample.
6. **Fails even with a hand-perfect prompt, full context and correct tools?** **Model capability mismatch**. Move up a tier or decompose the task.

Fast discriminators: prompt problems vary with phrasing; retrieval problems vary with the query but not the prompt; tool problems show as error-rate spikes in one span; capability problems are stable across every prompt you try; context problems correlate with conversation length or input size.

### 4.7 Optimization levers, cheapest first

1. **Prompt fixes.** Clearer instructions, explicit output format, decomposition. Free and immediate.
2. **Tool and schema fixes.** Better descriptions, better error strings, `response_format`, pagination defaults. Anthropic's own biggest wins came from here.
3. **Few-shot examples.** Cheap and effective for format and edge cases. Costs tokens on every call, so cache them.
4. **Prompt caching.** Cache reads 0.1x base input; 5-minute writes 1.25x; 1-hour writes 2x. Up to 4 breakpoints, 20-block lookback. Prefix order is tools, then system, then messages, so changing tool definitions invalidates everything downstream. Put the breakpoint on the last block that is byte-identical across requests.
5. **Context reduction.** Trim retrieved chunks, concise tool responses, compact history, move intermediates into a sandbox.
6. **Model downgrade or routing.** Classify first, route easy cases to a Haiku-class model, escalate the rest. Validate both paths on the same eval set.
7. **Batch processing.** 50% discount for anything not user-facing: evals, backfills, moderation, bulk generation.
8. **Fine-tuning-like alternatives** last: heavy few-shot, retrieval of similar solved examples, a specialised workflow, distillation. Expensive to build and maintain, invalidated by model upgrades.

Latency specifically: engineer for quality first, optimise second. Reduce output tokens (`max_tokens`, sentence or paragraph limits rather than word counts), pick a faster model, and stream. Streaming improves TTFT only, not total latency.

### Decision heuristics (Domain 4)

- Deterministic or schema-shaped outputs, then code-based grading. Do not reach for a judge.
- Using an LLM judge, then validate against human labels first and force a discrete scale.
- Eval and production distributions differ, then fix the eval before trusting any number from it.
- One metric for an agent, then task completion rate, guarded by cost per task and unsafe-action rate.
- Users watch the stream, then TTFT is the latency metric; otherwise total latency.
- Changing model version, then run the golden set behind a shadow or canary first, and keep the version pinned.
- Quality regressed with no repo change, then check for a floating model alias or a changed retrieval index.
- Recall@k healthy but answers wrong, then the fault is downstream: prompt, grounding instructions, or model tier.
- Cost is the problem, then cache, shorten context, route smaller, batch. Fine-tuning is not the first answer.
- Tasks complete but take too many calls, then consolidate tools and fix pagination.
- Fails on every phrasing with perfect context, then it is capability and prompt work will not save it.

### Common distractors (Domain 4)

- **"Fine-tune the model."** Almost never the first move.
- **"Add more few-shot examples"** offered against a retrieval miss or tool error. Wrong layer.
- **"Use an LLM judge for a classification eval."** Slower, noisier, less reliable than exact match.
- **"Have the model grade its own output"** with no rubric and no human calibration.
- **"Hand-grade 1,000 items."** Right instinct, wrong economics; automate grading, spend humans on calibration.
- **"Ship to 100% and monitor."** Canary and shadow exist to avoid exactly this.
- **"A/B test it"** when traffic cannot reach significance, or when a shadow run would answer it with no user risk.
- **"Grade against the golden trajectory."** Over-strict whenever multiple valid paths exist.
- **"Measure tokens per second"** as the user-facing latency metric for chat. TTFT is what the user feels.
- **"Enable prompt caching"** to fix accuracy. Caching changes cost and TTFT, not quality.
- **"Use batch processing"** for anything interactive. No streaming, up to 24 hours.
- **"Raise temperature"** when the complaint is inconsistency. That makes it worse.

### One-line recalls (Domain 4)

1. Prefer many auto-graded cases over few hand-graded ones.
2. Always hold out a split you never tune against.
3. Code grading: fastest, most reliable, no nuance. LLM judge: scalable nuance, must be validated.
4. Judge recipe: detailed rubric, discrete score, reason then score, discard reasoning.
5. Judge biases to name: position, verbosity, self-preference.
6. SMAR criteria, and usually multidimensional.
7. TTFT is perceived latency; streaming changes only TTFT.
8. Cost per task, not per request, is the agent unit.
9. End-state evaluation is primary for agents; trajectory is diagnostic unless the path is regulated.
10. Track tool calls per task, error rate by type, and total tokens alongside accuracy.
11. Shadow = no user risk, double cost. Canary = real signal, bounded blast radius.
12. Pin model versions; a floating alias is an unlogged deploy.
13. Batch API: 50% off, most within 1 hour, 24-hour max, 100,000 requests or 256 MB, no streaming.
14. Cache reads 0.1x, 5-minute writes 1.25x, 1-hour writes 2x, max 4 breakpoints.
15. Cache prefix order tools, system, messages; changing tools invalidates all of it.
16. Optimization order: prompt, tools, few-shot, caching, context reduction, routing, batch, fine-tune-like last.
17. Diagnosis order: transcript, context presence, tool errors, hallucination, prompt, capability.
18. Phrasing-sensitive means prompt; query-sensitive means retrieval; length-correlated means context overflow; universally stable failure means capability.
