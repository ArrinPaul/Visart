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