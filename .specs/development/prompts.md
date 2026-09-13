---
title: Prompts Log
description: AI interaction log for ClaudeCertifiedArchitect-Professional-Prep
project: ClaudeCertifiedArchitect-Professional-Prep
language: en
lastUpdated: 2026-09-13
sourceOfTruth: project/project.yaml
---

# Development Prompts Log

## Overview
This file (prompts.md) contains ALL AI interactions for ClaudeCertifiedArchitect-Professional-Prep. Update .specs/prompts.md with every AI interaction.

**🚨 MANDATE**: Update with every AI interaction.

## Archive Policy

> **Line limit: 100 lines.** When this file exceeds 100 lines, run:
>
> ```bash
> specpilot archive
> ```
>
> This will move older entries from this file into `development/prompts-archive.md` automatically, keeping the most recent entries here. A `--dry-run` flag is available to preview changes before writing.
>
> No stub `prompts-archive.md` file is generated during `specpilot init` — it is created on first archive run.

## Re-Anchor Prompt

> Paste this into your AI agent when: the session has been running > 1 hour, you've made > 20 exchanges, or the AI seems to have forgotten project rules.

~~~
You are working on ClaudeCertifiedArchitect-Professional-Prep (en).

CRITICAL RULES — re-read these before continuing:
1. NEVER commit, push, or deploy unless I explicitly ask you to.
2. NEVER modify .specs/ folder structure or file names — only update file contents.
3. After EVERY code change, proactively update all affected .specs/ files without being asked.
4. Spec-First Development — update .specs/ before writing code.
5. Log this and all AI interactions in .specs/development/prompts.md.

For full project context, read .specs/project/project.yaml.
~~~

---

## Prompt History

| Date | User | Prompt Summary | Context |
|------|------|----------------|---------|
| 2026-09-13 | @girishr | "Onboard this project with SpecPilot." | [PROMPT-girishr-001] Ran the SpecPilot onboarding flow, answering from the repo where it could (PRODUCT.md, README, git config, build tooling) and asking where it could not (project category, scale, timeline, testing/CI). Wrote the 25 generated files, then carried out the brownfield analysis in `onboarding.md`: populated architecture, requirements (REQ-001–010), threat model (SEC-001/002), security decisions (SEC-DEC-001–007), test strategy, roadmap (M1–M3) and tasks (CS-001–004, BL-001–005). Deleted `onboarding.md` per its final step. |