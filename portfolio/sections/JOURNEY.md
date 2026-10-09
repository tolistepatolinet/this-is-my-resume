# JOURNEY.md

> Updated section specification for the Journey block of the portfolio website.
> Follows `DESIGN_SYSTEM.md`, `HERO.md`, and `ABOUT.md`.

---

# 1. Section name

```text
JOURNEY
```

---

# 2. Purpose

The Journey section presents a sequence of past roles / stages of experience.

Its role is to:
- continue the page after About;
- show career progression through 3 visual panels;
- combine photography / imagery on the left with role information on the right;
- use scroll as a storytelling mechanism;
- preserve the compact right-shifted header state established in About.

This section should feel like a horizontal narrative strip controlled by vertical scroll.

---

# 3. Final section concept

Journey consists of 3 sequential panels:

```text
01. PHYSICAL THERAPY ASSISTANT
02. BARTENDER
03. CONTENT SPECIALIST
```

Each panel uses the same basic composition:

- left half: large image;
- right half: blue text area;
- top: compact fixed header;
- center-right: role title + place + years;
- lower-right: descriptive paragraph.

The section should read as a continuous sequence rather than 3 unrelated standalone blocks.

There is **no separate `JOURNEY:` heading** above or inside the section.

---

# 4. Scroll model

## 4.1 Core behavior

Journey is a **pinned horizontal-scroll section**.

Implementation intent:

```text
User scrolls down vertically
↓
Journey pins in the viewport
↓
vertical scroll progress moves the sequence horizontally
↓
panel 01 → panel 02 → panel 03
↓
after panel 03 is complete, Journey releases
↓
page continues to Made
```

## 4.2 Section state

Journey occupies a scroll segment longer than one viewport so the 3-panel sequence has time to play.

Conceptually:

```text
Journey viewport = fixed stage
Journey content track = horizontal strip with 3 panels
```

## 4.3 Panel visibility

At any moment, one panel should dominate the screen.

The next panel is visible **only during the transition** between panels.
When the current panel is fully active, the next panel should not remain permanently exposed.

Do not show all 3 panels equally at once.

---

# 5. Header state inside Journey

The header state established in About persists into Journey.

Navigation items:

```text
about
journey
made
connect
```

Journey uses the **settled compact header state**:

- fixed at the top;
- transparent;
- clickable;
- lowercase;
- Cascadia Mono;
- `#000000`;
- smaller than in Hero;
- shifted right relative to the Hero opening layout.

Do not revert to the large Hero header state.

Do not create a separate Journey header.

---

# 6. Global Journey layout logic

## 6.1 Each panel

Each Journey panel fills the viewport width.

Recommended structural split:

```text
Left side:
approximately 48%–52% width
image area

Right side:
approximately 48%–52% width
text area on blue background
```

This is an art-direction guide, not a rigid percentage law.

## 6.2 Color system

For all 3 panels:

```text
Right background:
#99E6FF

Role title:
#313131

Metadata:
#000000

Paragraph:
#000000

Header text:
#000000
```

Important:
- section / role headings use `#313131`;
- descriptive copy uses `#000000`;
- no new colors are introduced.

## 6.3 Typography roles

```text
Role title:
var(--font-display) / supplied Portfolio Display face

Metadata:
Cascadia Mono

Paragraph:
Cascadia Mono

Header:
Cascadia Mono
```

---

# 7. Panel 01 — Physical Therapy Assistant

## 7.1 Content

```text
Title:
PHYSICAL THERAPY ASSISTANT

Metadata:
Danko Private Clinic | 2017–2019

Paragraph:
placeholder explanatory text about this experience
```

## 7.2 Image area

Reference intent:
- large photo on the left;
- person standing in a clinic / rehabilitation environment;
- image occupies the full left half of the panel;
- cropping may occur to fit composition.

The visual should feel documentary / personal, not stock-like.

## 7.3 Text area

Right side on blue background.

### Placement

```text
Role title:
upper-middle / center-right area

Metadata:
directly below the title

Paragraph:
lower-right quadrant
```

### Alignment

Role title and metadata are visually centered within the right-side text area.
Paragraph sits lower and remains readable with moderate line length.

---

# 8. Panel 02 — Bartender

## 8.1 Content

```text
Title:
BARTENDER

Metadata:
Brimborium, Room13, Luzery | 2021–2026

Paragraph:
placeholder explanatory text about this experience
```

## 8.2 Image area

Reference intent:
- group / bar environment image on the left;
- energetic, social, personal atmosphere;
- image fills the full left half of the panel.

## 8.3 Text area

Same structural logic as panel 01:

```text
Title:
upper-middle / center-right

Metadata:
directly below title

Paragraph:
lower-right area
```

---

# 9. Panel 03 — Content Specialist

## 9.1 Content

```text
Title:
CONTENT SPECIALIST

Metadata:
Billiard Club Luzery | Mar. 2026 - ...

Paragraph:
placeholder explanatory text about this experience
```

## 9.2 Image area

Reference intent:
- still-life / object-based image on the left;
- objects connected to visual/content work;
- image fills the left half of the panel.

## 9.3 Text area

Same structure:

```text
Title:
upper-middle / center-right

Metadata:
directly below title

Paragraph:
lower-right area
```

---

# 10. Shared panel composition rules

These rules apply to all 3 panels.

## 10.1 Left image block

- occupies the left half of the viewport;
- may use `object-fit: cover`;
- should feel visually strong and immersive;
- no rounded image cards;
- no shadowed frames;
- no artificial borders unless they are part of the actual image asset.

## 10.2 Right text block

- uses the blue global background;
- should remain relatively spacious;
- must not feel cramped;
- includes title, metadata, paragraph.

## 10.3 Title treatment

- large, bold, uppercase;
- `var(--font-display)`;
- `#313131`;
- stronger than metadata and body text.

## 10.4 Metadata treatment

- `Cascadia Mono`;
- smaller than title;
- directly connected to title;
- color: `#000000`.

## 10.5 Paragraph treatment

- `Cascadia Mono`;
- `#000000`;
- lower-right area;
- moderate readable width;
- not too wide;
- aligned consistently across all panels.

## 10.6 Text-to-panel attachment rule

The text on the right is **fully attached to its own panel**.

That means:

- the title, metadata and paragraph are part of the same panel as the left image;
- they move together with that panel;
- they do not remain globally fixed while panels slide underneath;
- each panel has its own complete right-side text block.

---

# 11. Motion and transitions

## 11.1 Approved Journey motion

The required motion is the horizontal panel progression tied to vertical scroll.

```text
Trigger:
vertical page scroll while Journey is pinned

Motion:
horizontal movement of the Journey content track

Direction:
leftward track movement so panels progress 01 → 02 → 03
```

## 11.2 Panel transition feel

The panel movement should feel as if it has a small amount of **resistance / inertia**.

Desired feeling:

```text
When the user begins to scroll toward the next panel,
the next panel first appears slightly / cautiously,
then enters more fully and faster,
until it takes over the screen.
```

So the transition should not feel perfectly linear and mechanical.

It should feel like:
- a slight initial resistance;
- then a quicker completion of the transition.

This applies to:
- panel 01 → panel 02;
- panel 02 → panel 03.

## 11.3 Visibility of next panel during movement

The next panel should be visible **only during the act of transitioning**.

Meaning:
- while panel 01 is settled, panel 02 should not remain exposed;
- while panel 02 is settled, panel 03 should not remain exposed;
- only during scroll progression between stages does the next panel begin to peek in.

## 11.4 No extra motion by default

Do not automatically add:
- parallax;
- image zooms;
- bouncing text;
- animated titles;
- floating decorations.

Unless explicitly requested later, Journey should rely on the strength of the panel progression itself.

## 11.5 Header during Journey

The compact header remains fixed and static while Journey panels move beneath it.

It should not continue shrinking or shifting during Journey.

---

# 12. Layering

Recommended stack:

```text
Layer 0:
panel backgrounds / image and blue area

Layer 1:
panel textual content

Layer 2:
fixed compact header
```

If needed, the header always remains visually and interactively above the panels.

---

# 13. Section release into Made

At the end of panel 03:

```text
Journey horizontal progression completes
↓
Journey unpins / releases
↓
normal vertical page flow resumes
↓
Made section enters
```

Do not leave the section pinned after the third panel is fully read.

---

# 14. Spacing

Use the global spacing system.

General spacing relationships:

```text
Header → role title:
large top breathing room

Role title → metadata:
small gap

Metadata → paragraph:
large gap

Right-side block edges:
generous internal spacing
```

Final spacing should be tuned visually against the real assets and final font rendering.

---

# 15. Responsive direction

A dedicated mobile Journey composition should be defined later.

## Tablet / smaller desktop

Preserve:
- horizontal-sequence concept if still stable;
- full-screen panel reading;
- left-image / right-text relationship where feasible.

## Mobile

The desktop pinned-horizontal behavior may be simplified if necessary, but this should be a deliberate design decision.

Possible mobile directions:
- retain horizontal scroll effect in a simplified way;
- or convert to vertical stacked slides.

Do not decide mobile behavior finally without a dedicated mobile reference.

---

# 16. Implementation rules for Codex

Codex may:
- implement Journey as a pinned horizontal-scroll section;
- use a horizontal track with 3 full-width panels;
- give transitions a subtle resistant / eased feel;
- keep the text block attached to each panel;
- keep a single persistent compact header above the section;
- use `object-fit: cover` and responsive cropping for images.

Codex may NOT:
- turn Journey into 3 ordinary vertically stacked desktop blocks unless explicitly instructed later;
- keep the right-side text globally fixed while only images move;
- leave a visible slice of the next panel on screen while the current panel is fully settled;
- revert the header to the Hero layout;
- add backgrounds behind the header;
- introduce new colors;
- place titles on the left image area;
- crowd the right text area with unnecessary UI;
- add unapproved decorative elements or animations;
- create a separate `JOURNEY:` section heading.

---

# 17. Content TODO

Before production completion:

```text
TODO:
Replace all placeholder descriptive paragraphs with final copy.

TODO:
Confirm exact filenames for the 3 Journey images.

TODO:
Create mobile Journey reference.
```

---

# 18. Acceptance criteria

Journey is correct when:

- it behaves as a pinned horizontal-scroll section;
- scrolling reveals 3 sequential panels;
- only one panel dominates at a time;
- the next panel peeks in only during the transition;
- transitions feel slightly resistant at first, then complete faster;
- each panel has image on the left and blue text area on the right;
- each right-side text block is attached to and moves with its own panel;
- titles are large, uppercase and use `#313131`;
- supporting text uses Cascadia Mono and `#000000`;
- the compact right-shifted header persists throughout;
- there is no separate `JOURNEY:` heading;
- after panel 03, the section releases and the page continues into Made;
- no unapproved motion or decorative UI is introduced;
- no accidental horizontal overflow escapes the intended pinned sequence.
