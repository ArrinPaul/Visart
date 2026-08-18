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