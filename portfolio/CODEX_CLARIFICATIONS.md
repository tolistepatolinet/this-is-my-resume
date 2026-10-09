# CODEX_CLARIFICATIONS.md

> Prototype implementation clarifications.
> This file resolves the ambiguities identified during the pre-build review.
> Where this file conflicts with an earlier specification, this file wins.
>
> These numeric values are INITIAL DESKTOP PROTOTYPE VALUES.
> They are intentionally easy to tune after the first visual review.

---

# 1. Calibration authority

Codex is explicitly allowed to calibrate numeric implementation values against the supplied desktop reference images when:

- the visual relationship is clearly shown in a reference;
- the written documentation specifies the behavior but not an exact pixel value;
- no new visual concept is introduced.

This permission applies to:

- exact x/y positioning;
- exact scale;
- section-local spacing;
- scroll travel distance;
- animation speed;
- transform distance;
- easing values.

It does NOT permit Codex to invent:

- new colors;
- new fonts;
- new content;
- new visual elements;
- new interactions;
- new animation concepts;
- new responsive/mobile layouts.

Use the numbers below as starting values, then calibrate visually against references if necessary.

---

# 2. About arrow mismatch

For the FIRST PROTOTYPE:

```text
Use the supplied production asset unchanged:
assets/about/arrow.png
```

Do not recolor, redraw, or recreate it in CSS.

The latest About reference remains the visual target, but the current production arrow is accepted provisionally.

If the outline treatment looks wrong after the first build, the asset itself will be replaced later.

This is not a blocker.

---

# 3. Hero oversized SOOOOO typography

The Hero background typography is a Hero-specific exception to the general display scale.

Starting desktop rule:

```css
.hero-marquee {
  font-family: var(--font-display);
  font-size: clamp(520px, 48vw, 760px);
  line-height: 0.78;
  white-space: nowrap;
}
```

At the 1440px reference width, the target should be approximately:

```text
690px font-size
```

The visible glyphs should occupy most of the Hero height and be heavily cropped by the viewport.

Codex may adjust this by approximately ±10% to visually match the Hero reference.

---

# 4. Header numeric states

Use one persistent header.

## Hero state

At 1440px desktop:

```text
font-size:
approximately 32–36px

horizontal area:
full content width between page paddings

layout:
4 items distributed with justify-content: space-between

top:
approximately 26px
```

Recommended fluid font rule:

```css
font-size: clamp(28px, 2.2vw, 38px);
```

## Settled state — About onward

At 1440px desktop:

```text
font-size:
approximately 18px

width:
approximately 540–600px

right:
48px

top:
approximately 34px
```

Recommended rule:

```css
font-size: clamp(16px, 1.25vw, 20px);
```

The four links remain distributed across this smaller right-aligned navigation width.

## Hero → About interpolation

Interpolate smoothly using shared scroll progress:

```text
font size
navigation width
x position
top position if needed
```

No crossfade and no second header.

---

# 5. Hero → About transition range

Use one shared normalized progress:

```text
0 = Hero initial composition
1 = About settled composition
```

Starting range:

```text
progress begins:
as soon as the user leaves the top of Hero

progress completes:
when About is approximately settled as the dominant viewport section
```

For the first implementation, the transition may occupy approximately:

```text
0.9–1.1 viewport heights of scroll
```

Codex may calibrate the exact range against the references.

---

# 6. ME transition geometry

Use the same `ME` image element.

Starting visual behavior:

```text
Hero:
larger
slightly farther left
dominant over the right/center

About:
slightly smaller
shifted farther right
settled into the final About position
```

Starting transform relationship:

```text
Hero → About

translateX:
approximately +5vw to +8vw

translateY:
approximately +5vh to +9vh

scale:
approximately 1.00 → 0.88–0.93
```

These are calibration values, not immutable design tokens.

The final position must visually match the latest About reference.

Do not duplicate `ME`.

---

# 7. SOOOOO scroll travel

The Hero marquee moves:

```text
right → left
```

It is directly linked to the same Hero → About progress.

Starting travel:

```text
translateX:
0vw → approximately -45vw
```

Codex may tune within approximately:

```text
-35vw to -55vw
```

to match the intended visual movement.

No automatic idle loop.

---

# 8. `this is my resume//` release behavior

The phrase should appear visually fixed during the Hero stage and the initial Hero → About movement.

Implementation intent:

```text
sticky/fixed-like inside the Hero transition stage,
NOT permanently fixed to the entire website.
```

When the Hero transition finishes:

```text
the phrase releases naturally with the Hero
and leaves the viewport as About takes over.
```

Do not fade it out unless necessary.

Preferred behavior:
natural clipping / release with the Hero container.

It must not remain visible throughout About, Journey, Made, or Connect.

---

# 9. Journey initial motion values

Journey remains a pinned horizontal narrative.

Starting desktop wrapper length:

```text
approximately 300vh
```

A value in the range:

```text
280vh–340vh
```

is acceptable if required for visual pacing.

## Resistance feel

For each panel transition:

```text
slow initial response
→ faster completion
```

Use an ease-in-like transformed progress.

Recommended starting curve concept:

```text
easeInCubic
```

or a visually equivalent custom mapping.

Do NOT add elastic bounce or overshoot.

## Settled panels

At each settled state:

```text
exact panel boundary
no next-panel slice visible
```

The next panel appears only during transition.

---

# 10. Made Screen 01 marquee speed

Starting automatic marquee speed:

```text
18–24 px/second
```

Recommended initial value:

```text
20 px/second
```

Direction:

```text
right → left
```

During wheel/trackpad interaction:

```text
automatic movement yields to manual input
```

After manual interaction:

```text
resume automatic marquee after approximately 400–700ms
```

Recommended first value:

```text
500ms
```

No snapping.

---

# 11. Made Screen 02 latest layout authority

The LATEST Made 02 reference overrides the older text-placement description.

Final composition order on the left:

```text
1. "...and THIS, too"
2. body copy directly underneath
3. active track-title marquee
4. player below / near the title line
```

The cover deck remains on the right.

Do not place the body copy below the player.

---

# 12. Cover deck exit path

Starting click animation for the active front cover:

```text
duration:
approximately 380ms

front cover:
moves slightly left and down,
scales down slightly,
then is reordered to the back

suggested transform peak:
translateX(-6%)
translateY(2%)
scale(0.97)
```

After reordering:

```text
next cover advances into the front position
```

No large rotation.

No dramatic throw.

The physical metaphor should feel like moving the top card to the back of a deck.

Codex may tune the transform by a small amount to match the reference stack.

---

# 13. Audio-title marquee

The visible title belongs to the currently active cover/audio pair.

Behavior while playing:

```text
starts hidden behind / near the player
moves right → left
finishes aligned with the left text column
briefly holds
resets behind the player
repeats
```

Starting timing:

```text
travel:
3.5s

hold:
0.7s

reset:
instant while hidden

cycle:
approximately 4.2s
```

The title animation runs only while audio is actually playing.

Paused/stopped:

```text
hide title animation
```

Reduced motion:

```text
show static active title while playing
```

---

# 14. Player press/spring interaction

On player activation:

```text
press:
scale(0.96)
translateY(4px)

spring return:
scale(1)
translateY(0)
```

Starting timing:

```text
press:
80–100ms

return:
180–240ms
```

Use a restrained ease-out / spring-like return.

Do not use a large bounce.

---

# 15. Connect hand scroll range

Connect remains normal in-flow content.

Do NOT make it pinned.

Hand animation begins while Connect enters the viewport.

Suggested local progress:

```text
0:
Connect top reaches approximately 85% of viewport height

1:
the user reaches the bottom of the page
```

The hand is already clearly visible at progress 0.

It gradually reaches toward the phone.

## Final relationship

At progress 1:

```text
fingertips almost reach the phone
but a visible gap remains
```

Target final gap:

```text
approximately 70–110px at 1440px desktop
```

Starting hand travel:

```text
translateX:
approximately +10vw to +14vw

translateY:
approximately -1vh to -3vh
```

Codex may calibrate this against the Connect reference.

The tattoo links remain attached to the same transformed hand wrapper.

---

# 16. Phone vibration timing

Required burst:

```text
approximately 200ms
```

Scale pulse:

```text
1.00 → 1.03–1.05 → 1.00
```

Pause between vibration bursts:

```text
approximately 4.5–6 seconds
```

Recommended initial interval:

```text
5 seconds
```

Do not synchronize vibration with scroll.

Run only when Connect is in/near viewport.

---

# 17. Placeholder copy

Final text content is intentionally deferred.

For the first prototype:

```text
use concise placeholder copy
preserve roughly the same line count / occupied area as references
```

Keep placeholder copy isolated in `src/data/content.js` or equivalent so it can be replaced without touching layout code.

Do not write final portfolio copy independently.

---

# 18. Desktop scope

Build only the desktop prototype now.

Required visual checks:

```text
1280px
1440px
1600px
```

Do not create a final mobile design.

Basic defensive CSS for smaller widths is acceptable only to prevent catastrophic breakage, but mobile art direction is deferred.

---

# 19. Prototype philosophy

The purpose of the first build is:

```text
correct architecture
correct composition
correct interaction logic
close visual match
easy numeric tuning
```

It is NOT necessary for every animation speed or pixel position to be permanently final.

All local motion constants and major section dimensions should be exposed in:

```text
CSS custom properties
or
a small centralized JS motion config
```

so the first visual-polish pass can tune them quickly.

---

# 20. Implementation authorization

With the clarifications above, there are no remaining blockers for the first desktop prototype.

Codex may now:

1. initialize Vite with vanilla HTML/CSS/JS;
2. create the proposed application structure;
3. implement static compositions first;
4. implement interactions in the documented order;
5. run the site locally;
6. perform desktop QA at 1280 / 1440 / 1600;
7. report any actual implementation conflict rather than redesigning around it.

Do not implement mobile art direction yet.
