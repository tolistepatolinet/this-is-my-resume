# HERO.md

> Updated Hero specification with header transition behavior.
> Follows `DESIGN_SYSTEM.md`.

---

# 1. Section name

```text
HERO
```

---

# 2. Purpose

The Hero section establishes the opening visual identity of the site:
- large graphic `SOOOOOOOOOOO` treatment;
- large `ME` illustration;
- fixed bottom-left phrase;
- top navigation in its **initial Hero state**;
- scroll-linked choreography that transitions both the `ME` illustration and the header into their About-state positions.

---

# 3. Hero header state

In Hero, the top navigation uses its **initial / expanded** state.

Navigation items:

```text
about
journey
made
connect
```

## Hero-state behavior

- fixed at the top;
- no background;
- clickable text only;
- lowercase;
- Cascadia Mono;
- #000000;
- visually more spread out across the width;
- visually larger than in the About and later sections.

This is the opening-state navigation layout.

---

# 4. Main Hero composition

- background: `#99E6FF`;
- giant yellow `SOOOOOOOOOOO` behind the illustration;
- `ME` on the right side;
- `this is my resume//` fixed bottom-left;
- navigation fixed at top in Hero-state layout.

---

# 5. Scroll choreography: Hero → About

When the user scrolls from Hero into About, the following events happen simultaneously:

```text
1. `SOOOOOOOOOOO` moves horizontally right → left like a marquee.
2. `ME` shifts from Hero position into its About position.
3. `this is my resume//` stays fixed during the initial transition.
4. the header / top navigation smoothly shrinks and shifts to the right.
```

## Header transition details

The header must transform smoothly from its Hero state to its About state.

### Initial Hero state

```text
- larger
- more spread across the width
- visually integrated into the opening screen
```

### Final About state

```text
- smaller
- shifted toward the right side
- still fixed at the top
- still transparent
- still fully clickable
```

## Critical rules

- the header must not disappear during this transition;
- it must not gain a background;
- it must not stop being clickable;
- the transformation should feel smooth and tied to scroll progress;
- once the header reaches the About-state layout, it remains in that state for later sections.

---

# 6. `SOOOOOOOOOOO` marquee

## Role

Large background graphic typography.

## Typography

```text
Font:
var(--font-display) / supplied Portfolio Display face

Color:
#FACA2B
```

## Behavior

- scroll-linked horizontal movement;
- moves right → left;
- sits behind `ME`;
- no autonomous looping when idle.

---

# 7. `ME` illustration

## Role

Persistent visual character.

## Behavior

- begins in Hero on the right side;
- moves into About during scroll;
- must feel like the same object throughout the transition;
- no hard reset or unrelated duplicate.

---

# 8. Bottom-left phrase

Content:

```text
this is my resume//
```

## Behavior

- fixed in place during the Hero stage and initial Hero → About transition;
- Cascadia Mono;
- #000000;
- no automatic animation.

---

# 9. Layering

```text
Layer 0: background
Layer 1: SOOOOOOOOOOO
Layer 2: ME
Layer 3: bottom-left phrase
Layer 4: top navigation
```

---

# 10. Responsive direction

Precise mobile behavior will be defined later.

For now:
- preserve header transition concept;
- preserve marquee behavior;
- preserve `ME` transition;
- preserve transparent clickable navigation.

---

# 11. Implementation rules for Codex

Codex may:
- use fixed positioning plus scroll-linked transforms;
- smoothly interpolate header size and x-position during Hero → About;
- preserve clickability throughout the transition.

Codex may NOT:
- hide the header during scroll;
- add a background to the header;
- turn the navigation into button pills;
- keep the header in the large Hero layout for all later sections;
- abruptly snap the header unless technically unavoidable.

---

# 12. Acceptance criteria

Hero is correct when:

- the large opening Hero composition is preserved;
- `SOOOOOOOOOOO` moves right → left on scroll;
- `ME` moves into About on scroll;
- `this is my resume//` remains fixed during the initial transition;
- the header smoothly shrinks and shifts right during Hero → About;
- the header remains clickable and transparent;
- after the transition, the header is ready to stay in its smaller right-shifted state.
