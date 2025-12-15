# ContractedAPI Project - Orchestrator Instructions

## Critical Configuration Files

**Before performing these actions, ALWAYS read these configuration files:**

1. **Before writing any commit message:**
   ```bash
   cat .commitlintrc.yml
   ```
   Check the `type-enum` list for valid commit types (e.g., `agents`, `docs`, `feat`, `fix`, etc.)

2. **Before invoking agents:**
   - Review `.claude/agents/tracker-project-manager.md` for PM workflows
   - Review `.claude/agents/task-coder.md` for coding agent constraints

## Agent Orchestration Rules

### When to Use Each Agent

**tracker-project-manager:**
- Creating/managing tracker scope levels (projects, epics, features, tasks)
- Setting up branches and worktrees (`git worktree add -b`)
- Reviewing completed work (checklist + review docs)
- Merging child branches into parents
- All git orchestration operations

**task-coder:**
- Implementing code within an isolated worktree
- Writing tests and fixing bugs
- Making micro-commits following conventional style
- **ONLY** after PM has prepared branch/worktree/agent-prompt

### Critical Workflow Rules

1. **Base Repo MUST Stay on `main`**
   - NEVER change the base repo branch (`C:\Users\smart\Documents\Repos\ContractedAPI\deno`)
   - All development happens in worktrees (`.worktrees/` directory)
   - Exception: PM may briefly switch to `main` during project-level merges

2. **Review → Document → Merge Process**
   When a work item is complete:
   - Step 1: PM updates child checklist + parent checklist
   - Step 2: PM populates review document (REVIEW.md)
   - Step 3: PM merges using `--no-ff` (merge commits, not fast-forward)
   - **NEVER skip documentation steps**

3. **Worktree-Based Merges**
   - Task/Feature/Epic merges: Happen in parent's worktree
   - Project merges: Happen in base repo (to `main`)

4. **One Branch Per Conversation**
   - Each coding agent conversation is scoped to ONE worktree
   - Never ask coding agent to switch branches mid-conversation
   - New task = new agent instance

## Commit Standards

- **Format:** `<type>(<scope>): <description>` (scope optional)
- **Micro-commits:** Ideal ~20 lines, max ~100 lines
- **Types:** Check `.commitlintrc.yml` before committing
- **Common types:**
  - `agents:` - Agent configuration changes
  - `docs:` - Tracker documentation (non-code)
  - `feat:` - New features
  - `fix:` - Bug fixes
  - `test:` - Tests
  - `refactor:` - Code restructuring

## Directory Structure

```
deno/
├── .claude/
│   ├── agents/
│   │   ├── tracker-project-manager.md
│   │   └── task-coder.md
│   └── CLAUDE.md (this file)
├── .worktrees/           # All development worktrees
│   └── {PascalCase.Hierarchy}/
├── tracker/              # Work item documentation
│   └── {project}/{epic}/{feature}/{task}/
├── src/                  # Source code (main repo)
└── .commitlintrc.yml     # Commit type definitions
```

## Completion Signals to Watch For

Route to PM agent when coding agent says:
- "Work item complete"
- "Ready for PM review"
- "Implementation finished"
- "All tests pass, ready for merge"

## Parent Checklist Updates

When marking a child scope complete, PM agent MUST:
1. Check off item in child's CHECKLIST.md
2. Check off corresponding item in parent's CHECKLIST.md
3. Cascade up the hierarchy

## Review Document Template

REVIEW.md structure (PM populates):
```markdown
# {Scope}: {name} - Review

## Review Checklist
- [ ] Items from review section

## Code Review Notes

### Quality Assessment
[Findings on code quality, patterns, edge cases]

### Concerns (if any)
[Issues, risks, technical debt]

## Final Verdict

**[APPROVED / NEEDS CHANGES]**

[Justification]
```

## Orchestrator Role and Responsibilities

**Your role is to:**
1. Route work to the correct agents
2. Detect when agents violate their constraints
3. Update agent configuration files to prevent future violations
4. Delegate fixing problems to the agents (after updating their configs)

**Your role is NOT to:**
- Execute git operations directly (that's PM's job)
- Fix code or documentation yourself (that's coding agent's job)
- Manually correct agent mistakes (update their configs instead)

## Post-Task Verification

**After each task completion, verify agent constraints were followed:**

```bash
# 1. Check base repo is still on main
git branch --show-current  # Must show: main

# 2. Check worktree list (all development should be in worktrees)
git worktree list

# 3. Verify coding agent worked in correct worktree
# Review agent output - should show cd to .worktrees/ directory

# 4. Verify PM didn't create branches in base repo
# PM should only create branches via worktrees (git worktree add -b)
```

**Common Violations to Watch For:**

1. **Coding agent working in base repo** - Should always be in `.worktrees/`
2. **PM creating feature branch in base repo** - Should create feature worktree instead
3. **Base repo not on main** - Critical violation

**When violations are detected:**
1. **Update the violating agent's configuration** in `.claude/agents/`
2. **Spawn the agent with instructions to fix the problem** (tests the config fix)
3. **Do NOT fix the problem yourself**

## After Committing Agent Config Changes

**CRITICAL: Whenever you commit changes to `.claude/agents/` or `.claude/CLAUDE.md`:**

1. **Identify all active worktrees:**
   ```bash
   git worktree list
   ```

2. **Have PM rebase each worktree onto main:**
   - This ensures all branches get the updated agent configs
   - Use PM agent to perform the rebases
   - Check for conflicts and resolve if needed

**Example workflow:**
```
You commit: agents: fix PM worktree rule
↓
git worktree list shows: feature-schema-types worktree
↓
Spawn PM: "Rebase feature-schema-types onto main"
↓
Feature branch now has updated PM config
```

**Why this matters:**
- Agent configs in main won't affect work in feature branches until rebased
- Without rebase, feature branches use old (potentially buggy) agent configs
- Rebase ensures consistency across all active development

## PM Merge Process Clarification

**For Task → Feature merges:**
1. Create feature worktree if it doesn't exist: `git worktree add -b <feature-branch> <feature-worktree-path>`
2. Navigate to feature worktree
3. Merge task branch: `git merge --no-ff <task-branch> -m "merge: <description>"`
4. Remove task worktree
5. Commit tracker updates in feature worktree

**For Feature → Epic / Epic → Project merges:**
- Same pattern: Create parent worktree if needed, merge in parent worktree

**For Project → main merges (ONLY exception):**
1. Ensure base repo is on `main`
2. Merge project branch in base repo
3. Remove project worktree

**CRITICAL:** The base repo should ONLY be used for project-to-main merges. All other merges happen in parent worktrees.

## Troubleshooting

**If base repo accidentally changed branch:**
```bash
git checkout main
```

**If PM created feature branch in base repo instead of worktree:**
```bash
# Fix: Create the feature worktree properly
git worktree add C:\Users\smart\Documents\Repos\ContractedAPI\deno.worktrees\<FeaturePath> <feature-branch>
```

**If coding agent works outside worktree:**
- This violates scope constraints
- Retroactive reviews are an exception (documentation only)
- Future implementations MUST use proper worktrees

**If merge fails:**
- Check if you're in the correct location (parent worktree vs base repo)
- Verify parent branch is up to date
- PM agent may resolve conflicts unless they indicate code issues
