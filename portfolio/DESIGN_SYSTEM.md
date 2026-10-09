# DESIGN_SYSTEM.md

> Global visual and layout specification for the portfolio/resume website.
> This document is the primary design authority for the project.
> Codex must follow these rules unless a section-specific specification explicitly overrides them.

---

## 0. Core principle

Codex is responsible for implementation, not visual design.

Codex must NOT:
- invent new colors;
- invent new font sizes;
- invent new spacing values;
- invent new border radii;
- invent new layout patterns;
- invent animations;
- add decorative effects;
- alter provided assets;
- replace provided fonts;
- change the intended composition because another solution is "cleaner" or "more standard";
- approximate reference layouts when exact relationships are specified.

If a required visual parameter is missing:
1. use an existing token from this document when possible;
2. otherwise preserve the current layout and flag the missing value;
3. do not create a new visual rule unless explicitly instructed.

---

# 1. Project design direction

## 1.1 Visual character

The site should feel:
- editorial;
- graphic;
- deliberate;
- minimal but not sterile;
- visually distinctive;
- image-led;
- strongly typographic;
- structured by alignment and spacing rather than decorative UI.

Avoid:
- generic SaaS styling;
- excessive rounded cards;
- glassmorphism;
- unnecessary gradients;
- random shadows;
- over-animation;
- default component-library appearance;
- visual effects that are not present in the supplied references.

## 1.2 Design hierarchy

Priority order:

1. Composition
2. Typography
3. Spacing
4. Image placement
5. Alignment
6. Color
7. Motion
8. Decorative details

Do not compensate for weak layout with visual effects.

---

# 1.3 Mandatory global color mapping

This mapping applies to the entire website and to all section specifications:

```text
Background                 #99E6FF
Accent / highlighted words #FACA2B
Primary text               #000000
Section headings           #313131
```

A section-specific file may change placement, scale or typography, but must not redefine these color roles unless the user explicitly revises the global palette.

---

# 2. Global layout system

## 2.1 Base desktop design width

Primary desktop design reference:

```text
1440px
```

The site must remain fluid above and below this width.

Do not hard-code the whole page to 1440px.

## 2.2 Main content container

Default desktop container:

```text
max-width: 1440px
margin-inline: auto
```

Default horizontal page padding:

```text
Large desktop: 48px
Desktop:       48px
Tablet:        32px
Mobile:        20px
```

Recommended implementation:

```css
.page-container {
  width: 100%;
  max-width: 1440px;
  margin-inline: auto;
  padding-inline: var(--page-padding);
}
```

Full-bleed sections may extend outside the container only when explicitly specified.

## 2.3 Global grid

### Desktop

```text
Columns: 12
Column gap: 24px
```

### Tablet

```text
Columns: 8
Column gap: 20px
```

### Mobile

```text
Columns: 4
Column gap: 16px
```

Main content should align to this grid.

Sections may use different column spans, but should not introduce an independent grid system unless explicitly documented.

## 2.4 Alignment rule

Prefer relational positioning over arbitrary coordinates.

Use:

```text
aligned to container left
aligned to container right
aligned to column 7
aligned to image edge
aligned to baseline
aligned to section bottom
```

Avoid:

```text
left: 137px
top: 412px
```

unless the element is intentionally art-directed and absolutely positioned.

---

# 3. Spacing system

All spacing should come from the shared spacing scale.

```text
--space-1:   4px
--space-2:   8px
--space-3:  12px
--space-4:  16px
--space-5:  24px
--space-6:  32px
--space-7:  40px
--space-8:  48px
--space-9:  64px
--space-10: 80px
--space-11: 96px
--space-12: 120px
--space-13: 160px
--space-14: 200px
--space-15: 240px
```

Do not introduce values such as 27px, 53px or 91px unless a section specification explicitly requires them.

## 3.1 Default spacing logic

Suggested semantic use:

```text
4–8px      micro spacing
12–16px    tightly related elements
24–32px    standard component spacing
40–48px    content groups
64–96px    large internal separation
120–160px  standard section rhythm
200–240px  intentional visual break
```

## 3.2 Grouping principle

Related items should be closer together than unrelated items.

Example:

```text
Eyebrow → Heading       8–16px
Heading → Description   16–24px
Description → Action    24–32px

Content group → Next group
48–96px
```

Do not apply the same gap to every element by default.

## 3.3 Gap vs margin

Use `gap` for spacing between children of the same Flexbox/Grid group.

Use margin primarily when spacing belongs to an individual element or separates independent blocks.

---

# 4. Typography

## 4.1 Font files

All production fonts must be stored locally in:

```text
/assets/fonts/
```

Preferred web format:

```text
.woff2
```

Do not substitute fonts without explicit approval.

## 4.2 Font roles

### Display font

```text
CSS ROLE: var(--font-display)
SOURCE FILE: /assets/fonts/arial-black/Arial-Black.woff
CUSTOM FAMILY ALIAS: "Portfolio Display"
ROLE: Display / large headings / graphic text
```

Important: use the supplied font file through the custom `@font-face` alias. Do not rely on the operating system's installed Arial / Arial Black. The supplied file currently identifies internally as Arial Bold; it is nevertheless the approved display face for the first prototype and may be swapped later without changing layout architecture.

Use for:
- oversized typography;
- "SOOOOOOOOOOO" and similar large graphic text;
- major section titles;
- large accent words.

### Body / UI font

```text
CSS ROLE: var(--font-body)
FAMILY: Cascadia Mono
REGULAR: /assets/fonts/cascadia/CascadiaMono-Regular.woff2
BOLD: /assets/fonts/cascadia/CascadiaMono-Bold.woff2
ROLE: Primary / body / UI / navigation
```

Use for:
- body text;
- navigation;
- project metadata;
- labels;
- captions;
- buttons and links;
- general interface copy.

Only the weights actually used by the final design should be loaded in production.

If only one font family is used, preserve role separation through weight, size, spacing and case.

## 4.3 Type scale

Final values should be adjusted after the real fonts are connected.

Initial system:

```text
Display XL:
clamp(96px, 13vw, 220px)

Display:
clamp(72px, 9vw, 160px)

H1:
clamp(56px, 6vw, 96px)

H2:
clamp(40px, 4.5vw, 72px)

H3:
32–40px

Body Large:
20–24px

Body:
16–18px

Small:
14px

Caption:
12px
```

Codex must reuse these roles rather than creating unique sizes for individual sections.

## 4.4 Line height

Recommended ranges:

```text
Display: 0.85–1.00
Headings: 0.95–1.15
Body: 1.40–1.60
Small/UI: 1.20–1.45
```

## 4.5 Letter spacing

Recommended ranges:

```text
Large display:
-0.01em to -0.05em

Headings:
-0.01em to -0.03em

Body:
0 to -0.01em

Uppercase labels:
0.02em to 0.08em
```

Do not add arbitrary tracking.

## 4.6 Text width

Long body copy should not span the full viewport.

Recommended body measure:

```text
max-width: 32rem–42rem
```

Exact value depends on font and section.

---

# 5. Color system

Approved global palette:

```text
--color-bg: #99E6FF
--color-accent: #FACA2B
--color-text: #000000
--color-section-heading: #313131
```

Semantic roles — mandatory across the entire website:

```text
#99E6FF
Primary global background color.
Use as the default background across the entire website.

#FACA2B
Accent color.
Use for:
- "SOOOOOOOOOOO" and related oversized graphic typography;
- selected highlighted words or short phrases;
- controlled graphic accents.

#000000
Primary text color.
Use for:
- body copy;
- navigation;
- interface text;
- captions and supporting text unless otherwise specified.

#313131
Section heading color.
Use for major block/section headings such as:
- ABOUT:
- JOURNEY:
- MADE:
- CONNECT:
```

Rules:
- this semantic color mapping is global and must be respected in every section;
- section headings use `#313131`, not `#FACA2B`;
- `#FACA2B` is reserved for accents, highlighted words/phrases and the `SOOOOOOOOOOO` graphic treatment;
- `#000000` remains the default text color;
- `#99E6FF` remains the default site background;
- do not introduce additional colors without explicit instruction;
- do not create near-duplicate shades;
- use semantic color tokens rather than hard-coded HEX values inside components.

---

# 6. Imagery and visual assets

## 6.1 Asset folders

Recommended structure:

```text
/assets/
  /fonts/
  /images/
    /hero/
    /projects/
    /about/
    /misc/
  /icons/
  /textures/
```

## 6.2 File naming

Use semantic lowercase filenames.

Good:

```text
hero-portrait.webp
project-losers-cover.webp
project-web-story-log-01.webp
ai-visual-frame-01.webp
```

Avoid:

```text
IMG_3827.png
final-final-2.jpg
Screenshot 2026-10-06.png
```

## 6.3 Image behavior

Default:

```css
img {
  display: block;
  max-width: 100%;
}
```

For cropped media:

```css
object-fit: cover;
```

Every art-directed image must define:
- aspect ratio;
- crop behavior;
- object position;
- grid span;
- max/min size when necessary.

Example:

```text
Aspect ratio: 4 / 3
Grid: columns 6–12
Object fit: cover
Object position: 50% 35%
```

## 6.4 Asset integrity

Codex must NOT:
- recolor supplied artwork;
- crop it differently unless specified;
- add filters;
- add shadows;
- add border radius;
- replace it with generated placeholders;
- change transparent backgrounds;
- edit the artwork itself.

---

# 7. Borders, radius and shadows

Default design language:

```text
Border radius:
use sparingly

Shadows:
none by default
```

Initial radius tokens:

```text
--radius-none: 0
--radius-sm: 4px
--radius-md: 8px
--radius-lg: 16px
```

Only use rounded corners when they are intentionally part of the visual language.

Avoid default "card UI" treatment.

---

# 8. Responsive system

## 8.1 Breakpoint ranges

Working ranges:

```text
Mobile:
0–767px

Tablet:
768–1023px

Laptop:
1024–1279px

Desktop:
1280–1599px

Large desktop:
1600px+
```

These are implementation guides, not rigid device categories.

If composition breaks earlier or later, use a content-driven breakpoint.

## 8.2 Responsive principle

Do not simply scale the desktop layout down.

For each section decide:

```text
What remains in place?
What changes column span?
What stacks?
What reorders?
What hides?
What becomes full width?
What changes crop?
What changes font size?
What changes spacing?
```

## 8.3 Required reference sizes

Each major section should ideally define:

```text
Desktop reference: 1440px
Mobile reference: 390px
```

Tablet behavior may be derived from explicit transition rules.

## 8.4 Fixed vs fluid sizing

Prefer fluid dimensions for layout.

Use fixed values for elements such as:
- icon dimensions;
- controlled UI targets;
- intentionally fixed decorative elements.

Avoid fixed width when content or viewport should determine size.

## 8.5 Fluid typography

Use `clamp()` for very large text where appropriate.

Example:

```css
font-size: clamp(72px, 10vw, 180px);
```

---

# 9. Section sizing

A section may use one of the following patterns:

```text
content-driven height
min-height: 100svh
fixed art-directed height
```

Do not use fixed viewport height automatically.

Use `100svh` only when the composition intentionally fills the screen.

Default vertical section padding:

```text
Desktop: 120–160px
Mobile: 80–96px
```

A section-specific file may override this.

---

# 10. Positioning

## 10.1 Normal flow first

Primary layout should use:

```text
CSS Grid
Flexbox
normal document flow
```

## 10.2 Absolute positioning

Use `position: absolute` only for:
- decorative typography;
- overlays;
- badges;
- floating graphics;
- intentionally art-directed elements;
- controlled visual overlap.

Do not construct entire sections from absolute coordinates.

---

# 11. Overflow

Every oversized element must define overflow behavior.

Possible rules:

```text
visible
hidden
clip
horizontal movement
intentional viewport overflow
```

Large typography and marquee elements must not create accidental horizontal page scrolling.

Default page rule:

```css
body {
  overflow-x: clip;
}
```

Use only if it does not interfere with intended interactions.

---

# 12. Layering / z-index

Use a small predictable z-index scale.

```text
--z-base:       0
--z-decorative: 10
--z-media:      20
--z-content:    30
--z-header:     100
--z-overlay:    200
```

Avoid values such as:

```text
999
9999
999999
```

unless technically unavoidable.

Section specifications should document intentional overlap.

---

# 13. Motion system

Animation should be purposeful and restrained.

Codex must not add animation because an element "would look better animated."

## 13.1 Every animation must define

```text
Element
Trigger
Start state
End state
Direction
Distance
Duration OR scroll relationship
Easing
Repeat behavior
Mobile behavior
Reduced-motion behavior
```

## 13.2 Timing tokens

Initial timing system:

```text
--motion-fast: 150ms
--motion-medium: 300ms
--motion-slow: 500ms
--motion-xslow: 800ms
```

## 13.3 Default easing

Use a consistent easing family.

```text
ease-out for entrances/interactions
ease-in-out for controlled transformations
linear for marquee / directly linked movement
```

Do not mix many easing styles.

## 13.4 Scroll-linked animation

For scroll animations, document movement explicitly.

Example:

```text
Element:
SOOOOO marquee

Trigger:
hero scroll progress

Start:
translateX(15vw)

End:
translateX(-40vw)

Relationship:
directly linked to scroll

Easing:
none / linear

Repeat:
no
```

## 13.5 Reduced motion

Respect:

```css
@media (prefers-reduced-motion: reduce)
```

Disable or simplify non-essential motion.

---

# 14. Interaction states

Clickable elements must define at minimum:

```text
default
hover
focus-visible
active
```

Disabled state only where relevant.

Do not remove browser focus visibility without replacing it with an accessible custom state.

## 14.1 Hover

Keep hover effects subtle unless explicitly art-directed.

Possible approved patterns:
- underline movement;
- opacity change;
- slight image scale;
- controlled color change;
- text translation.

Avoid:
- large bouncing effects;
- strong glow;
- random rotation;
- excessive scaling.

---

# 15. Navigation

Navigation should use the global grid/container.

Document:
- desktop structure;
- mobile structure;
- fixed/sticky/static behavior;
- foreground/background behavior;
- menu interaction if applicable.

Codex must not invent a hamburger menu unless mobile navigation requires one and it is explicitly specified.

---

# 16. Accessibility baseline

Implementation must preserve the design while remaining functional.

Minimum requirements:
- semantic HTML;
- meaningful `alt` text where appropriate;
- keyboard-accessible links/buttons;
- visible `focus-visible`;
- logical heading hierarchy;
- adequate readable contrast;
- no interaction that relies only on hover;
- motion reduction support;
- touch targets large enough for mobile interaction.

Decorative images may use empty alt text.

---

# 17. HTML structure

Prefer semantic elements:

```html
<header>
<nav>
<main>
<section>
<article>
<footer>
```

Do not use unnecessary wrappers.

Class names should describe role rather than appearance where practical.

Good:

```text
project-card
hero-title
project-meta
section-heading
```

Avoid:

```text
big-red-text
left-box-2
thing-container
```

---

# 18. Implementation rules for Codex

## 18.1 Codex may decide

Codex may independently decide:
- semantic HTML structure;
- internal component breakdown;
- reusable utility/helper code;
- technically appropriate Grid/Flex implementation;
- performance optimizations that do not affect appearance;
- image loading strategy;
- internal naming conventions.

## 18.2 Codex may NOT decide

Codex may not independently decide:
- visual hierarchy;
- layout composition;
- font selection;
- colors;
- spacing values;
- image crops;
- image order;
- section order;
- border radius;
- shadows;
- animation style;
- animation direction;
- decorative elements;
- responsive reordering;
- visibility of content;
- copywriting.

---

# 19. Reference usage

Reference images are instructions, not website assets unless specifically identified as production assets.

For each reference specify:

```text
Reference file:
references/example.png

Copy:
- composition
- spacing relationship
- alignment

Do not copy:
- color
- font
- image content
```

Codex must follow written specification over visual guesswork.

Priority:

```text
1. Explicit written section specification
2. DESIGN_SYSTEM.md
3. Supplied reference image
4. Codex implementation judgement
```

---

# 20. Section specification format

Every major section should have its own specification.

Recommended:

```text
/sections/
  HERO.md
  ABOUT.md
  PROJECTS.md
  EXPERIENCE.md
  CONTACT.md
```

Use the following structure.

---

## SECTION TEMPLATE

### Name

```text
SECTION:
```

### Purpose

```text
What this section communicates.
```

### Reference

```text
REFERENCE FILE:
```

### Desktop

```text
Height / min-height:
Background:
Container:
Grid:
Vertical padding:
Overflow:
```

### Elements

For each element:

```text
ELEMENT:

Content:
Grid position:
Width:
Height:
Alignment:
Font role:
Font size override:
Line height:
Color:
Spacing:
Position:
Layer:
```

### Images

```text
FILE:
ASPECT RATIO:
GRID POSITION:
OBJECT FIT:
OBJECT POSITION:
MAX SIZE:
```

### Relationships

Example:

```text
Title aligns with container left.
Image top aligns with metadata baseline.
Counter aligns with container right.
```

### Animation

```text
ELEMENT:
TRIGGER:
FROM:
TO:
DURATION / SCROLL RELATION:
EASING:
MOBILE:
```

### Mobile

```text
Breakpoint:
Order:
Grid position:
Spacing changes:
Typography changes:
Image changes:
Hidden elements:
```

### Acceptance criteria

Example:

```text
- Title alignment matches reference.
- Image starts on grid column 7.
- No horizontal overflow.
- Mobile composition follows supplied mobile reference.
- Codex does not add decorative elements.
```

---

# 21. Final site structure

```text
01. Global Header
02. Hero
03. About
04. Journey
    ├── Physical Therapy Assistant
    ├── Bartender
    └── Content Specialist
05. Made
    ├── Screen 01 — portfolio marquee
    └── Screen 02 — cover deck + audio player
06. Connect / Footer
```

This desktop structure is approved for the first prototype.

---

# 22. Hero-specific global note

Current known art direction:

```text
Large typographic hero.
Prominent "SOOOOO" horizontal text/marquee element.
Scroll-linked horizontal movement.
Composition is graphic rather than conventional centered hero UI.
```

The final geometry belongs in:

```text
/sections/HERO.md
```

Do not define hero-specific coordinates globally in this file.

---

# 23. CSS token starter

```css
@font-face {
  font-family: "Portfolio Display";
  src: url("/assets/fonts/arial-black/Arial-Black.woff") format("woff");
  font-style: normal;
  font-weight: 700;
  font-display: swap;
}

@font-face {
  font-family: "Cascadia Mono";
  src: url("/assets/fonts/cascadia/CascadiaMono-Regular.woff2") format("woff2");
  font-style: normal;
  font-weight: 400;
  font-display: swap;
}

@font-face {
  font-family: "Cascadia Mono";
  src: url("/assets/fonts/cascadia/CascadiaMono-Bold.woff2") format("woff2");
  font-style: normal;
  font-weight: 700;
  font-display: swap;
}

:root {
  /* Layout */
  --container-max: 1440px;
  --page-padding-desktop: 48px;
  --page-padding-tablet: 32px;
  --page-padding-mobile: 20px;

  --grid-gap-desktop: 24px;
  --grid-gap-tablet: 20px;
  --grid-gap-mobile: 16px;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 40px;
  --space-8: 48px;
  --space-9: 64px;
  --space-10: 80px;
  --space-11: 96px;
  --space-12: 120px;
  --space-13: 160px;
  --space-14: 200px;
  --space-15: 240px;

  /* Radius */
  --radius-none: 0px;
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;

  /* Motion */
  --motion-fast: 150ms;
  --motion-medium: 300ms;
  --motion-slow: 500ms;
  --motion-xslow: 800ms;

  /* Layering */
  --z-base: 0;
  --z-decorative: 10;
  --z-media: 20;
  --z-content: 30;
  --z-header: 100;
  --z-overlay: 200;

  /* Approved colors — mandatory semantic roles */
  --color-bg: #99E6FF;
  --color-accent: #FACA2B;
  --color-text: #000000;
  --color-section-heading: #313131;

  /* Approved font families */
  --font-display: "Portfolio Display", Arial, sans-serif;
  --font-body: "Cascadia Mono", monospace;
}
```

---

# 24. Desktop prototype pre-build checklist

Current status:

- [x] Display font supplied
- [x] Cascadia Mono Regular + Bold supplied
- [x] Final HEX colors documented
- [x] Production assets use semantic filenames
- [x] Desktop section order approved
- [x] Hero specification complete
- [x] About specification complete
- [x] Journey specification complete
- [x] Made specification complete
- [x] Connect specification complete
- [x] Major animations and interactions documented
- [x] Header state system documented
- [x] Desktop reference compositions supplied
- [ ] Final copy — intentionally deferred until after prototype
- [ ] Final track-title typography polish — tune after prototype
- [ ] Mobile layout — intentionally deferred until desktop is approved

The missing items do **not** block the first desktop implementation. Placeholder copy is allowed for this prototype.

---

# 25. Definition of done

A section is not finished merely because it is functional.

It is finished when:

1. Layout matches the approved composition.
2. Grid alignment is correct.
3. Spacing comes from the design system.
4. Real fonts are loaded.
5. Real assets are used.
6. Desktop behavior is correct.
7. Mobile behavior is correct.
8. Intermediate widths remain stable.
9. No accidental overflow exists.
10. Motion matches specification.
11. Hover/focus states are correct.
12. Codex has not introduced unapproved visual decisions.

---

# 26. Final authority rule

If a visual conflict occurs:

```text
Section specification
        ↓
DESIGN_SYSTEM.md
        ↓
Reference asset
        ↓
Existing implementation
        ↓
Codex judgement
```

Codex must not silently reinterpret a higher-priority rule.

