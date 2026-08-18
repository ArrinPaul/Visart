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