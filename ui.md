# VISART — UI & EXPERIENCE CONSTITUTION

## 0. Purpose

This document is the permanent visual source of truth for VISART.

Any future AI agent, developer, or contributor must read this document before creating or significantly modifying frontend UI.

The purpose is to preserve:

- visual identity
- typography
- spacing
- colors
- component language
- interaction patterns
- motion language
- accessibility expectations
- responsive behavior
- content tone
- image treatment
- editorial character

The UI must evolve without losing VISART's identity.

If a future implementation conflicts with this document, this document takes precedence unless the human developer explicitly approves a change.

============================================================
## 1. VISART DESIGN IDENTITY
============================================================

VISART is:

EDITORIAL CRAFT STUDIO

Visual references:

- contemporary Indian craft catalogue
- museum shop
- independent design journal
- premium craft publication
- tactile paper
- documentary photography
- quiet luxury
- editorial typography
- natural materials
- restrained technology

The product should feel:

- human
- warm
- thoughtful
- premium
- calm
- tactile
- editorial
- trustworthy
- culturally respectful

The product must NOT feel:

- generic SaaS
- generic AI dashboard
- crypto interface
- enterprise admin panel
- social media clone
- marketplace clone
- futuristic AI lab
- gaming UI
- template-generated startup landing page

============================================================
## 2. THE CORE VISUAL PRINCIPLE
============================================================

VISART should look intentionally designed.

The interface should communicate:

"Technology is helping the artisan,
not replacing the artisan."

Technology should remain visually quiet.

Craft should remain visually important.

Prefer:

content
+
photography
+
typography
+
whitespace
+
subtle interaction

over:

decorations
+
gradients
+
effects
+
floating cards

============================================================
## 3. COLOR SYSTEM
============================================================

Use the established VISART palette.

Background:

#F5F0E8

Surface:

#FBF8F2

Ink:

#1E211F

Muted Ink:

#68655F

Deep Indigo:

#27344A

Terracotta:

#B85C43

Brass:

#A88752

Line:

#D8D0C4

Success:

#54745A

Danger:

#A34F4F

Do not casually introduce new colors.

If a new color is genuinely required:

1. check whether an existing token can be reused
2. prefer an existing token
3. if a new token is necessary, document why
4. keep it visually compatible with the established palette

Do NOT introduce:

- purple AI gradients
- neon colors
- glowing blue
- cyberpunk colors
- arbitrary rainbow accents

============================================================
## 4. COLOR USAGE
============================================================

Background:

Use #F5F0E8 as the primary page canvas.

Surface:

Use #FBF8F2 for elevated sections, forms, panels, and important content groupings.

Ink:

Use #1E211F for primary typography.

Muted ink:

Use #68655F for supporting text and secondary metadata.

Deep indigo:

Use #27344A for important interactive emphasis where appropriate.

Terracotta:

Use #B85C43 sparingly for primary accent moments.

Brass:

Use #A88752 for subtle premium/editorial accents.

Line:

Use #D8D0C4 for borders and dividers.

Success:

Use #54745A for positive states.

Danger:

Use #A34F4F for errors and destructive states.

Never use color merely because it looks decorative.

Color must communicate hierarchy or meaning.

============================================================
## 5. TYPOGRAPHY
============================================================

Primary display font:

Playfair Display

Primary UI/body font:

Inter

Use typography as a major part of VISART's identity.

Display typography should feel editorial.

Body typography should remain extremely readable.

Use:

- strong hierarchy
- generous line-height
- restrained weights
- controlled line length
- intentional text wrapping

Do NOT use:

- excessive bold text
- oversized text everywhere
- five different font families
- decorative fonts for UI
- all-caps everywhere

Suggested hierarchy:

Display:
large editorial heading

Heading:
section-level heading

Subheading:
supporting context

Body:
comfortable reading size

Metadata:
small but legible

Labels:
clear and restrained

Typography should create rhythm.

============================================================
## 6. HEADLINE STYLE
============================================================

Headlines should be:

- confident
- editorial
- concise
- human
- specific

Example:

YOUR CRAFT.
DIGITALLY UNDERSTOOD.

Good.

Avoid:

"Unlock the Future of Artisan Commerce"

"Revolutionize Your Craft Business With AI"

"Empowering Artisans Through Next-Generation AI"

VISART does not speak like generic startup marketing.

============================================================
## 7. SPACING
============================================================

Whitespace is a core visual element.

Prefer generous spacing.

Do not compress sections simply to fit more content.

Use consistent spacing tokens.

Large spacing should separate major ideas.

Medium spacing should separate related content.

Small spacing should connect labels and their values.

Avoid:

- cramped forms
- dense dashboards
- excessive card padding
- inconsistent gaps

The page should breathe.

============================================================
## 8. LAYOUT
============================================================

Prefer editorial layouts.

Use:

- asymmetry where appropriate
- strong alignment
- large imagery
- controlled grids
- generous margins
- intentional whitespace

Avoid:

- everything centered
- everything inside cards
- repetitive 3-column SaaS layouts
- endless rounded containers
- dashboard grids everywhere

The layout should feel composed rather than assembled.

============================================================
## 9. CARDS
============================================================

Cards are allowed.

Cards are NOT the default container for every piece of information.

Use a card when it provides meaningful grouping.

Do not create:

Card
Card
Card
Card
Card

for every section.

Prefer editorial grouping using:

- whitespace
- dividers
- typography
- alignment
- subtle surfaces

Cards should feel calm and tactile.

============================================================
## 10. BORDERS & DIVIDERS
============================================================

Use the Line token:

#D8D0C4

Borders should be subtle.

Avoid heavy borders.

Use dividers to create rhythm rather than visual noise.

Prefer:

1px subtle lines

over:

thick decorative borders.

============================================================
## 11. BORDER RADIUS
============================================================

Use restrained corner radii.

Do NOT make every component a pill.

Do NOT use giant rounded cards.

Buttons may have modest rounding.

Inputs may have modest rounding.

Large image containers may use restrained rounding where appropriate.

The overall language should feel tactile and editorial rather than bubbly.

============================================================
## 12. BUTTONS
============================================================

Buttons must be:

- obvious
- readable
- accessible
- purposeful
- tactile

Primary action:

Create my listing

Secondary actions:

See how it works
Edit
Copy
Regenerate
Save listing
View product

Do not use vague labels such as:

Click here

Magic

AI it

Make it better

Buttons should describe the action.

Primary buttons should visually stand out without looking like generic SaaS CTAs.

============================================================
## 13. FORMS
============================================================

Forms must feel calm and approachable.

Every input requires:

- visible label
- clear focus state
- appropriate validation
- understandable error messaging

Do NOT rely exclusively on placeholders.

Preferred structure:

LABEL

Input

Helper text

Validation

Avoid enterprise-style dense forms.

Group related information.

Example:

ABOUT THE PRODUCT

Material
Production cost
Time required
Location

THE STORY

What makes this product special?

============================================================
## 14. IMAGE UPLOAD
============================================================

The uploader is a major interaction.

States:

EMPTY

DRAGGING

VALIDATING

PREVIEW

UPLOADING

READY

ERROR

Each state must be visually understandable.

The uploader should feel like part of the product experience, not a browser file input.

Use:

- clear drop area
- image preview
- filename where useful
- upload progress where relevant
- human-readable errors

Do not show technical errors.

Bad:

"ERR_FILE_SIZE_LIMIT"

Good:

"This image is too large.
Please choose an image under 8 MB."

============================================================
## 15. PRODUCT PHOTOGRAPHY
============================================================

Photography is extremely important to VISART.

Product imagery should feel:

- documentary
- tactile
- authentic
- warm
- detailed
- material-focused

Prefer large images.

Avoid:

- generic stock photos
- fake AI-looking artisan images
- excessive filters
- unnecessary overlays
- excessive decorative frames

The product should remain the visual hero.

============================================================
## 16. AI PROCESSING EXPERIENCE
============================================================

Never use a generic:

"Loading..."

for the core generation process.

Instead communicate meaningful stages:

01 Looking at your product

02 Understanding the craft

03 Writing the listing

04 Preparing pricing guidance

05 Preparing customer-ready content

Motion should make these stages feel intentional.

The processing screen should communicate transformation.

The user should understand:

VISART is doing the digital work.

============================================================
## 17. WORKSPACE
============================================================

The workspace is not a generic dashboard.

It is an editorial workbench.

Primary sections:

LISTING

PRICING

MARKETING

REACH

READINESS

Use clear hierarchy.

Do not overwhelm the user with metrics.

The workspace should feel:

- organized
- calm
- useful
- actionable

The product remains the focus.

============================================================
## 18. LISTING UI
============================================================

Listing content should prioritize readability.

Hierarchy:

Product title

Short description

Full description

Story

Keywords

Tags

Actions

Actions such as:

Edit
Copy
Regenerate

should remain secondary to the content itself.

============================================================
## 19. PRICING UI
============================================================

Pricing must visually communicate:

GUIDANCE

not:

GUARANTEE

Show:

Price range

Recommended price

Rationale

Disclaimer

Example:

₹899–₹1,099

Recommended:

₹999

Use restrained visual emphasis.

Do not make pricing look like a financial guarantee.

============================================================
## 20. MARKETING UI
============================================================

Marketing content should be copy-ready.

Supported outputs:

Instagram

WhatsApp

Short advertisement

Provide:

Copy

Copy button

Regenerate where appropriate

Do not create complex marketing editors for V1.

============================================================
## 21. REACH / LANGUAGE UI
============================================================

Languages:

English

Hindi

Kannada

Language switching should be simple.

Avoid giant language cards.

Prefer:

tabs
segmented controls
compact selectors

The translated content should remain the focus.

============================================================
## 22. DIGITAL READINESS UI
============================================================

Digital Readiness:

Overall score

Photography

Description

Discoverability

Pricing

Marketing

Then:

YOUR NEXT THREE MOVES

Recommendations should be specific and actionable.

Avoid excessive gamification.

The score should help the artisan understand what to improve.

============================================================
## 23. PRODUCT PAGE
============================================================

The product page should feel like a premium craft catalogue.

Above the fold:

Large product image

Product title

Price

Material

Origin/location

Handmade indicator

Contact artisan

Share

Below:

About the product

Artisan story

Product details

Languages

Do NOT create:

checkout
cart
payment
marketplace complexity

V1 is about digital readiness and presentation.

============================================================
## 24. NAVIGATION
============================================================

Navigation must remain simple.

Primary navigation:

How it works

Why VISART

Create my listing

Do not create excessive navigation.

The product should guide users toward the core workflow.

============================================================
## 25. MOTION PRINCIPLES
============================================================

Use Motion through:

motion/react

Motion should communicate:

- transition
- progress
- hierarchy
- feedback
- transformation

Good examples:

- page transitions
- image reveal
- processing stage transitions
- result reveal
- subtle hover feedback
- tab transitions
- score animation

Avoid:

- decorative floating elements
- random bouncing
- excessive parallax
- infinite motion
- unnecessary 3D effects
- animated backgrounds
- excessive springs

Motion should feel:

quiet
intentional
editorial

============================================================
## 26. REDUCED MOTION
============================================================

Respect:

prefers-reduced-motion

When reduced motion is enabled:

- reduce transitions
- remove decorative movement
- avoid large transforms
- preserve functionality
- keep state changes understandable

Never make animation required to understand the UI.

============================================================
## 27. ACCESSIBILITY
============================================================

Accessibility is part of the design system.

Required:

- semantic HTML
- labels
- alt text
- keyboard navigation
- visible focus
- sufficient contrast
- accessible errors
- touch-friendly targets
- reduced motion support

Do not hide focus indicators.

Do not communicate information through color alone.

============================================================
## 28. RESPONSIVE DESIGN
============================================================

Required target widths:

360px

768px

1280px

Mobile is not merely a smaller desktop.

At mobile:

- stack content
- preserve image quality
- simplify complex compositions
- prevent horizontal overflow
- keep controls reachable
- maintain readable typography
- make tabs scrollable when required

At desktop:

use editorial split layouts and generous whitespace.

============================================================
## 29. MOBILE TAB BEHAVIOR
============================================================

Workspace tabs:

LISTING
PRICING
MARKETING
REACH
READINESS

On narrow screens:

- allow horizontal scrolling if necessary
- keep tab labels readable
- indicate active tab clearly
- prevent page-level horizontal overflow

Do not shrink text until it becomes unreadable.

============================================================
## 30. RESPONSIVE TYPOGRAPHY
============================================================

Typography must scale naturally.

Prefer:

clamp()

for large responsive headings.

Avoid:

hardcoded huge desktop sizes that overflow mobile.

Check:

360px

390px

768px

1280px

============================================================
## 31. CONTENT TONE
============================================================

VISART speaks:

clearly
warmly
respectfully
confidently
simply

Avoid corporate jargon.

Avoid AI buzzwords.

Avoid exaggerated promises.

Never say:

"revolutionize"

"unlock"

"seamlessly"

"next-generation"

"game-changing"

"AI-powered transformation"

unless specifically required.

Prefer:

"Show us what you make."

"We'll handle the digital work."

"Your listing is ready."

"Here's what you can improve next."

============================================================
## 32. CULTURAL RESPECT
============================================================

Never invent:

- artisan heritage
- family history
- community identity
- certifications
- awards
- GI status
- geographic claims
- historical claims

unless supplied by the user or verified through the actual product data.

Do not use stereotypes.

Do not make Indian craft a decorative theme.

The craft is the subject.

============================================================
## 33. ICONOGRAPHY
============================================================

Use:

Lucide React

Icons should communicate actions or status.

Do not use emoji as primary UI elements.

Avoid:

🔥
✨
🚀
🤖

as UI decoration.

Use meaningful icons with accessible labels.

============================================================
## 34. EMPTY STATES
============================================================

Empty states should explain:

What is missing

Why it matters

What the user should do

Example:

"No product image yet.

Add a clear photo of your craft so VISART can understand what you're making."

Avoid:

"No data."

============================================================
## 35. ERROR STATES
============================================================

Errors must be human-readable.

Bad:

500 Internal Server Error

JSON parse error

ECONNRESET

Good:

"We couldn't create your listing.

Please try again."

When appropriate:

[Try again]

Never expose internal implementation details.

============================================================
## 36. LOADING STATES
============================================================

Every asynchronous interaction needs a meaningful state.

Use:

Loading

Processing

Saving

Generating

Uploading

Do not leave the interface apparently frozen.

============================================================
## 37. SUCCESS STATES
============================================================

Success should be clear but restrained.

Examples:

"Your listing is ready."

"Saved successfully."

"Copied."

Avoid:

"🔥 AWESOME!!!"

"AI MAGIC COMPLETE!"

============================================================
## 38. COMPONENT CONSISTENCY
============================================================

If a component already exists:

USE IT.

Do not create a second button system.

Do not create a second input style.

Do not create a second tab component.

Do not create a second badge system.

Before creating a new UI component:

1. search components/ui
2. search existing usage
3. determine whether an existing component can be reused
4. only create a new component if necessary

============================================================
## 39. DESIGN TOKEN CONSISTENCY
============================================================

Do not scatter raw colors throughout components.

Prefer centralized design tokens.

Bad:

color: #B85C43

repeated in 20 files.

Good:

var(--terracotta)

or the project's established token system.

The same applies to:

- spacing
- typography
- borders
- radii
- shadows

============================================================
## 40. SHADOWS
============================================================

Use shadows sparingly.

VISART should not look like a floating SaaS dashboard.

Prefer subtle depth.

Avoid:

- giant shadows
- glowing shadows
- colored shadows
- excessive elevation

============================================================
## 41. GRADIENTS
============================================================

Gradients are NOT part of the default VISART design language.

Do not introduce gradients unless explicitly approved.

Especially avoid:

purple → blue AI gradients

pink → purple startup gradients

neon gradients

============================================================
## 42. GLASSMORPHISM
============================================================

Do not use glassmorphism as a default visual technique.

Avoid:

backdrop blur cards

transparent floating panels

frosted glass dashboards

VISART is tactile and editorial, not futuristic.

============================================================
## 43. DECORATIVE EFFECTS
============================================================

Avoid:

- particle effects
- glowing blobs
- animated backgrounds
- cursor trails
- excessive parallax
- 3D floating objects
- random decorative shapes

Every visual element must justify its existence.

============================================================
## 44. AI SLOP PREVENTION
============================================================

The following are considered visual failures:

- generic purple AI landing page
- excessive rounded cards
- huge gradient hero
- generic robot imagery
- emoji-based feature sections
- excessive glassmorphism
- meaningless dashboard charts
- random floating decorations
- "AI Magic" buttons
- buzzword-heavy copy
- excessive animations
- template-looking layouts

If a design starts looking like a generic AI SaaS product:

STOP.

Return to:

Editorial Craft Studio.

============================================================
## 45. V1 DESIGN PRIORITIES
============================================================

V1 priorities:

1. Clear workflow
2. Product photography
3. Typography
4. Readability
5. Trust
6. Responsive layout
7. Accessibility baseline
8. Subtle motion
9. Visual polish

Do not sacrifice the core workflow for decoration.

============================================================
## 46. V2 DESIGN DIRECTION
============================================================

V2 may introduce:

- accessibility mode
- text scaling
- high contrast
- reduced motion toggle
- text-to-speech controls
- voice UI
- voice command feedback
- additional interaction polish

V2 must extend the existing design system.

It must NOT introduce an entirely new visual language.

============================================================
## 47. FUTURE FEATURE RULE
============================================================

Before adding a new feature, ask:

1. Does it help the artisan?
2. Does it support the core VISART workflow?
3. Does it fit the Editorial Craft Studio identity?
4. Does it reuse existing design tokens?
5. Does it reuse existing components?
6. Does it work on mobile?
7. Is it accessible?
8. Does it introduce unnecessary complexity?

If the answer is no to multiple questions:

Do not add the feature without human approval.

============================================================
## 48. UI REVIEW CHECKLIST
============================================================

Before considering a UI task complete:

### Visual

[ ] Correct colors

[ ] Correct typography

[ ] Correct spacing

[ ] Correct hierarchy

[ ] No unnecessary cards

[ ] No generic AI styling

[ ] No accidental gradients

[ ] No excessive rounded elements

[ ] Photography is prominent

### Interaction

[ ] Buttons work

[ ] Forms work

[ ] Loading state exists

[ ] Error state exists

[ ] Success state exists

[ ] Copy actions work

[ ] Navigation works

### Accessibility

[ ] Keyboard navigation works

[ ] Focus states are visible

[ ] Labels exist

[ ] Alt text exists

[ ] Contrast is reasonable

[ ] Reduced motion is respected

### Responsive

[ ] 360px

[ ] 768px

[ ] 1280px

[ ] No horizontal overflow

[ ] Mobile controls remain usable

### Code

[ ] Existing components reused

[ ] Design tokens reused

[ ] No duplicate UI systems

[ ] No hardcoded AI output inside presentation components

============================================================
## 49. BEFORE MODIFYING EXISTING UI
============================================================

Before changing a visual component:

1. Read ui.md.
2. Inspect the existing component.
3. Search for other usages.
4. Check existing design tokens.
5. Check whether the change affects mobile.
6. Check accessibility.
7. Check Motion/reduced-motion behavior.
8. Make the smallest coherent change.

Do not redesign an entire page for a small request.

============================================================
## 50. DESIGN DRIFT PREVENTION
============================================================

Over time, AI agents may accidentally introduce:

- new colors
- new fonts
- new radii
- new button styles
- new spacing systems
- new shadows
- new card styles
- new interaction patterns

This is design drift.

When modifying UI:

COMPARE AGAINST THIS DOCUMENT.

The latest component is not automatically the correct component.

Consistency matters more than novelty.

============================================================
## 51. HUMAN APPROVAL FOR VISUAL SYSTEM CHANGES
============================================================

The following changes require human approval:

- changing primary fonts
- changing core color palette
- introducing gradients
- introducing glassmorphism
- changing the global spacing system
- changing global radius system
- replacing the button system
- replacing the typography system
- introducing a new visual theme
- introducing a major navigation pattern
- redesigning the core workspace architecture

AI agents may propose these changes.

They must not silently implement them.

============================================================
## 52. GOLDEN RULE
============================================================

VISART should never look like it was designed by an AI.

It should look like a thoughtful product team designed a calm, premium digital workspace around real artisans and real craft.

Technology should be invisible when possible.

Craft should be visible.

The interface should feel:

QUIET.
WARM.
EDITORIAL.
USEFUL.
HUMAN.

============================================================
## 53. SOURCE OF TRUTH HIERARCHY
============================================================

For UI decisions, use this priority:

1. Explicit human instruction
2. ui.md
3. rules.md
4. website-prompt.md
5. plan.md
6. Existing established design system
7. General frontend conventions

When in doubt:

DO NOT invent a new visual direction.

Preserve the established VISART language.

============================================================
## 54. FINAL INSTRUCTION TO AI AGENTS
============================================================

Every AI agent working on VISART frontend code must remember:

You are contributing to an existing visual system.

You are NOT designing a new website from scratch every time.

Read ui.md before significant UI work.

Reuse existing components.

Reuse existing tokens.

Reuse existing patterns.

Preserve typography.

Preserve spacing.

Preserve the Editorial Craft Studio identity.

Do not introduce generic AI SaaS aesthetics.

Do not optimize for novelty.

Optimize for consistency, usability, clarity, accessibility, and craft.

============================================================
END OF VISART UI CONSTITUTION
============================================================
