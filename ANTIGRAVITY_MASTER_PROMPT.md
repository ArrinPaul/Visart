# VISART — ANTIGRAVITY MASTER BUILD PROMPT

## READ THIS ENTIRE PROMPT BEFORE TOUCHING THE CODE

You are the primary AI engineering agent responsible for implementing **VISART** inside an already Git-cloned repository.

This is a 5-hour hackathon project being built by **three human developers**, each potentially using an AI coding agent.

Your job is not to improvise a product.

Your job is to implement the already-decided product faithfully, safely, and incrementally.

---

# 0. IMMEDIATE CONTEXT

The repository already exists and is Git-cloned.

The current repository may initially contain only:

```text
Visart/
├── .git/
└── README.md
```

Do NOT clone another repository.

Do NOT create a second project beside the current project.

Work inside the existing repository root.

---

# 1. YOUR FIRST JOB IS RECONNAISSANCE

Before writing application code:

1. Print current working directory.
2. Inspect the repository tree.
3. Run:
   ```bash
   git status
   git branch
   git remote -v
   ```
4. Read:
   - `README.md`
   - `plan.md`
   - `rules.md`
   - `website-prompt.md`
   - `stack.md`
5. Inspect any existing source files.
6. Check whether `package.json` already exists.
7. Check whether a Next.js app already exists.
8. Check whether dependencies are already installed.
9. Check whether `.env.local` exists.
10. Never assume the repository is empty until you inspect it.

---

# 2. DO NOT ASK UNNECESSARY QUESTIONS

You have enough specification to begin.

Do not stop to ask:

- what colors should I use?
- what pages should I make?
- should I use Tailwind?
- should I use Motion?
- what should the product be called?
- what is V1?
- which developer owns AI?
- should I build a marketplace?

Those decisions are already fixed below.

If an implementation detail is genuinely unspecified, choose the smallest conventional solution that preserves the existing architecture.

Only stop for human approval when the rules explicitly require approval.

---

# 3. PRODUCT DEFINITION

## Name

VISART

## Tagline

> Your craft. Digitally understood.

## Core problem

An artisan should be able to become digitally visible without having to become digitally fluent.

## Core user

Artisan.

## Core transformation

```text
CRAFT
↓
PHOTO + FEW FACTS
↓
VISART AI
↓
PRODUCT UNDERSTANDING
↓
PROFESSIONAL LISTING
↓
PRICE GUIDANCE
↓
MARKETING
↓
MULTILINGUAL REACH
↓
DIGITAL READINESS
↓
PRODUCT PAGE
```

VISART is NOT a generic marketplace.

Do not build:

- checkout
- shipping
- social network
- reviews
- messaging
- full customer accounts
- complex seller management
- ONDC integration
- custom ML training

unless the human team explicitly changes scope.

---

# 4. V1 / V2 RULE

## V1 = submission-critical

V1 must be a complete, polished workflow.

```text
Landing
→ Create
→ Upload
→ Product facts
→ AI generation
→ Listing
→ Pricing
→ Marketing
→ Translation
→ Readiness
→ Save
→ Product page
```

## V2 = optional enhancement

Only start V2 after V1 works.

V2 focuses on:

- voice-to-form
- voice commands
- text-to-speech
- accessibility mode
- larger text
- high contrast
- reduced motion
- simplified language
- explainable AI

If V1 is not stable:

**DO NOT BUILD V2.**

---

# 5. THREE-MEMBER TEAM OWNERSHIP

## MEMBER A — EXPERIENCE ENGINEER

Own:

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

V1:

- design system
- landing
- create flow
- image upload UI
- processing UI
- workspace presentation
- listing UI
- pricing presentation
- marketing presentation
- language presentation
- readiness presentation
- product page presentation
- responsive design
- Motion

V2:

- accessibility UI
- font scaling
- high contrast
- reduced motion
- voice UI
- audio controls

---

## MEMBER B — AI / INTELLIGENCE ENGINEER

Own:

```text
app/api/**
lib/ai/**
lib/validation/**
types/**
```

V1:

- Gemini client
- product analysis
- listing
- pricing
- marketing
- translation
- story
- readiness
- schemas
- retry/error handling

V2:

- voice-to-form extraction
- intent interpretation
- voice commands
- simplify command
- translate command
- regenerate command
- explain command

---

## MEMBER C — PLATFORM / DATA ENGINEER

Own:

```text
lib/supabase/**
supabase/**
components/workspace/**
components/product/**
app/workspace/**
app/product/**
```

V1:

- Supabase
- database
- storage
- image persistence
- product persistence
- product retrieval
- product page data
- seed/demo data
- integration verification

V2:

- text-to-speech
- audio state
- accessibility preference persistence
- voice/audio integration
- integration testing

---

# 6. FILE OWNERSHIP RULE

Do not edit another member's primary files unless absolutely necessary.

If you must:

1. identify why,
2. make the smallest change,
3. tell the human team,
4. record it in the handoff.

Shared files:

```text
package.json
package-lock.json
app/globals.css
types/visart.ts
```

Only one person edits shared files at a time.

---

# 7. DEVELOPMENT ORDER

Implement in this exact order.

## STEP 1 — FOUNDATION

Establish:

- package.json
- exact versions
- TypeScript
- Next.js App Router
- Tailwind
- Motion
- Lucide
- Zod
- Supabase client
- Gemini client
- `.env.example`
- `.gitignore`
- base folder structure

Verify:

```bash
npm run dev
npm run lint
npm run build
```

Do not continue if the foundation is broken.

---

## STEP 2 — DESIGN FOUNDATION

Implement:

- global CSS
- design tokens
- fonts
- typography
- body
- buttons
- input
- labels
- focus states
- basic container/grid
- responsive foundation

Use the Editorial Craft Studio direction.

Do not create generic AI SaaS styling.

---

## STEP 3 — LANDING

Build:

```text
/
```

Required sections:

1. hero
2. problem
3. transformation
4. human story
5. CTA
6. footer

Primary CTA:

```text
Create my listing
```

---

## STEP 4 — CREATE FLOW

Build:

```text
/create
```

Fields:

```text
product name optional
material
production cost
time required
location
craft story optional
```

Image:

```text
JPEG
PNG
WebP
max 8MB
```

Show local preview.

---

## STEP 5 — AI PROCESSING

Build staged Motion UI:

```text
Looking at your product
Understanding the craft
Writing the listing
Preparing pricing guidance
Preparing customer-ready content
```

No generic spinner.

---

## STEP 6 — AI BACKEND

Build:

```text
POST /api/generate
```

Input:

```text
image
product facts
artisan facts
```

Output must validate against Zod.

Canonical shape:

```ts
type VisartGeneration = {
  product: {
    title: string;
    shortDescription: string;
    description: string;
    category: string;
    material: string;
    craftTechnique: string;
    keywords: string[];
    tags: string[];
  };

  pricing: {
    currency: "INR";
    min: number;
    recommended: number;
    max: number;
    rationale: string[];
    disclaimer: string;
  };

  marketing: {
    instagram: string;
    whatsapp: string;
    shortAd: string;
  };

  translations: {
    hindi: {
      title: string;
      description: string;
    };
    kannada: {
      title: string;
      description: string;
    };
  };

  story: {
    title: string;
    body: string;
  };

  readiness: {
    overall: number;
    photography: number;
    description: number;
    discoverability: number;
    pricingPresentation: number;
    marketing: number;
    topActions: string[];
  };
};
```

Never trust raw AI output.

Use:

```text
AI
→ parse
→ Zod
→ normalized object
→ UI
```

---

# 8. AI PROMPT REQUIREMENTS

The AI must:

- use supplied product facts
- use visible image information conservatively
- avoid unsupported claims
- write concrete descriptions
- provide useful search phrases
- label price as AI-assisted
- preserve artisan-provided story
- translate meaning rather than word-for-word nonsense
- avoid generic marketing clichés
- never invent heritage claims

Never generate claims such as:

```text
500-year-old tradition
UNESCO recognized
GI certified
three generations
award-winning
tribal-owned
eco-certified
```

unless the supplied data explicitly supports them.

---

# 9. PRICING

Use:

```text
AI-assisted price recommendation
```

not:

```text
guaranteed market price
```

If no external market data is supplied, use:

- material cost
- labour/time
- production complexity
- provided target price
- provided packaging information

and clearly state assumptions.

---

# 10. WORKSPACE

Build:

```text
/workspace
```

Tabs:

```text
LISTING
PRICING
MARKETING
REACH
```

Display:

```text
Digital Readiness
82 / 100
```

and the top three actions.

The workspace is the primary demo screen.

---

# 11. PRODUCT PAGE

Build:

```text
/product/[id]
```

Make it feel like a premium craft catalogue.

Show:

- image
- title
- price
- metadata
- description
- story
- details
- languages
- contact artisan
- share

Do not build checkout.

---

# 12. SUPABASE

Use minimal schema:

```sql
create table artisans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text,
  craft text,
  preferred_language text,
  created_at timestamptz not null default now()
);

create table products (
  id uuid primary key default gen_random_uuid(),
  artisan_id uuid references artisans(id),
  image_url text,
  input_data jsonb not null,
  generated_data jsonb,
  created_at timestamptz not null default now()
);
```

Use storage for product images.

Do not over-normalize AI-generated JSON during the hackathon.

---

# 13. DEMO DATA

Prepare:

```text
1. Assamese bamboo basket
2. Handwoven textile
3. Traditional pottery
```

Do not fabricate real people.

Use clearly demo-safe artisan information.

---

# 14. DESIGN

Use:

```text
Background: #F5F0E8
Surface: #FBF8F2
Ink: #1E211F
Muted ink: #68655F
Deep indigo: #27344A
Terracotta: #B85C43
Brass: #A88752
Line: #D8D0C4
Success: #54745A
Danger: #A34F4F
```

Typography:

```text
Playfair Display
Inter
```

No:

- purple gradients
- blue AI gradients
- glassmorphism
- glowing borders
- floating blobs
- excessive pills
- generic dashboard cards
- emoji-first UI

---

# 15. MOTION

Use:

```ts
import { motion, AnimatePresence } from "motion/react";
```

Animate:

- stage transitions
- result reveal
- tabs
- score
- focus
- image entrance

Prefer:

```text
opacity
transform
scale
```

Respect reduced motion.

---

# 16. ACCESSIBILITY V1

Must include:

- semantic HTML
- form labels
- alt text
- keyboard navigation
- visible focus
- contrast
- reduced motion
- accessible errors
- touch-friendly controls

V2 can add:

- high contrast mode
- larger type
- text-to-speech
- voice input
- voice commands

---

# 17. V2 VOICE-TO-FORM

After V1 is stable, implement:

```text
User:
"This is a bamboo basket.
It takes two days to make.
It costs around 450 rupees."

↓
Speech-to-text
↓
AI extraction
↓
Form fields populated
```

The user should not have to manually type everything.

---

# 18. V2 VOICE COMMANDS

Examples:

```text
"Create my listing."
"Translate this to Hindi."
"Make the description shorter."
"Read the price recommendation."
"Regenerate the marketing copy."
"Why did you recommend this price?"
```

Map commands to explicit actions.

Do not create an unrestricted general-purpose agent.

---

# 19. V2 TEXT-TO-SPEECH

Provide:

```text
Read aloud
```

for:

- product title
- description
- price rationale
- recommendations

Use accessible audio controls.

---

# 20. V2 ACCESSIBILITY MODE

Provide:

```text
Accessibility mode
```

with:

- larger text
- higher contrast
- reduced motion
- larger controls
- simplified language
- read aloud

---

# 21. TEST THE CANONICAL JOURNEY

Before declaring V1 complete:

```text
Landing
↓
Create
↓
Upload
↓
Facts
↓
Generate
↓
AI result
↓
Listing
↓
Pricing
↓
Marketing
↓
Translation
↓
Readiness
↓
Save
↓
Product page
↓
Refresh
↓
Reopen
```

Run it three consecutive times.

---

# 22. GIT RULES

Never:

```text
force push
rewrite another developer's commits
commit secrets
```

Use branches:

```text
feat/member-a-experience
feat/member-b-ai
feat/member-c-platform
```

Commit messages:

```text
feat:
fix:
style:
refactor:
chore:
docs:
```

---

# 23. AGENT HANDOFF

Every task ends with:

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

Update:

```text
SESSION_LOG.md
```

---

# 24. FINAL TIMEBOX

```text
0:00–0:20 Foundation
0:20–1:20 Parallel foundations
1:20–2:20 Core V1
2:20–3:20 Integration
3:20 V1 freeze
3:20–4:00 Polish/reliability
4:00–4:30 V2 if V1 is stable
4:30–5:00 Final testing/demo
```

If V1 is incomplete at 4:00:

**do not build V2.**

---

# 25. FINAL COMMANDS

Before handoff:

```bash
npm run lint
npm run build
git status
git diff
```

If browser tooling is available, verify:

- console
- images
- mobile
- overflow
- keyboard
- loading
- error
- AI result

---

# 26. FINAL PRINCIPLE

Do not optimize for:

```text
maximum code
maximum features
maximum architecture
```

Optimize for:

```text
minimum unnecessary complexity
+
maximum reliability
+
maximum visual polish
+
one unforgettable workflow
```

Now begin by inspecting the repository. Do not code until you have completed reconnaissance.

---

# APPENDIX — COMPLETE UPDATED PROJECT DOCUMENTS

The following four documents are the authoritative project documents. If any earlier instruction conflicts with them, use the most recent section of this prompt and the explicit V1/V2/ownership rules above.

============================================================
BEGIN plan.md
============================================================

# VISART — Master Engineering Plan

**Project:** VISART  
**Challenge:** InHack Problem Statement 2 — Empowering Artisans  
**Team:** 3 developers  
**Build constraint:** 5-hour hackathon implementation window  
**Delivery model:** V1 complete core workflow first; V2 optional enhancement layer only after V1 is stable.

---

# 0. PROJECT CONSTITUTION

VISART is a focused solution for one problem:

> **An artisan should be able to become digitally visible without having to become digitally fluent.**

VISART is **not** a generic marketplace, social network, general AI chatbot, or cultural archive.

The product transforms:

```text
ARTISAN CRAFT
    ↓
PHOTO + A FEW FACTS
    ↓
VISART AI
    ↓
PRODUCT UNDERSTANDING
    ↓
PROFESSIONAL LISTING
    ↓
AI-ASSISTED PRICE GUIDANCE
    ↓
MARKETING CONTENT
    ↓
MULTILINGUAL REACH
    ↓
DIGITAL READINESS
    ↓
SHAREABLE PRODUCT PAGE
```

The single most important thing is that this complete workflow works.

---

# 1. VERSION STRATEGY

## V1 — CORE DIGITAL COMMERCE

V1 is the submission-critical product.

V1 must allow a user to:

1. Open VISART.
2. Start a listing.
3. Upload a craft photograph.
4. Enter a few basic product facts.
5. Ask VISART to create the listing.
6. Receive structured AI-generated product content.
7. Receive AI-assisted price guidance.
8. Receive marketing copy.
9. Receive multilingual listing content.
10. See a Digital Readiness Score.
11. Save the result.
12. Open the final product page.
13. Refresh/reopen the product and still see the saved result.

### V1 features

- Editorial landing page
- Product creation flow
- Image upload + preview
- Product facts form
- AI product understanding
- AI title
- AI short description
- AI full description
- AI category
- AI keywords
- AI tags
- AI-assisted price range
- Recommended price
- Pricing rationale
- Instagram copy
- WhatsApp copy
- Short ad copy
- Hindi translation
- Kannada translation
- Artisan/craft story from user-supplied information
- Digital Readiness Score
- Top 3 actionable improvement recommendations
- Workspace
- Final shareable product page
- Supabase persistence
- Responsive UI
- Loading/success/error states

---

# 2. VERSION 2 — INCLUSIVE DIGITAL COMMERCE

V2 begins only after V1 is complete and verified.

The narrative for V2 is:

> **V1 removes the digital-commerce barrier. V2 removes the interface and accessibility barrier.**

V2 candidates:

1. Voice-to-form
2. Voice commands
3. Text-to-speech
4. Accessibility mode
5. Larger text
6. High contrast
7. Reduced motion
8. Simplified language
9. “Explain this” AI responses
10. Voice-driven translation
11. Voice-driven regeneration
12. Read-aloud product listing

### V2 priority

If time is limited:

```text
1. Voice-to-form
2. Text-to-speech
3. Voice commands
4. Accessibility mode
5. Explainable AI
6. Other enhancements
```

Do not implement six half-working V2 features.

One polished V2 feature is better than six broken ones.

---

# 3. THREE-MEMBER MODULE OWNERSHIP

## MEMBER A — EXPERIENCE ENGINEER

### Mission

Own the visual and interaction experience of VISART.

### V1 modules

```text
A1. Global design system
A2. Landing page
A3. Product creation UI
A4. Image upload UI
A5. AI processing state
A6. Workspace UI
A7. Listing UI
A8. Pricing presentation
A9. Marketing presentation
A10. Reach/language presentation
A11. Digital Readiness presentation
A12. Product page
A13. Responsive design
A14. Motion
A15. Accessibility baseline
```

### V2 modules

```text
A16. Accessibility mode UI
A17. Font scaling
A18. High contrast
A19. Reduced motion controls
A20. Voice UI affordances
A21. Audio controls
A22. V2 visual polish
```

### Primary files

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

### Do not own

```text
lib/ai/**
app/api/**
supabase/**
lib/supabase/**
```

unless explicitly coordinated.

---

## MEMBER B — AI / INTELLIGENCE ENGINEER

### Mission

Own every AI transformation.

### V1 modules

```text
B1. Gemini client
B2. AI request schema
B3. Product understanding
B4. Listing generation
B5. Pricing recommendation
B6. Marketing generation
B7. Translation
B8. Story generation
B9. Digital Readiness Score
B10. AI validation
B11. AI retry/error handling
```

### V2 modules

```text
B12. Speech intent extraction
B13. Voice-to-form extraction
B14. Voice command interpreter
B15. “Make shorter” command
B16. “Translate” command
B17. “Regenerate” command
B18. “Explain this” command
```

### Primary files

```text
app/api/**
lib/ai/**
lib/validation/**
types/**
```

### Do not own

```text
app/globals.css
components/landing/**
components/create/**
```

unless explicitly coordinated.

---

## MEMBER C — PLATFORM / DATA ENGINEER

### Mission

Own persistence, storage, product retrieval, integration reliability, and platform-level V2 capabilities.

### V1 modules

```text
C1. Supabase project
C2. Database schema
C3. Storage bucket
C4. Image persistence
C5. Artisan persistence
C6. Product persistence
C7. Product retrieval
C8. Product page data loading
C9. Seed/demo data
C10. Integration testing
C11. Build/deployment verification
```

### V2 modules

```text
C12. Text-to-speech integration
C13. Audio state/persistence
C14. Accessibility preferences
C15. Voice/audio integration support
C16. V2 integration testing
```

### Primary files

```text
lib/supabase/**
supabase/**
components/workspace/**
components/product/**
app/workspace/**
app/product/**
```

---

# 4. SHARED CONTRACTS

The three members must agree on these before parallel implementation:

```text
1. Route names
2. AI response shape
3. Product data shape
4. Database shape
5. Design tokens
6. Environment variable names
7. Error response shape
```

No member should invent a contract independently.

---

# 5. CANONICAL ROUTES

```text
/
 /create
 /workspace
 /product/[id]
```

API:

```text
/api/generate
```

Optional V2 API routes:

```text
/api/voice/intent
/api/voice/extract
```

Only create extra routes when required.

---

# 6. CANONICAL AI RESPONSE

```ts
type VisartGeneration = {
  product: {
    title: string;
    shortDescription: string;
    description: string;
    category: string;
    material: string;
    craftTechnique: string;
    keywords: string[];
    tags: string[];
  };

  pricing: {
    currency: "INR";
    min: number;
    recommended: number;
    max: number;
    rationale: string[];
    disclaimer: string;
  };

  marketing: {
    instagram: string;
    whatsapp: string;
    shortAd: string;
  };

  translations: {
    hindi: {
      title: string;
      description: string;
    };
    kannada: {
      title: string;
      description: string;
    };
  };

  story: {
    title: string;
    body: string;
  };

  readiness: {
    overall: number;
    photography: number;
    description: number;
    discoverability: number;
    pricingPresentation: number;
    marketing: number;
    topActions: string[];
  };
};
```

The implementation may split AI calls, but the UI/data contract must normalize to this shape.

---

# 7. V1 IMPLEMENTATION PHASES

## Phase 0 — Foundation

All three members:

- inspect repository
- read plan.md
- read rules.md
- read website-prompt.md
- inspect Git state
- install exact dependencies
- create environment files
- verify dev server
- agree contracts

No feature work until foundation is healthy.

---

## Phase 1 — Parallel foundations

### Member A

Build:

- global CSS
- fonts
- tokens
- navbar
- landing shell
- create shell

### Member B

Build:

- Gemini client
- Zod schemas
- AI prompt modules
- `/api/generate`
- mocked fallback response for frontend integration if needed

### Member C

Build:

- Supabase client
- schema
- storage
- repository helpers
- seed data

---

## Phase 2 — Core workflow

### Member A

Build:

- image upload UI
- product form
- processing animation
- workspace shell

### Member B

Build:

- product analysis
- listing generation
- pricing
- marketing
- translation
- readiness

### Member C

Build:

- save generation
- load generation
- workspace data
- product route
- product page data

---

## Phase 3 — Integration

All three stop creating new architecture.

Test:

```text
Create
→ upload
→ generate
→ validate
→ save
→ workspace
→ product page
→ refresh
→ reopen
```

Fix integration defects.

---

## Phase 4 — V1 freeze

Once the core flow works:

> **NO NEW V1 FEATURES.**

Only:

- bug fixes
- responsive fixes
- AI reliability
- visual polish
- accessibility baseline
- performance
- demo hardening

---

# 8. V2 IMPLEMENTATION PHASES

Only start after V1 passes.

### Member A

Accessibility UI:

- larger text
- contrast
- reduced motion
- audio controls
- voice affordances

### Member B

Voice intelligence:

- speech-to-text result interpretation
- intent classification
- voice-to-form extraction
- commands

### Member C

Audio/platform:

- text-to-speech
- accessibility preferences
- audio state
- integration

---

# 9. FIVE-HOUR TIMEBOX

```text
00:00–00:20
Foundation

00:20–01:20
Parallel module foundations

01:20–02:20
Core V1 implementation

02:20–03:20
V1 integration

03:20
V1 feature freeze

03:20–04:00
V1 polish + reliability

04:00–04:30
V2 highest-priority enhancement

04:30–05:00
Final testing + deployment + demo
```

If V1 is not stable at 4:00:

> Abandon V2 and finish V1.

---

# 10. DEFINITION OF DONE

V1 is done only when:

- [ ] Landing works
- [ ] Create flow works
- [ ] Image preview works
- [ ] Image upload works
- [ ] AI generation works
- [ ] AI output validates
- [ ] Listing renders
- [ ] Pricing renders
- [ ] Marketing renders
- [ ] Translation renders
- [ ] Readiness score renders
- [ ] Product saves
- [ ] Product reloads
- [ ] Product page works
- [ ] Mobile works
- [ ] Loading state works
- [ ] Error state works
- [ ] Build passes
- [ ] Demo works three consecutive times

---

# 11. FINAL DEMO

Opening:

> “An artisan shouldn't have to become digitally fluent to become digitally visible.”

Then:

```text
Photo
+
few facts
↓
VISART
↓
listing
↓
price
↓
marketing
↓
languages
↓
readiness
↓
product page
```

Closing:

> “We don't replace the artisan's craft. We remove the digital barrier between that craft and its customer.”

---

# 12. DESIGN CANON

VISART must look like:

```text
Editorial Craft Studio
```

Not:

```text
Generic AI SaaS
```

Use:

- warm paper-like neutral
- deep ink
- restrained indigo
- terracotta accent
- brass detail
- editorial serif
- readable sans
- large product imagery
- generous whitespace
- precise grid
- subtle Motion

Avoid:

- purple AI gradients
- blue/purple SaaS cards
- glassmorphism
- glowing borders
- floating blobs
- excessive pills
- excessive rounded cards
- emoji-heavy UI
- meaningless animation

---

# 13. REQUIRED SKILLS

Install/use:

```bash
npx skills add https://github.com/pbakaus/impeccable --skill impeccable
npx skills add https://github.com/214140846/skills --skill frontend-design
npx skills add https://github.com/mindrally/skills --skill framer-motion
```

Use `impeccable` for critique/polish and the frontend-design skill for implementation discipline.

Use Motion through:

```ts
import { motion, AnimatePresence } from "motion/react";
```

---

# 14. FINAL ENGINEERING PRINCIPLE

The team is optimizing for:

```text
ONE USER
ONE PROBLEM
ONE COMPLETE WORKFLOW
ONE MEMORABLE AI TRANSFORMATION
```

A polished complete V1 beats a feature-heavy incomplete application.

V2 is an enhancement layer, not a second product.

============================================================
END plan.md
============================================================

============================================================
BEGIN rules.md
============================================================

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

Use the design canon from `website-prompt.md`.

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

============================================================
END rules.md
============================================================

============================================================
BEGIN website-prompt.md
============================================================

# VISART — Master Website & UI Build Specification

This is the visual and interaction contract.

The implementation must be specific, intentional, and production-like.

---

# 1. ROLE OF THE AGENT

Act as:

- principal product designer
- senior Next.js engineer
- interaction designer
- AI product engineer
- accessibility-aware frontend engineer

Do not create a generic startup template.

Do not create a moodboard.

Build a real working product.

---

# 2. PRODUCT

```text
VISART
Your craft. Digitally understood.
```

Core sentence:

> Show VISART what you make. We'll help turn it into a market-ready digital story.

---

# 3. DESIGN DIRECTION

## Editorial Craft Studio

Think:

- contemporary Indian craft catalogue
- museum shop
- independent design journal
- tactile paper
- natural material
- documentary photography
- quiet luxury
- precise editorial grid

Do not think:

- AI SaaS dashboard
- crypto landing page
- generic startup template
- glassmorphism dashboard
- gradient-heavy AI product

---

# 4. COLORS

```css
:root {
  --background: #F5F0E8;
  --surface: #FBF8F2;
  --ink: #1E211F;
  --muted-ink: #68655F;
  --deep-indigo: #27344A;
  --terracotta: #B85C43;
  --brass: #A88752;
  --line: #D8D0C4;
  --success: #54745A;
  --danger: #A34F4F;
}
```

Do not introduce arbitrary colors.

No primary gradients.

---

# 5. TYPOGRAPHY

Display:

```text
Playfair Display
```

UI/body:

```text
Inter
```

Hero:

```text
clamp(3.5rem, 8vw, 7.5rem)
```

Use strong hierarchy and generous line-height.

---

# 6. ICONS

Use Lucide React.

Use icons only when they clarify.

No emoji-heavy interface.

---

# 7. MOTION

Use:

```ts
import { motion, AnimatePresence } from "motion/react";
```

Motion should communicate:

- state
- progress
- transformation
- result
- focus

Do not animate everything.

---

# 8. LANDING PAGE

Hero:

```text
YOUR CRAFT.
DIGITALLY UNDERSTOOD.
```

Supporting:

```text
Show VISART what you make.
We'll help turn it into a market-ready digital story.
```

Primary:

```text
Create my listing
```

Secondary:

```text
See how it works
```

Right side:

A large, high-quality craft/product image.

The image should be visually dominant.

---

# 9. PROBLEM SECTION

Heading:

```text
You know your craft.
You shouldn't have to learn the internet.
```

Three concepts:

```text
Writing
Turn simple product facts into a professional listing.

Pricing
Get transparent AI-assisted price guidance.

Reach
Prepare customer-ready content across languages.
```

Do not use three generic SaaS cards.

Use an editorial layout.

---

# 10. TRANSFORMATION SECTION

Show:

```text
A photograph
+
a few facts
↓
VISART
↓
a complete digital listing
```

Before:

```text
Bamboo basket
₹450 cost
2 days
Assam
```

After:

```text
Handcrafted Assamese Bamboo Basket

Professional description
AI-assisted price
Search keywords
Marketing copy
Hindi version
Kannada version
Digital Readiness: 82
```

---

# 11. CREATE PAGE

Heading:

```text
Create your listing
```

Subheading:

```text
Give us the basics.
VISART will handle the digital work.
```

Fields:

```text
Product name (optional)
Material
Production cost
Time required
Location
What makes this product special? (optional)
```

Image area:

```text
Drop your product photo here
or choose a photo

JPG, PNG or WebP · up to 8 MB
```

Primary button:

```text
Create my listing
```

Do not say:

```text
Generate AI
```

---

# 12. AI PROCESSING

Do not use a generic spinner.

Show:

```text
01 Looking at your product
02 Understanding the craft
03 Writing the listing
04 Preparing pricing guidance
05 Preparing customer-ready content
```

Animate state transitions with Motion.

Then transition into the workspace.

---

# 13. WORKSPACE

Header:

```text
Your listing is ready.
```

Product summary:

```text
[IMAGE]
Handwoven Bamboo Basket
Assam · Bamboo · Handmade
```

Readiness:

```text
82 / 100
Digital Readiness
```

Tabs:

```text
LISTING
PRICING
MARKETING
REACH
```

---

# 14. LISTING TAB

Show:

- title
- short description
- full description
- keywords
- tags

Actions:

```text
Edit
Copy
Regenerate
```

---

# 15. PRICING TAB

Show:

```text
AI-assisted price guidance

₹899 — ₹1,099

Recommended
₹999
```

Rationale:

```text
Material cost
Labour/time
Production complexity
```

Disclaimer:

```text
AI-assisted estimate based on the information you provided.
```

Never call it a guaranteed market price.

---

# 16. MARKETING TAB

Show:

```text
Instagram
```

and:

```text
WhatsApp
```

Each contains specific usable copy.

Actions:

```text
Copy
Regenerate
```

Avoid generic marketing jargon.

---

# 17. REACH TAB

Languages:

```text
English
Hindi
Kannada
```

Use a clean segmented control.

Display translated title and description.

---

# 18. DIGITAL READINESS

Show:

```text
DIGITAL READINESS

82 / 100
```

Breakdown:

```text
Photography       63
Description       91
Discoverability   77
Pricing            81
Marketing         86
```

Then:

```text
YOUR NEXT THREE MOVES

01 Improve the main product photograph.
02 Add “handwoven bamboo basket” as a search phrase.
03 Add one specific detail about the artisan's process.
```

Recommendations must be concrete.

---

# 19. PRODUCT PAGE

Make it feel like a premium craft catalogue.

Above fold:

```text
Large product image

Handcrafted Assamese Bamboo Basket
₹999

Bamboo
Handmade
Assam

Contact artisan
Share
```

Below:

```text
About the product
The artisan's story
Product details
Available languages
```

---

# 20. MOBILE

Target:

```text
360px+
768px+
1280px+
```

At 360px:

- one-column forms
- stacked hero
- large image
- readable typography
- no horizontal overflow
- accessible CTA
- tabs may horizontally scroll
- preserve whitespace

Do not merely shrink desktop.

---

# 21. ACCESSIBILITY BASELINE

V1:

- semantic HTML
- labels
- alt text
- keyboard navigation
- visible focus
- contrast
- reduced motion
- accessible errors
- touch-friendly controls

V2:

- accessibility mode
- larger text
- high contrast
- text-to-speech
- voice input
- voice commands

---

# 22. COPY STYLE

Voice:

```text
calm
direct
respectful
specific
human
```

Avoid:

```text
Revolutionize
Unlock
Next-generation
Seamless AI-powered transformation
```

Prefer:

```text
Show us what you make.
We'll handle the digital work.
```

---

# 23. DEMO DATA

Use:

```text
Product:
Handwoven Bamboo Basket

Material:
Bamboo

Production cost:
₹450

Time:
2 days

Location:
Assam

Story:
A weaving technique taught within the artisan's family.
```

Do not invent historical claims.

---

# 24. FINAL USER JOURNEY

Must work:

```text
Landing
↓
Create listing
↓
Upload
↓
Enter facts
↓
Create my listing
↓
AI processing
↓
Listing
↓
Pricing
↓
Marketing
↓
Reach
↓
Readiness
↓
Save
↓
Product page
↓
Refresh
↓
Still available
```

This is the canonical product experience.

============================================================
END website-prompt.md
============================================================

============================================================
BEGIN stack.md
============================================================

# VISART — Exact Technology Stack & Environment

## Runtime

```text
Node.js 24.18.0 LTS
npm 11.x
```

## Application

```text
Next.js 16.2.12
React 19.2.7
React DOM 19.2.7
TypeScript 5.9.2
```

## Styling

```text
Tailwind CSS 4.3.3
```

## Motion

```text
motion 12.43.0
```

React import:

```ts
import { motion, AnimatePresence } from "motion/react";
```

Do not use the old import path in new code.

## UI utilities

```text
lucide-react 1.28.0
```

## Validation

```text
zod 4.4.3
```

## Backend/data

```text
Supabase Postgres — hosted
@supabase/supabase-js 2.111.0
```

## AI

```text
@google/genai 2.15.0
```

Do not use `@google/generative-ai`.

## Linting

```text
ESLint 10.8.0
```

## Deployment

```text
Vercel
```

---

# INSTALLATION

Use exact versions:

```bash
npm install next@16.2.12 react@19.2.7 react-dom@19.2.7 motion@12.43.0 lucide-react@1.28.0 zod@4.4.3 @supabase/supabase-js@2.111.0 @google/genai@2.15.0
npm install -D typescript@5.9.2 eslint@10.8.0 tailwindcss@4.3.3
```

Never use `@latest` during the hackathon.

After `package-lock.json` exists:

```bash
npm ci
```

---

# SKILLS.SH

Install:

```bash
npx skills add https://github.com/pbakaus/impeccable --skill impeccable
npx skills add https://github.com/214140846/skills --skill frontend-design
npx skills add https://github.com/mindrally/skills --skill framer-motion
```

Use:

```text
impeccable
```

for:

- design critique
- visual polish
- typography
- spacing
- responsive refinement
- accessibility review

Use:

```text
frontend-design
```

for:

- frontend implementation discipline
- visual hierarchy
- avoiding generic AI UI

Use:

```text
framer-motion / Motion skill
```

for:

- state transitions
- micro-interactions
- AI processing
- result reveal

---

# ENVIRONMENT VARIABLES

Create:

```text
.env.local
```

with:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
GEMINI_API_KEY=
```

Never commit `.env.local`.

Create `.env.example` containing names only.

---

# REPOSITORY STRUCTURE

```text
Visart/
├── .git/
├── app/
│   ├── page.tsx
│   ├── create/
│   │   └── page.tsx
│   ├── workspace/
│   │   └── page.tsx
│   ├── product/
│   │   └── [id]/
│   │       └── page.tsx
│   ├── api/
│   │   └── generate/
│   │       └── route.ts
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── landing/
│   ├── create/
│   ├── workspace/
│   ├── product/
│   ├── brand/
│   ├── ui/
│   └── motion/
├── lib/
│   ├── ai/
│   ├── supabase/
│   ├── validation/
│   └── utils/
├── types/
├── public/
│   ├── demo/
│   └── textures/
├── supabase/
│   └── schema.sql
├── plan.md
├── rules.md
├── website-prompt.md
├── stack.md
├── SESSION_LOG.md
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

---

# GIT BRANCHES

Foundation:

```text
feat/project-foundation
```

Member A:

```text
feat/member-a-experience
```

Member B:

```text
feat/member-b-ai
```

Member C:

```text
feat/member-c-platform
```

V2 branches may be:

```text
feat/v2-accessibility
feat/v2-voice
feat/v2-audio
```

---

# COMMANDS

```bash
git status
git branch
git pull
npm install
npm run dev
npm run lint
npm run build
git diff
git log --oneline -5
```

Before final submission:

```bash
npm run lint
npm run build
```

Then test the browser workflow manually.

============================================================
END stack.md
============================================================

# FINAL INSTRUCTION TO THE AGENT

You are now authorized to start implementation.

Do not create a new repository.

Do not clone again.

Do not wait for another product specification.

Inspect the existing repository first.

Then establish the foundation.

Then implement V1.

Then verify V1.

Only then consider V2.

When you finish the first task, return the required status/handoff format and update SESSION_LOG.md.