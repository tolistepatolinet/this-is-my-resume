# SITE_STRUCTURE.md

> Global page structure and section-flow specification.
> This document defines how all major sections connect to each other.
> Visual rules come from `DESIGN_SYSTEM.md`.
> Section-specific details come from the individual section files.

---

# 1. Document priority

Codex should read project specifications in this order:

```text
1. CODEX_BRIEF.md
2. DESIGN_SYSTEM.md
3. SITE_STRUCTURE.md
4. ASSETS.md
5. sections/HERO.md
6. sections/ABOUT.md
7. sections/JOURNEY.md
8. sections/MADE.md
9. sections/CONNECT.md
```

If rules conflict:

```text
latest explicit section specification
↓
SITE_STRUCTURE.md
↓
DESIGN_SYSTEM.md
↓
reference image
↓
implementation judgement
```

Codex must not silently reinterpret higher-priority rules.

---

# 2. Final desktop page order

The site is one continuous page.

```text
PAGE

├── Global Header
│
├── Hero
│
├── About
│
├── Journey
│   ├── Panel 01
│   ├── Panel 02
│   └── Panel 03
│
├── Made
│   ├── Screen 01
│   └── Screen 02
│
└── Connect / Footer
```

There are no separate internal pages required for this first version.

---

# 3. Global header

Navigation:

```text
about
journey
made
connect
```

Each item links to its corresponding section.

The header is one persistent component across the entire site.

Do NOT create separate header instances per section.

---

# 4. Header state system

The header has 2 visual states.

## State A — Hero

Used only in Hero.

Properties:

```text
larger
more spread across the viewport
fixed at top
transparent
clickable
Cascadia
#000000
```

## State B — Settled

Used from About onward.

Properties:

```text
smaller
shifted toward the right
fixed at top
transparent
clickable
Cascadia
#000000
```

Used in:

```text
About
Journey
Made
Connect
```

## Transition

During Hero → About scroll:

```text
State A
↓ smooth scroll-linked interpolation
State B
```

The header:
- stays visible;
- stays clickable;
- does not gain a background;
- does not disappear or swap components.

---

# 5. Hero

Specification:

```text
sections/HERO.md
```

Primary behavior:

```text
full-screen opening composition
```

Key motion:

```text
SOOOOOOOOOOO
scroll-linked marquee
right → left

ME
moves toward About

header
shrinks + shifts right

this is my resume//
remains fixed during initial transition
```

Hero leads directly into About.

---

# 6. Hero → About transition

This is the first major continuous page transition.

The following happen simultaneously:

```text
SOOOOO marquee moves horizontally
ME moves into About
header transforms from Hero state to settled state
```

The transition should feel continuous.

Do not treat Hero and About as unrelated screen changes.

---

# 7. About

Specification:

```text
sections/ABOUT.md
```

Main composition:

```text
left:
WHO that boy:
body copy

center:
yellow arrow

right:
ME
```

Behavior after Hero transition:

```text
ME settles
header settles
About content remains static
```

About uses normal vertical page flow.

---

# 8. About → Journey

Transition is normal vertical scrolling.

No special pinned transition is required between the two sections.

Once Journey reaches its trigger point:

```text
Journey becomes the active pinned horizontal sequence
```

---

# 9. Journey

Specification:

```text
sections/JOURNEY.md
```

Journey contains:

```text
Panel 01:
PHYSICAL THERAPY ASSISTANT

Panel 02:
BARTENDER

Panel 03:
CONTENT SPECIALIST
```

Desktop behavior:

```text
vertical scroll
↓
Journey pins
↓
horizontal panel progression
01 → 02 → 03
↓
Journey releases
```

Each panel is a complete unit:

```text
left image
+
right text
```

The right-side text moves with its own panel.

---

# 10. Journey panel transition behavior

The panel movement has slight resistance.

Desired behavior:

```text
current panel settled
↓
user scrolls
↓
next panel appears slightly
↓
movement accelerates
↓
next panel fully takes over
```

The next panel is visible only during transition.

When a panel is settled:

```text
no permanent visible slice of the following panel
```

Header remains fixed in settled state.

---

# 11. Journey → Made

After Panel 03 completes:

```text
Journey unpins
↓
normal vertical page flow resumes
↓
Made Screen 01 enters
```

No special horizontal transition continues into Made.

---

# 12. Made

Specification:

```text
sections/MADE.md
```

Made consists of two normal vertical screens.

```text
Made Screen 01
↓
normal vertical scroll
↓
Made Screen 02
```

No section-level pinning.

---

# 13. Made Screen 01

Composition:

```text
upper-left:
WHAT i've already
MADE:

upper-right:
laptop graphic

lower area:
horizontal portfolio marquee
```

Portfolio marquee:

```text
approximately 6 images
edge-to-edge / tightly adjacent
continuous slow right → left loop
```

Interaction:

```text
pointer outside marquee:
normal page scroll
automatic marquee active

pointer over marquee:
wheel / trackpad controls horizontal movement
automatic motion yields to user interaction

pointer leaves:
normal vertical page scroll resumes
automatic marquee resumes
```

Do not permanently trap page scrolling.

---

# 14. Made Screen 02

Composition:

```text
upper-left:
...and THIS, too

left:
audio player

lower-left:
body copy

right:
interactive cover deck
```

Cover deck behavior:

```text
front cover hover
→ subtle scale up

front cover click
→ current cover moves to back
→ next cover becomes front
```

Example:

```text
A B C D
↓
B C D A
```

No automatic cover cycling.

---

# 15. Made audio synchronization

Each cover has one associated audio track.

```text
Cover 01 ↔ Track 01
Cover 02 ↔ Track 02
Cover 03 ↔ Track 03
...
```

The front cover defines the active track.

Player behavior:

```text
click player
→ play / pause active track
```

If the active cover changes while audio is playing:

```text
current track stops / pauses
new front cover becomes selected
new track does NOT autoplay
user must press play again
```

No autoplay anywhere on the site.

While the active track is playing, its confirmed title runs in a small right-to-left marquee emerging from behind the player. The title animation stops when playback stops.

---

# 16. Made → Connect

Normal vertical page transition.

No pinning.

No special section takeover.

The compact settled header remains active.

---

# 17. Connect / Footer

Specification:

```text
sections/CONNECT.md
```

Composition:

```text
upper-left:
large display phrase

below:
supporting copy

lower-left / center:
hand with tattoo contact links

right:
phone

bottom-center:
micro-copy
```

---

# 18. Connect scroll behavior

Connect remains in normal page flow.

The hand reacts to local Connect scroll progress:

```text
start:
hand already visible

scroll deeper:
hand gradually reaches toward phone

end:
hand almost reaches phone
```

No section pinning.

Tattoo links move together with the arm.

---

# 19. Phone animation

The phone periodically performs:

```text
short vibration
+
3%–5% scale pulse
```

Then remains still for several seconds.

Animation should feel like an incoming call.

The phone should not shake continuously.

---

# 20. Global scroll map

Desktop flow:

```text
HERO
│
│ scroll-linked:
│ SOOOOO moves
│ ME moves
│ header transforms
↓
ABOUT
│
│ normal vertical scroll
↓
JOURNEY
│
│ pinned horizontal sequence
│ 01 → 02 → 03
↓
MADE SCREEN 01
│
│ normal vertical scroll
│ marquee runs independently
↓
MADE SCREEN 02
│
│ normal vertical scroll
│ interactive deck + audio
↓
CONNECT
│
│ normal vertical scroll
│ hand reaches toward phone
↓
END
```

---

# 21. Scroll interaction hierarchy

Important rule:

The website uses multiple different scroll interactions.
They must not interfere with each other.

Priority by section:

## Hero

```text
vertical page scroll controls Hero animations
```

## About

```text
normal vertical scroll
```

## Journey

```text
vertical scroll controls horizontal panel sequence
while Journey is pinned
```

## Made Screen 01

```text
normal page scroll by default

ONLY while pointer is over marquee:
wheel controls marquee horizontally
```

## Made Screen 02

```text
normal page scroll
cover deck interaction uses click
audio uses click
```

## Connect

```text
normal page scroll
local scroll progress moves hand
```

Codex must ensure no interaction leaves the page permanently scroll-locked.

---

# 22. Global background continuity

Default site background:

```text
#99E6FF
```

The blue background should visually connect the page.

Do not introduce section background colors without explicit instruction.

Journey image halves are visual content, not new page background tokens.

---

# 23. Typography continuity

Global typography:

```text
Cascadia
primary body / navigation / interface

Arial Black Regular
large display typography
```

Do not introduce additional font families.

---

# 24. Global color roles

Mandatory site-wide mapping:

```text
#99E6FF
global background

#FACA2B
accent / selected words / SOOOOO / graphic accents

#000000
primary text

#313131
section headings / dark secondary display text
```

Do not reinterpret these roles per section unless a section specification explicitly defines a composition using the approved palette.

---

# 25. Section sizing philosophy

Default:

```text
Hero:
minimum 100svh

About:
approximately 100svh

Journey:
pinned viewport stage + extended scroll distance

Made Screen 01:
approximately 100svh

Made Screen 02:
approximately 100svh

Connect:
minimum 100svh
```

These are starting structural rules, not arbitrary fixed heights.

Content should not be clipped just to force exactly 100vh.

---

# 26. Global animation philosophy

Animation should be:
- purposeful;
- tied to interaction or narrative;
- restrained;
- smooth;
- free from unnecessary decorative movement.

Approved major animation systems:

```text
Hero:
marquee + ME transition + header transformation

Journey:
horizontal panel progression

Made Screen 01:
continuous marquee + manual browsing

Made Screen 02:
cover-deck interaction + audio control

Connect:
hand reach + phone vibration / scale pulse
```

Do not invent additional animation systems.

---

# 27. Reduced motion

All major motion systems should respect:

```css
@media (prefers-reduced-motion: reduce)
```

Recommended simplification:

```text
Hero:
reduce marquee and ME movement

Journey:
simplify transitions

Made marquee:
disable automatic motion, keep manual browsing

Cover deck:
keep functional interaction with reduced transition

Phone:
disable or simplify vibration

Hand:
reduce travel distance or use simpler transition
```

Functionality should remain available even when motion is reduced.

---

# 28. Section anchors

Recommended IDs:

```text
#about
#journey
#made
#connect
```

Header navigation should use these anchors.

Hero is the top of the page and does not require a nav link unless added later.

---

# 29. Desktop-first status

Current specifications primarily define the desktop experience.

Reference desktop:

```text
1440px
```

Mobile and tablet adaptation will be defined after the desktop documentation package is complete.

Codex must not invent a final mobile design without a later responsive specification.

---

# 30. Final specification files

```text
CODEX_BRIEF.md
DESIGN_SYSTEM.md
SITE_STRUCTURE.md
ASSETS.md
sections/HERO.md
sections/ABOUT.md
sections/JOURNEY.md
sections/MADE.md
sections/CONNECT.md
```

References are stored separately in `/references/` and are visual guides, not production assets.

---

# 31. Definition of page-flow done

The full desktop page flow is correct when:

1. Hero opens in its large composition.
2. Hero scroll animates SOOOOO, ME and header simultaneously.
3. ME arrives in About and stops.
4. Header remains in settled compact state after About.
5. About scrolls normally into Journey.
6. Journey pins and progresses horizontally through 3 panels.
7. Journey releases after panel 03.
8. Made Screen 01 scrolls normally and its image strip runs independently.
9. Made Screen 02 supports cover cycling and synchronized audio selection.
10. Connect scrolls normally while the hand reaches toward the phone.
11. Phone vibrates periodically with subtle scale pulse.
12. Header remains clickable throughout the whole page.
13. No section accidentally traps scrolling.
14. No unapproved visual or motion system is introduced.
