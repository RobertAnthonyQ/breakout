---
description: Solve GitHub issues automatically — read, branch, fix, test, PR
when_to_use: When asked to solve a GitHub issue, scan issues, or auto-solve issues in a repository
allowed-tools: Bash, Read, Write, Edit, Grep, Glob, Agent
argument-hint: "#42" or "all" or "--label=bug"
user-invocable: true
context: inline
effort: high
---

# Issue Solver

You are solving GitHub issues for the repository in your current working directory.

## Parse the argument

- If the argument is a number like `#42` or `42`: solve that specific issue
- If the argument is `all` or `auto`: solve all open issues sequentially
- If the argument is `scan` or `list`: just list open issues, don't solve
- If the argument is `--label=X`: solve open issues with that label
- If no argument: list open issues

## Workflow: List issues

Run:
```
gh issue list --state open --json number,title,labels,assignees --limit 20
```

Format as a clean list:
```
Open issues (N):
  #12 — Fix login redirect [bug]
  #15 — Add pagination [enhancement]
```

## Workflow: Solve a single issue

1. **Read**: `gh issue view <N> --json title,body,comments,labels`
2. **Analyze**: Understand the problem from description + comments
3. **Branch**: `git checkout -b fix/issue-<N>-<slug>`
   - If branch exists: `fix/issue-<N>-<slug>-<timestamp>`
4. **Implement**: Read files, make changes
5. **Test**: Detect and run test suite (npm test, pytest, cargo test, etc.)
   - If tests fail: try to fix. If can't fix, skip issue with explanation.
6. **Commit**: `git add <files> && git commit -m "fix: <desc> (closes #<N>)"`
   - Commit message references the issue number
   - Only add specific files, never `git add .`
7. **Push**: `git push -u origin <branch>`
8. **PR**: `gh pr create --title "fix: <desc>" --body "Closes #<N>\n\n<explanation>"`
9. **Return to main**: `git checkout main` (or master)
10. **Report**: Issue number, PR URL, files changed, summary

## Workflow: Solve all issues

For each open issue, run the single-issue workflow above.
Between issues:
- Always return to main/master branch
- After every 3 solved issues, run `/compact` to free context
- If context feels heavy, run `/compact` proactively

## Output format

Always prefix status with the issue number:
```
[Issue #N] Analyzing: <title>
[Issue #N] Branch: fix/issue-N-slug
[Issue #N] Changed: src/file.ts — <what changed>
[Issue #N] Tests: passed (or: failed — skipping)
[Issue #N] PR #M created: <url>
```

On failure:
```
[Issue #N] Skipped: <reason>
```

## Rules

- NEVER commit to main/master directly
- ALWAYS reference issue number in commit message and PR body
- ALWAYS run tests if a test runner exists
- If issue is too vague or needs architecture changes: skip with explanation
- If branch name conflicts: append timestamp
- Only solve issues you can confidently fix — skip ambiguous ones
- Keep PR descriptions concise but informative
