# VISART — AI Agent & Engineering Rules

This file is the non-negotiable operating manual for humans and AI coding agents.

---

# 1. PROJECT IDENTITY

```text
Project: VISART
Problem: InHack Problem Statement 2 — Empowering Artisans
Core user: Artisan
Core job: Turn a handmade product into a professional digital listing
```

Core transformation:

```text
Craft
→ Digital understanding
→ Listing
→ Pricing guidance
→ Marketing
→ Reach
```

Anything outside this transformation must be treated as optional.

---

# 2. VERSION BOUNDARY

## V1

Submission-critical.

Must be complete.

## V2

Optional enhancements.

Must never destabilize V1.

If V1 is incomplete:

```text
STOP V2
FIX V1
```

---

# 3. THREE-MEMBER OWNERSHIP

## MEMBER A — EXPERIENCE

Primary:

```text
app/page.tsx
app/create/**
components/landing/**
components/create/**
components/brand/**
components/ui/**
components/motion/**
app/globals.css
```

V2:

```text
accessibility UI
font scaling
contrast
reduced motion
voice UI controls
audio controls
```

---

## MEMBER B — AI

Primary:

```text
app/api/**
lib/ai/**
lib/validation/**
types/**
```

V2:

```text
voice-to-form
voice intent
voice commands
explain commands
translation commands
regeneration commands
```

---

## MEMBER C — PLATFORM

Primary:

```text
lib/supabase/**
supabase/**
components/workspace/**
components/product/**
app/workspace/**
app/product/**
```

V2:

```text
text-to-speech
audio state
accessibility preference persistence
integration testing
```

---

# 4. SHARED FILES

High-conflict:

```text
package.json
package-lock.json
app/globals.css
types/visart.ts
```

Only one person edits a shared file at a time.

If you need to change one:

1. notify team
2. make smallest change
3. commit
4. notify team

---

# 5. READ BEFORE EDITING

Every agent session starts by reading:

```text
plan.md
rules.md
website-prompt.md
stack.md
```

Then:

```bash
git status
git branch
```

Then inspect the relevant existing source.

Do not code first.

---

# 6. NEVER INVENT PROJECT STATE

Do not claim:

> “The project already has X”

unless you inspected it.

Never invent:

- routes
- components
- API endpoints
- database tables
- environment variables
- utility functions
- design tokens
- AI response fields
- existing features

---

# 7. CHANGE PROCESS

For non-trivial work, establish:

```text
Problem:
Expected behavior:
Affected files:
Implementation:
Verification:
```

Then edit.

---

# 8. SMALLEST SAFE CHANGE

Never rewrite the project because:

> “I would architect it differently.”

Instead:

```text
identify problem
→ locate source
→ smallest safe change
→ test
```

Large refactors require human/team approval.

---

# 9. DEPENDENCY RULE

Never use:

```bash
npm install package@latest
```

during the hackathon.

Use the pinned versions in `stack.md`.

Do not upgrade dependencies because an agent thinks a newer version is better.

The lockfile is authoritative.

---

# 10. AI SDK RULE

Use:

```text
@google/genai
```

Do not use:

```text
@google/generative-ai
```

Keep API keys server-side.

Never expose:

```text
GEMINI_API_KEY
```

to the browser.

---

# 11. AI OUTPUT IS UNTRUSTED

Never directly render arbitrary model output.

Required:

```text
AI response
↓
parse
↓
Zod validation
↓
normalize
↓
UI
```

If validation fails:

```text
retry once
```

If still invalid:

```text
controlled error
```

Never let malformed model output crash the application.

---

# 12. AI HALLUCINATION RULE

Never invent:

- family history
- number of generations
- heritage claims
- historical age
- community ownership
- geographic origin
- certification
- awards
- GI status
- sustainability certification
- market statistics
- customer reviews

Only use information supplied by the artisan or verified application data.

---

# 13. PRICING RULE

VISART provides:

```text
AI-assisted price recommendation
```

not:

```text
guaranteed market price
```

If external market data is unavailable, recommendations must be based on user-provided information and labeled as estimates.

---

# 14. COPY RULE

Avoid generic AI phrases:

```text
timeless beauty
where tradition meets innovation
crafted with passion
unlock your potential
revolutionize your journey
```

Prefer concrete facts:

```text
Handwoven from bamboo and made over approximately two days.
```

The product description should sound specific to the actual item.

---

# 15. CULTURAL ACCURACY

Do not romanticize or fabricate artisan identity.

Do not infer community/tribal identity from an image.

Do not invent cultural facts.

Do not turn unknown details into authoritative statements.

---

# 16. DESIGN RULE

For all frontend/UI work, `ui.md` is the permanent visual source of truth. AI agents MUST read `ui.md` before creating or substantially modifying frontend UI.

VISART must not become generic AI SaaS.

Forbidden unless there is a specific reason:

- purple/blue gradients
- glassmorphism
- glowing cards
- decorative blobs
- excessive pills
- excessive cards
- emoji as primary UI
- generic AI robot graphics
- random 3D illustrations

Use the design canon from `website-prompt.md` and `ui.md`.

---

# 17. MOTION RULE

Use Motion intentionally.

Good:

- AI processing
- page transition
- result reveal
- score reveal
- focus feedback
- tab transitions

Bad:

- constant floating
- spinning decoration
- excessive bounce
- animation on every element

Prefer transform and opacity.

Respect reduced motion.

---

# 18. COMPONENT RULE

Do not create components merely to split files.

Extract when:

- reused
- independently stateful
- semantically meaningful
- complex enough to isolate

Do not create abstraction layers without a demonstrated need.

---

# 19. TYPESCRIPT RULE

Avoid `any`.

Prefer:

```ts
unknown
```

and validate/narrow.

All AI response shapes must be explicitly typed.

---

# 20. API RULE

The API contract is shared.

Do not silently change response shapes.

If the response changes:

1. update schema
2. update type
3. update consumers
4. test
5. notify team

---

# 21. DATABASE RULE

Do not destructively change the database during the hackathon.

No:

```text
DROP
TRUNCATE
mass DELETE
```

without explicit approval.

---

# 22. IMAGE RULE

Accept:

```text
JPEG
PNG
WebP
```

Maximum:

```text
8 MB
```

Always:

```text
select
→ preview
→ validate
→ upload
```

---

# 23. ASYNC UI RULE

Every network action must have:

```text
idle
loading
success
error
```

Never leave a button visually unchanged while a request is running.

---

# 24. AI REQUEST RULE

Never call AI:

```text
on every render
on every keystroke
on every tab switch
```

Call only on explicit actions:

```text
Create my listing
Generate marketing
Translate
Analyze readiness
```

Persist generated results when practical.

---

# 25. SECURITY RULE

Never commit:

```text
.env.local
API keys
private credentials
Supabase service-role keys
```

`.env.example` may contain only variable names.

---

# 26. GIT RULE

Never:

```text
force push shared branches
rewrite another person's commits
commit secrets
commit build artifacts
```

Before work:

```bash
git status
git pull
```

Before handoff:

```bash
git status
git diff
```

============================================================
GIT COMMIT, BRANCH & PUSH POLICY — MANDATORY
============================================================

All Git operations performed by an AI agent must follow this policy.

This project uses an approval-controlled Git workflow.

The AI agent MUST NEVER automatically push code to `main`.

The AI agent MUST NEVER merge a feature branch into `main`.

The AI agent MUST NEVER switch to `main` and commit implementation work there.

The AI agent MUST NEVER force-push to any branch.

The human developer has final authority over all remote Git operations.

------------------------------------------------------------
1. WORK ONLY ON THE ASSIGNED FEATURE BRANCH
------------------------------------------------------------

For Member A, the working branch is:

feat/member-a-experience

Before making code changes, verify:

git branch --show-current

If the current branch is not the assigned feature branch, stop and report the mismatch.

Do NOT automatically switch branches unless explicitly instructed by the human developer.

For Member A:

EXPECTED BRANCH:
feat/member-a-experience

------------------------------------------------------------
2. COMMITS ARE LOCAL BY DEFAULT
------------------------------------------------------------

When the AI agent finishes a logical unit of work, it MAY create a Git commit.

The commit must remain LOCAL.

Creating a commit does NOT authorize pushing it to GitHub.

The normal workflow is:

WORK
↓
TEST
↓
git status
↓
git diff
↓
LOCAL COMMIT
↓
STOP
↓
WAIT FOR HUMAN APPROVAL
↓
PUSH ONLY AFTER APPROVAL

Example:

git add <specific files>
git commit -m "feat: implement workspace presentation"

After creating the commit:

DO NOT run:

git push

DO NOT run:

git push origin main

DO NOT run:

git push --force

DO NOT open or merge a pull request automatically.

------------------------------------------------------------
3. PUSH REQUIRES EXPLICIT HUMAN APPROVAL
------------------------------------------------------------

A push to any remote branch requires explicit approval from the human developer.

The AI agent must ask for approval after the local commit is successfully created.

Example message:

"Local commit created successfully:
<commit hash> <commit message>

Nothing has been pushed.

Would you like me to push this commit to:
origin/feat/member-a-experience?"

Only after the human explicitly approves the push may the agent execute:

git push origin feat/member-a-experience

Do NOT interpret vague statements such as:

"looks good"
"continue"
"done"
"okay"
"proceed"

as permission to push unless the human explicitly authorizes the push.

Valid approval examples include:

"Push it."

"Yes, push this commit."

"Push to feat/member-a-experience."

------------------------------------------------------------
4. MAIN BRANCH PROTECTION
------------------------------------------------------------

The AI agent must treat `main` as a protected branch.

The AI agent must NEVER:

- commit directly to `main`
- push directly to `main`
- merge into `main`
- force-push to `main`
- reset `main`
- rebase `main` destructively
- delete `main`
- change branch protection settings

unless the human explicitly and clearly instructs the agent to perform that exact operation.

Normal development must happen on the assigned feature branch.

For Member A:

feat/member-a-experience

------------------------------------------------------------
5. NO AUTOMATIC MERGING
------------------------------------------------------------

After pushing a feature branch, the AI agent must NOT automatically merge it into `main`.

The human developer will decide:

- when to create a Pull Request
- whether the PR is ready
- whether conflicts should be resolved
- whether the branch should be merged
- when changes should reach `main`

The AI agent may provide merge instructions, but must not execute the merge without explicit approval.

------------------------------------------------------------
6. NO FORCE PUSH
------------------------------------------------------------

Never use:

git push --force

git push -f

git reset --hard

or other destructive Git operations on shared branches unless explicitly approved by the human developer.

If a push is rejected because the remote branch has changed:

STOP.

Explain the situation.

Do NOT automatically force-push.

------------------------------------------------------------
7. ALWAYS INSPECT BEFORE COMMITTING
------------------------------------------------------------

Before creating a commit, run:

git status

Then inspect the relevant diff:

git diff

Do NOT blindly use:

git add .

unless explicitly instructed.

Prefer adding only the files belonging to the completed task.

Example:

git add app/create/page.tsx
git add components/create/ProductForm.tsx
git add components/create/ImageUploader.tsx

Then:

git status

Then:

git commit -m "feat: implement product creation flow"

------------------------------------------------------------
8. NEVER COMMIT SECRETS
------------------------------------------------------------

Before committing, verify that sensitive files are not staged.

Never commit:

.env
.env.local
.env.production
API keys
Supabase service-role keys
Gemini API keys
private credentials
tokens
passwords
secret configuration

If a secret appears to be staged:

STOP.

Do not commit.

Report the issue to the human developer.

------------------------------------------------------------
9. COMMIT FREQUENCY
------------------------------------------------------------

Create commits around logical milestones rather than every tiny change.

Good examples:

feat: establish editorial design system

feat: implement landing experience

feat: implement product creation flow

feat: add workspace presentation

feat: implement public product page

fix: resolve mobile workspace overflow

fix: improve create flow validation

Do not create meaningless commits such as:

update files

changes

stuff

fix things

work

------------------------------------------------------------
10. COMMIT SCOPE
------------------------------------------------------------

A commit should represent one coherent piece of work.

Avoid mixing unrelated work.

Bad:

feat: landing page + database migration + Gemini prompt changes

Good:

feat: implement landing experience

The AI agent must respect team ownership and avoid committing unrelated Member B or Member C changes.

------------------------------------------------------------
11. EXISTING UNCOMMITTED WORK
------------------------------------------------------------

Before modifying files:

git status

If there are existing uncommitted changes that were not created by the current task:

DO NOT overwrite them.

DO NOT automatically discard them.

DO NOT run:

git reset --hard

Ask the human developer or carefully work around the existing changes.

Preserve all unrelated work.

------------------------------------------------------------
12. AFTER COMMIT — STOP AT THE APPROVAL BOUNDARY
------------------------------------------------------------

The default end state for an AI coding task is:

Working tree clean
+
Local commit created
+
Nothing pushed

Example:

git status

Output should indicate the working tree is clean.

Then report:

"Implementation complete.
Tests passed.
Local commit created.
No remote push was performed."

Then wait for human approval.

------------------------------------------------------------
13. REQUIRED COMMIT REPORT
------------------------------------------------------------

Whenever a commit is created, report:

## Commit Created

Branch:
feat/member-a-experience

Commit:
<short hash>

Message:
<commit message>

Files:
<list of committed files>

Verification:
- npm run lint
- npm run build
- relevant manual tests

Remote:
NOT PUSHED

Next action:
Waiting for explicit human approval before pushing.

------------------------------------------------------------
14. APPROVAL IS REQUIRED FOR REMOTE CHANGES
------------------------------------------------------------

The following operations ALWAYS require explicit human approval:

- git push
- git push origin <branch>
- merging a branch
- creating a PR
- closing a PR
- rebasing shared branches
- force pushing
- deleting remote branches
- modifying branch protection

Local operations such as:

- git status
- git diff
- git log
- creating a local feature branch
- creating a local commit

may be performed as part of normal development, provided they do not destroy existing work.

============================================================
GOLDEN RULE
============================================================

LOCAL COMMIT ≠ REMOTE PUSH

A successful commit only means:

"The work is saved locally."

It does NOT mean:

"The work has been uploaded to GitHub."

The AI agent must always stop at the local-commit boundary and wait for explicit human approval before pushing.

The human developer controls when work leaves the local machine and reaches the remote repository.

NEVER AUTOMATICALLY PUSH TO MAIN.
NEVER AUTOMATICALLY MERGE TO MAIN.
NEVER FORCE PUSH.

============================================================

---

# 27. COMMIT FORMAT

Use:

```text
feat:
fix:
style:
refactor:
chore:
docs:
```

Examples:

```text
feat: add artisan creation flow
feat: add structured Gemini generation
feat: add readiness score
fix: handle invalid AI response
style: refine VISART editorial layout
```

---

# 28. HANDOFF FORMAT

Every agent handoff must include:

```markdown
## Status
SUCCESS / PARTIAL / BLOCKED / FAILED

## What changed
- ...

## Files changed
- ...

## Verification
- Command:
- Result:

## Known issues
- ...

## Remaining work
- ...

## Next recommended task
- ...
```

---

# 29. SESSION LOG

Maintain:

```text
SESSION_LOG.md
```

Record:

- current state
- completed work
- unfinished work
- known bugs
- files changed
- commands run
- tests run
- git state
- next task
- important decisions

The next agent must be able to continue without the previous conversation.

---

# 30. WHEN STUCK

If an error occurs:

1. Stop unrelated changes.
2. Capture exact error.
3. Identify exact command.
4. Inspect relevant code.
5. Make one focused fix.
6. Re-run.
7. If blocked, report.

Never endlessly retry.

---

# 31. RATE LIMIT / LOOP RULE

If the agent repeatedly attempts the same operation or hits rate limits:

```text
STOP
↓
git status
↓
git diff
↓
inspect application
↓
update SESSION_LOG.md
↓
restart with smaller task
```

Continuing to think is not progress.

---

# 32. REVIEW MODE

When asked to review:

**Do not modify files.**

Return:

```markdown
## Verdict
APPROVED / CHANGES REQUESTED

## Findings
### Critical
### Important
### Minor

## Evidence
file:line

## Recommendation
...
```

---

# 33. SAFE AUTONOMY

Agent may autonomously:

- inspect files
- run tests
- run local server
- inspect API responses
- make scoped fixes
- update docs
- update session log

Agent must request approval before:

- changing framework
- changing core UX
- changing API contract
- changing database schema
- removing major subsystem
- large refactor
- destructive data operations

---

# 34. FINAL V1 FREEZE

Once V1 works:

```text
NO NEW MAJOR V1 FEATURES.
```

Only:

- bug fixes
- visual polish
- responsive fixes
- reliability
- accessibility baseline
- demo hardening

---

# 35. FINAL EMERGENCY PROTOCOL

If something breaks near submission:

DO:

```text
freeze
identify
fix smallest path
test
deploy
```

DO NOT:

```text
upgrade framework
replace database
rewrite architecture
change AI provider
redesign everything
```

---

# 36. FINAL PRINCIPLE

The agent is rewarded for:

> **the correct smallest change while preserving everything that already works.**

Not for making the largest amount of code.
