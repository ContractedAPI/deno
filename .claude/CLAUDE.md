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

## Troubleshooting

**If you accidentally change base repo branch:**
```bash
git checkout main
```

**If coding agent works outside worktree:**
- This violates scope constraints
- Retroactive reviews are an exception (documentation only)
- Future implementations MUST use proper worktrees

**If merge fails:**
- Check if you're in the correct location (parent worktree vs base repo)
- Verify parent branch is up to date
- PM agent may resolve conflicts unless they indicate code issues
