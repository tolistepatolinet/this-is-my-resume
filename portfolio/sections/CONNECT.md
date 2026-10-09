# CONNECT.md

> Section specification for the Connect / Footer block of the portfolio website.
> Follows `DESIGN_SYSTEM.md`, `HERO.md`, `ABOUT.md`, `JOURNEY.md`, and `MADE.md`.

---

# 1. Section name

```text
CONNECT
```

This is also the footer / final section of the site.

---

# 2. Purpose

The Connect section is the final screen of the portfolio.

Its role is to:
- close the page with a memorable visual composition;
- invite contact in a playful, personal way;
- present contact links directly on the hand as clickable "tattoos";
- use the phone graphic as a visual counterweight and subtle animated object;
- preserve the overall graphic language of the site.

This section should feel like a proper ending, not a generic footer with small links.

---

# 3. Global behavior

The Connect section is a normal vertically reached page section.

There is:
- no pinning;
- no horizontal section scroll;
- no hidden footer drawer.

The compact settled header remains visible:

```text
about
journey
made
connect
```

Rules:
- fixed at the top;
- transparent;
- clickable;
- Cascadia Mono;
- #000000;
- compact / right-shifted;
- same settled state established after Hero.

---

# 4. Final desktop composition

The supplied footer reference establishes:

- global blue background;
- large multi-line display phrase in the upper-left;
- short supporting text block below the headline;
- large realistic hand/arm entering from the left;
- contact labels placed on the arm like tattoos;
- retro mobile phone illustration on the right;
- small micro-copy / disclaimer line at the bottom center.

The composition is wide, open and asymmetric.

---

# 5. Section frame

```text
Background:
#99E6FF

Min-height:
100svh recommended

Overflow:
controlled

Layout basis:
global 12-column grid + art-directed placement
```

The footer should read as one complete closing screen on desktop.

---

# 6. Header state inside Connect

The same compact navigation persists:

```text
about
journey
made
connect
```

Important:
- do not enlarge the header again;
- do not add background;
- do not hide it;
- keep it fixed and clickable.

This final section keeps the same settled navigation system used in About / Journey / Made.

---

# 7. Main display phrase

## 7.1 Content

```text
WE need each
other, YEAH?
```

## 7.2 Typography

```text
Font:
var(--font-display) / supplied Portfolio Display face
```

## 7.3 Color treatment

Follow the supplied composition:

```text
WE
#313131

need each
#000000

other,
#000000

YEAH?
#313131
```

This stays within the approved global palette.

## 7.4 Placement

Reference intent:

```text
upper-left
below the compact fixed header
large multi-line composition
```

The phrase should occupy a substantial visual area on the left side.

## 7.5 Behavior

```text
Static.
```

No automatic animation.

---

# 8. Supporting text block

## 8.1 Role

Short informal body copy under the main display phrase.

Current text in the sketch is placeholder copy and may be replaced later.

## 8.2 Typography

```text
Font:
Cascadia Mono

Color:
#000000

Alignment:
left
```

## 8.3 Placement

Reference intent:

```text
below the main phrase
upper-left / mid-left region
```

The text block should remain compact and readable.

Use a relatively narrow text width.

Approximate structural span:

```text
columns 1–5
```

## 8.4 Emphasis

If later needed, selected words may use:
- heavier Cascadia Mono weight;
- #FACA2B.

Do not introduce new colors.

---

# 9. Hand / arm visual

## 9.1 Role

The hand is the main contact carrier and the key visual object on the left / center-left.

It should feel tactile and direct.

## 9.2 Asset type

This is a realistic hand/arm image, not a drawn illustration.

Use the provided production asset.

## 9.3 Placement

Reference intent:

```text
enters from the lower-left
extends toward center
angled slightly upward/right
```

The arm may be partially cropped by the left viewport edge.

The hand should visually point or reach toward the phone side.

## 9.4 Scale

Large enough to dominate the lower-left half of the composition.

Do not reduce it to a small decorative object.

## 9.5 Scroll-linked movement

The hand should already be visible when the Connect section enters.

As the user continues scrolling through the final part of the section:

```text
hand gradually reaches farther toward the phone
```

Desired progression:
- at the beginning of Connect, the hand is already present in its initial visible position;
- during downward scroll through the section, the arm shifts / extends toward the phone;
- by the end of the section, the hand almost reaches the phone, but does not fully grab it.

This should feel like a subtle closing gesture.

## 9.6 Motion rules for the hand

The hand movement must be:
- tied to scroll progress;
- smooth and restrained;
- primarily a horizontal / diagonal reach toward the phone;
- free of bouncing or elastic overshoot unless later requested.

Do not make the hand fly dramatically across the screen.

The movement should feel controlled and natural.

## 9.7 Tattoo-link attachment rule

The clickable tattoo links are attached to the arm.

That means:
- `email >` and `telegram >` remain locked to the arm surface;
- they move together with the hand during the scroll-linked reach;
- their clickable hit areas must remain aligned with the visible tattoo text;
- they do not remain fixed in page space while the arm moves.

---

# 10. Contact "tattoo" links on the arm

## 10.1 Role

Contact methods are visually embedded on the arm like tattoos.

They are both:
- part of the visual composition;
- real clickable links.

## 10.2 Content

Based on the sketch, current visible labels are:

```text
email >
telegram >
```

Additional contacts may be added later only if explicitly specified.

## 10.3 Typography

```text
Font:
var(--font-display) / supplied Portfolio Display face or a visually bold compatible treatment
```

The sketch shows bold, graphic labels.

Color:

```text
#313131
```

unless later adjusted with final art direction.

## 10.4 Placement

Reference intent:

```text
placed along the forearm
angled to match the arm direction
```

The labels should follow the visual flow of the arm and feel naturally "tattooed" onto it.

## 10.5 Clickability

These labels must be implemented as real interactive links.

Recommended mapping:

```text
email >     → mailto:koftakrot@gmail.com
telegram >  → https://t.me/sirmoosham
```

The visual text remains integrated into the arm, but functionally it must behave like real links.

## 10.6 Interaction

On hover:
- allow subtle underline;
- or slight opacity / brightness shift;
- or a very subtle nudge.

Do not use button boxes or heavy hover effects.

## 10.7 Accessibility

Each tattoo-link must remain keyboard focusable and screen-reader accessible.

---

# 11. Phone graphic

## 11.1 Role

Decorative and kinetic object balancing the composition on the right side.

## 11.2 Asset

Retro / old mobile phone illustration.

Use the supplied production asset.

## 11.3 Placement

Reference intent:

```text
right side
mid-right / upper-right vertical zone
slightly angled
```

The phone remains clearly separated from the hand.

## 11.4 Behavior

The phone periodically "vibrates".

This is a required subtle animation.

### Vibration concept

The phone should:
- briefly shake / vibrate;
- slightly increase and decrease in size during that vibration;
- then stop;
- then remain still for a while;
- then vibrate again.

The effect should feel like intermittent incoming-call vibration.

### Scale pulse

During each vibration burst, the phone should also pulse in scale by approximately:

```text
3%–5%
```

Recommended starting range:

```text
scale(1) → scale(1.03 to 1.05) → scale(1)
```

The scale pulse should be synchronized with the vibration and remain subtle.

### Recommended motion feel

Short burst example:

```text
0ms    rotate(0deg)  translateX(0)   scale(1)
40ms   rotate(-2deg) translateX(-2px) scale(1.03)
80ms   rotate(2deg)  translateX(2px)  scale(1.05)
120ms  rotate(-1deg) translateX(-1px) scale(1.03)
160ms  rotate(1deg)  translateX(1px)  scale(1.02)
200ms  rotate(0deg)  translateX(0)    scale(1)
```

Then pause for several seconds before repeating.

Exact values may be tuned, but the animation should remain subtle.

## 11.5 Rules

- vibrate only the phone, not the whole section;
- apply the scale pulse only to the phone, not the whole section;
- do not make the vibration constant and nonstop;
- do not make the movement too strong or comedic;
- keep the effect lightweight.

## 11.6 Reduced motion

With:

```css
prefers-reduced-motion: reduce
```

remove or heavily simplify both the vibration and the scale pulse.

---

# 12. Small bottom micro-copy

## 12.1 Role

A tiny disclaimer / closing note at the bottom center.

The supplied sketch contains a small phrase roughly like:

```text
If you steal this portfolio idea, I WON'T MIND
WE ALL STEAL, then create our own thing
```

This should be treated as draft placeholder copy unless later finalized.

## 12.2 Typography

```text
Font:
Cascadia Mono

Color:
#000000
```

Optional emphasis inside the line may use:
- heavier weight;
- #000000 / #313131 only, unless final copy explicitly introduces accent treatment.

## 12.3 Placement

Reference intent:

```text
bottom-center
very small
subtle but readable
```

The text should not compete with the main phrase.

---

# 13. Layout relationships

Recommended composition logic:

```text
upper-left:
main display phrase

below it:
supporting body copy

lower-left to center:
hand / arm

on forearm:
tattoo contact links

right side:
phone graphic

bottom-center:
micro-copy
```

Maintain generous negative space between the hand and the phone.

Do not crowd the middle with extra elements.

---

# 14. Layering

Recommended stack:

```text
Layer 0:
blue background

Layer 1:
main phrase
supporting text
micro-copy

Layer 2:
hand / arm visual

Layer 3:
tattoo contact links
phone graphic

Layer 4:
fixed compact header
```

If link hit areas need to sit above the arm, ensure they remain aligned visually with the tattoo labels.

---

# 15. Motion summary

Required motion in Connect:

```text
1. scroll-linked hand reach toward the phone
2. tattoo links moving together with the hand
3. phone periodic vibration + subtle scale pulse
```

No other motion is required by default.

Do not automatically animate:
- the main headline;
- the supporting text;
- the micro-copy.

Do not add extra floating / idle animation to the hand beyond the scroll-linked reach.

---

# 16. Scroll behavior

Connect uses normal page scroll only.

No section pinning.
No scroll hijacking.

However, the section contains one scroll-linked internal relationship:

```text
as scroll progresses through Connect,
hand reaches closer toward the phone
```

This is not a pinned animation sequence.
It is a normal in-flow section with a scroll-reactive hand position.

The phone vibration and scale pulse run independently of page scroll while the section is visible.

Recommended optimization:
- run the vibration / scale pulse only when Connect is in or near the viewport;
- pause them when the section is far outside the viewport if needed for performance.
- compute the hand reach from local section scroll progress.

---

# 17. Typography roles

```text
Main display phrase:
var(--font-display) / supplied Portfolio Display face

Supporting text:
Cascadia Mono

Micro-copy:
Cascadia Mono

Header:
Cascadia Mono
```

No additional font families.

---

# 18. Color roles

```text
Background:
#99E6FF

Primary display text:
#000000

Secondary display text:
#313131

Supporting text:
#000000

Tattoo links:
#313131

Optional text emphasis:
#FACA2B
```

Stay within the approved global palette.

---

# 19. Responsive direction

A dedicated mobile reference should be defined later.

## Tablet / smaller desktop

Preserve:
- large left-side phrase;
- compact text block;
- strong hand presence;
- clear phone separation;
- tattoo links remaining readable and clickable;
- subtle phone vibration.

## Mobile

Do not simply scale the desktop layout.

Likely mobile priority order:

```text
headline
supporting text
hand with contact links
phone
micro-copy
```

The exact mobile arrangement requires a dedicated mobile sketch.

---

# 20. Codex implementation rules

Codex may:
- use the hand asset plus absolutely positioned link overlays;
- animate the hand position based on local Connect scroll progress;
- keep the tattoo-link hit areas attached to the moving arm;
- use a subtle looping vibration + scale-pulse animation for the phone;
- implement tattoo labels as real anchor elements positioned over the arm;
- keep the compact fixed header through the final section.

Codex may NOT:
- turn the footer into a generic small-link bar;
- hide the contact links in a menu;
- replace the tattoo idea with ordinary buttons;
- add a background behind the header;
- make the phone shake constantly with no pause;
- make the phone grow/shrink excessively;
- move the tattoo links independently from the arm;
- make the hand overshoot dramatically or touch the phone fully unless instructed later;
- introduce new colors;
- clutter the composition with extra elements.

---

# 21. Content / asset TODO

Before production completion:

```text
TODO:
Replace placeholder supporting text with final copy.

TODO:
Replace placeholder micro-copy with final final text if needed.

CONFIRMED:
Hand asset: /assets/connect/hand.png

CONFIRMED:
Phone asset: /assets/connect/phone.png

CONFIRMED:
Email: koftakrot@gmail.com

CONFIRMED:
Telegram: @sirmoosham
Link: https://t.me/sirmoosham

TODO:
Create mobile Connect reference.
```

---

# 22. Acceptance criteria

Connect is correct when:

- it works as the final footer / closing section;
- the compact fixed header remains visible and transparent;
- the main phrase appears large on the upper-left;
- supporting body copy sits below it;
- the realistic hand dominates the lower-left / center-left;
- during scroll through Connect, the hand moves closer toward the phone;
- `email >` and `telegram >` appear on the arm as real clickable tattoo-like links;
- the tattoo links stay attached to the hand while it moves;
- the retro phone sits on the right and periodically vibrates with a subtle 3%–5% scale pulse;
- the bottom-center micro-copy is present and subtle;
- no generic footer UI replaces the composition;
- no unapproved motion or controls are added;
- the section preserves the global palette and typography system.
