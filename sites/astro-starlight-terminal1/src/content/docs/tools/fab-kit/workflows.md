---
title: Workflows
description: Real-world fab-kit workflows — from idea to merged PR.
---

## The standard pipeline

A change from intake to merged PR, fully agent-driven.

```text
/fab-new "add CSV export to reports"
  ↓ intake.md generated, confidence scored
/fab-continue
  ↓ spec.md generated, [NEEDS CLARIFICATION] markers if ambiguous
/fab-clarify              # only if confidence < gate
/fab-continue
  ↓ plan.md + apply (code generated, tests written)
/fab-continue
  ↓ review (sub-agent validates against spec + constitution)
/fab-continue
  ↓ hydrate (memory updated with decisions made)
/git-pr
  ↓ commit, push, PR opened
/git-pr-review
  ↓ triage and fix review comments
```

In practice, you run `/fab-fff` and let the whole pipeline execute. You only intervene at gates (low confidence) or when review fails.

## Parallel changes via worktrees

Combine with [`wt`](/tools/wt/overview/) to run multiple changes simultaneously.

```bash
wt create auth-middleware-jwt
wt create csv-export-reports

# In each worktree, in a separate agent session:
# Session A:  /fab-fff   (authoring auth-middleware-jwt)
# Session B:  /fab-fff   (authoring csv-export-reports)
```

Each worktree has its own `fab/.fab-status.yaml` pointer, so the agents don't step on each other.

## When review fails

If the review stage fails (sub-agent finds spec mismatches), `/fab-continue` enters a rework loop. By default, max 3 cycles, then escalation.

Common fixes:

1. **Fix the code** — straightforward bugs
2. **Revise the plan** — the approach was wrong; regenerate plan tasks
3. **Revise the spec** — the spec was wrong; rewrite acceptance criteria

The escalation menu surfaces all three; you pick.

## Tuning confidence gates

If you keep hitting the spec gate, the spec stage isn't producing enough decisions for the change type. Two knobs:

```yaml
# fab/project/config.yaml
stage_directives:
  spec:
    - Use GIVEN/WHEN/THEN for scenarios
    - "Mark ambiguities with [NEEDS CLARIFICATION]"
    - Define at least one acceptance criterion per scenario
```

Adding directives forces more explicit decisions, raising confidence.

## Hydrating memory from an existing codebase

If you adopt `fab-kit` on a project with no memory, bootstrap with:

```text
/docs-hydrate-memory
```

This reads your codebase, drafts memory files by domain, and populates `docs/memory/`. Run once at adoption.
