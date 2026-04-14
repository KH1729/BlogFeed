---
name: sdd-build-feature
description: >-
  Run the full Spec-Driven Development pipeline for a single feature: Idea through
  Validation with human approval gates. Use when the user wants to build a feature,
  start a feature, continue a feature through SDD phases, or implement a feature
  through the toolkit pipeline.
---

# Build Feature

## When to Use

Activate when the request contains phrases like:
- build feature, start feature, create feature, work on feature
- continue feature, implement feature through the toolkit
- generate spec/design/plan/tasks for a feature

## Inputs

- **Feature name** — short identifier (e.g., `bulk-user-import`)
- **Raw idea** — free-text description of what the feature should do
- **Options** (optional): mode override, token budget, worker count

## Workflow

Run the canonical SDD pipeline. Pause for human approval at every gate in manual mode.

### Step 1: Idea Capture
- Normalize the raw idea using the idea template (see [templates.md](templates.md))
- Write to `.sdd/workspace/<feature>/current/idea.md`
- Write summary to `.sdd/summaries/<feature>/idea-summary.md`
- Initialize `.sdd/state/<feature>.json` with phase `idea`, status `waiting_for_approval`
- **STOP. Present the idea for human review.**

### Step 2: Spec Drafting (after idea approval)
- Read the idea summary. Adopt the **Spec Agent** role (see [agents.md](agents.md)).
- Draft the spec using the spec template. Write to `.sdd/workspace/<feature>/current/spec.md`
- Write summary and handoff (`spec-to-architecture`)
- Update state: phase `spec`, status `waiting_for_approval`
- **STOP. Present the spec for human review.**

### Step 3: Design (after spec approval)
- Read spec summary + handoff. Adopt the **Architecture Agent** role.
- Draft the design using the design template. Write to `.sdd/workspace/<feature>/current/design.md`
- Write summary and handoff (`architecture-to-work-manager`)
- Update state: phase `design`, status `waiting_for_approval`
- **STOP. Present the design for human review.**

### Step 4: Plan + Tasks (after design approval)
- Read design summary + handoff. Adopt the **Work Manager Agent** role.
- Draft the plan and task breakdown. Write to `.sdd/workspace/<feature>/current/plan.md` and `tasks.md`
- Initialize `.sdd/workspace/<feature>/implementation/task-board.json` and `worker-assignments.json`
- Write summaries and handoff (`manager-to-workers`)
- Update state: phase `tasks`, status `waiting_for_approval`
- **STOP. Present plan and tasks for human review.**

### Step 5: Implementation (after tasks approval)
- Adopt the **Worker Agent** role for each assigned task.
- Implement code to `.sdd/workspace/<feature>/implementation/outputs/`
- Write tests. Update task board with completion status.
- Write handoff (`workers-to-validators`)
- Update state: phase `implementation`, status `waiting_for_approval`
- **STOP. Present implementation for human review.**

### Step 6: Validation (after implementation approval)
- Adopt the **Validation Agent** role.
- Validate implementation against spec, design, and engineering rules.
- Write validation report to `.sdd/workspace/<feature>/current/validation.md`
- Write validation summary
- Update state: phase `validation`, status `waiting_for_approval`
- **STOP. Present validation findings. Human makes final decision.**

### Step 7: Completion (after final approval)
- Snapshot all approved artifacts to `.sdd/registry/<feature>/<phase>/vN.md`
- Update state: status `done`

## Escalation Triggers

Stop work and escalate to the human when:
- A requirement is ambiguous (multiple valid interpretations)
- A design choice involves meaningful tradeoffs the developer should decide
- Changes to previously approved architecture/scope are needed
- Critical/high-severity validation findings are discovered
- Token budget is being exceeded
- Two approved requirements contradict each other
- A phase has been reworked more than twice
- Success criteria are unclear
- New scope is being introduced beyond the approved spec

Format: What happened, Why it needs human input, Options with tradeoffs, Recommendation, Impact of delay.

## Resource Scaling

Default: 1 worker, 1 validator. Scale up only when beneficial:
- Small (1-2 tasks): 1 worker, 1 validator, sequential
- Medium (3-6 tasks): 2-3 workers, 1 validator, parallel where safe
- Large (7+ tasks): 3-5 workers, 2-3 validators, parallel with checkpoints
- Low budget: always sequential, minimal agents, compressed summaries

## Reference Files

- Agent role definitions: [agents.md](agents.md)
- Artifact templates: [templates.md](templates.md)
- Workflow details, state machine, escalation policy: [workflow.md](workflow.md)
