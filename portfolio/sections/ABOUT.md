# ABOUT.md

> Final About specification with settled header state after Hero transition.
> Follows `DESIGN_SYSTEM.md` and continues `HERO.md`.

---

# 1. Section name

```text
ABOUT
```

---

# 2. Purpose

The About section:
- receives the `ME` illustration from Hero;
- establishes the first stable content layout after the opening poster-like Hero;
- introduces the author with a compact text column on the left and a large illustration on the right;
- locks in the **smaller right-shifted header state** that will continue through the following sections.

---

# 3. Final desktop composition

The final About composition includes:

- blue background `#99E6FF`;
- fixed top navigation in its **settled compact state**;
- large dark heading `WHO that boy:`;
- compact body text below on the left;
- yellow outlined arrow between the text and `ME`;
- large `ME` illustration on the right;
- generous negative space.

---

# 4. Header behavior in About

Navigation items:

```text
about
journey
made
connect
```

## About-state header

By the time About is fully reached, the navigation should have completed its transition from Hero.

This final About-state header must be:

- fixed at the top;
- transparent / without background;
- clickable;
- lowercase;
- Cascadia Mono;
- `#000000`;
- smaller than in Hero;
- shifted toward the right side compared with Hero.

## Persistence rule

This About-state header becomes the default header state for later sections.

That means:

```text
About
Journey
Made
Connect
```

all use this smaller right-shifted settled navigation layout unless a later explicit override is defined.

## Transition rule

The header transformation happens during the Hero → About scroll.

It should:
- shrink smoothly;
- shift right smoothly;
- remain visible throughout;
- remain clickable throughout;
- not flash, re-render, or swap into a different navigation component.

---

# 5. Section frame

```text
Background:
#99E6FF

Min-height:
100svh

Overflow:
controlled

Layout basis:
global 12-column grid
```

The section should read as one complete desktop screen.

---

# 6. Main heading

## Content

```text
WHO that boy:
```

## Typography

```text
Font:
var(--font-display) / supplied Portfolio Display face

Color:
#313131

Alignment:
left
```

## Placement

- upper-left area;
- below the fixed compact header;
- aligned to the left content edge.

Approximate span:

```text
columns 1–6
```

## Behavior

Static.

---

# 7. Body text

## Typography

```text
Font:
Cascadia Mono

Color:
#000000

Alignment:
left
```

## Layout

- compact editorial text column;
- placed below `WHO that boy:`;
- approximate span: columns `1–4`;
- must stay clearly separated from the character.

## Emphasis

Selected words may use:
- heavier weight;
- `#FACA2B`.

---

# 8. Decorative arrow

## Role

Yellow graphic accent directing attention toward `ME`.

## Placement

- between text and character;
- around columns `5–6`;
- points right / down-right.

## Color treatment

```text
Fill:
#FACA2B

Outline:
light / near-white as in the asset
```

## Behavior

Static.

Use the supplied asset.

---

# 9. `ME` illustration

## Role

Persistent visual introduced in Hero.

## Final About position

- right side;
- large;
- surrounded by generous negative space;
- approximate span: columns `7–12`.

## Transition

During Hero → About:
- `ME` moves from its Hero position into this final About position;
- once it arrives, it becomes static.

No hard reset.

---

# 10. Negative space

Maintain clear open separation between:
- heading;
- body text;
- arrow;
- `ME`.

Do not fill empty space with extra UI or decoration.

---

# 11. Layering

```text
Layer 0: background
Layer 1: heading + body text
Layer 2: arrow
Layer 3: ME
Layer 4: fixed compact header
```

---

# 12. Scroll behavior

## Hero → About transition

During the transition:
- header shrinks and shifts right;
- `ME` moves into About;
- Hero marquee continues its movement;
- header remains visible and clickable.

## Settled About state

Once About is reached:
- header remains fixed in compact right-shifted state;
- heading is static;
- body text is static;
- arrow is static;
- `ME` is static.

No additional About animation is required.

---

# 13. Color roles

```text
Background: #99E6FF
Section heading: #313131
Body text: #000000
Accent arrow: #FACA2B
Text accents: #FACA2B
Header text: #000000
```

---

# 14. Typography roles

```text
Heading: var(--font-display) / supplied Portfolio Display face
Body: Cascadia Mono
Header: Cascadia Mono
```

---

# 15. Codex implementation rules

Codex may:
- preserve one navigation component across sections;
- animate its size and position during Hero → About;
- keep it fixed and interactive;
- settle it into the smaller right-shifted state for all later sections.

Codex may NOT:
- create a separate second header for About;
- add a background behind the header;
- let the header jump abruptly if smooth motion is possible;
- revert the header back to the large Hero state in later sections without instruction.

---

# 16. Content TODO

Before final production:

```text
TODO:
Replace placeholder About copy with final text.

TODO:
Define exact emphasized words.

TODO:
Confirm arrow asset filename.

TODO:
Confirm ME asset filename.

TODO:
Create mobile About reference.
```

---

# 17. Acceptance criteria

About is correct when:

- `WHO that boy:` appears large in `#313131`;
- body text sits below in a compact black Cascadia Mono column;
- the yellow outlined arrow points toward `ME`;
- `ME` is large on the right;
- the header has completed its smooth shrink + right-shift transition;
- the header remains fixed, transparent and clickable;
- this compact header state is understood as the default for subsequent sections;
- no accidental horizontal overflow appears.
