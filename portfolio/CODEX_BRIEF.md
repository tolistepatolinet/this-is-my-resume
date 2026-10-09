# CODEX_BRIEF.md

> Primary implementation brief for the first desktop prototype of the portfolio site.

---

# 1. Goal

Build the first working **desktop prototype** of this portfolio as one continuous page.

The design is already defined. Your role is implementation, not art direction.

Do not redesign, normalize, simplify, modernize, or replace the supplied compositions with conventional website patterns.

---

# 2. Read these files before coding

Read in this order:

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

Then inspect the visual references in:

```text
/references/
```

Written specifications take priority over visual guesswork.

---

# 3. Scope of this build

Build desktop first.

Primary visual reference width:

```text
1440px
```

The layout must remain stable at nearby desktop widths such as 1280px and 1600px, but do **not** invent the final mobile layout yet.

Mobile/tablet design will be handled after desktop visual approval.

---

# 4. Content status

Some body copy is intentionally placeholder text.

Do not block implementation waiting for final copy.

Keep copy easy to replace later:
- store repeated panel content in data objects where useful;
- do not bake text into images;
- avoid layout architecture that depends on one exact placeholder sentence.

Final body copy will be added after the first visual prototype.

---

# 5. Assets

The user will place the supplied production `assets/` folder at the project root/public asset location appropriate to the existing stack.

Use the exact mappings in `ASSETS.md`.

Do not edit artwork files.
Do not substitute images.
Do not recolor them.
Do not generate replacements.

Reference screenshots are not production assets.

---

# 6. Fonts

Use the supplied local font files only.

Define the supplied display face through a custom family alias so the browser always uses the provided file:

```css
@font-face {
  font-family: "Portfolio Display";
  src: url("/assets/fonts/arial-black/Arial-Black.woff") format("woff");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
```

Use Cascadia Mono Regular/Bold for body/UI.

Do not substitute Google Fonts or system fonts.

---

# 7. Build architecture

Prefer one persistent page shell and one persistent Header component.

Recommended component/data separation:

```text
App/Page
├── Header
├── Hero
├── About
├── Journey
│   └── JourneyPanel × 3
├── Made
│   ├── MadeMarquee
│   └── MadeAudioDeck
└── Connect
```

Recommended data collections:
- Journey panels;
- Made marquee works;
- cover / audio / title mapping.

Do not over-componentize purely decorative fragments if it makes positioning harder.

---

# 8. Tunable values

Put values likely to receive visual-polish adjustments into CSS custom properties or a small config layer rather than scattering magic numbers.

Especially expose:

```text
Hero marquee speed / travel
Hero ME start/end transform
Header Hero size
Header settled size
Header settled x-position
Hero → About transition range
Journey panel transition distance
Journey resistance/easing
Journey pinned scroll length
Made marquee speed
Made manual-scroll sensitivity
Made cover hover scale
Made deck transition duration
Made player press depth
Track-title marquee speed/distance
Connect hand travel distance
Phone vibration intensity
Phone scale pulse
```

The first build is expected to receive small visual refinements later.

---

# 9. Implementation order

Implement in this order:

## Phase 1 — foundation

- local fonts;
- global colors/tokens;
- global container/grid utilities;
- page background;
- persistent Header with Hero and settled states.

## Phase 2 — static compositions

Match the references before adding complex motion:

- Hero;
- About;
- all Journey panels;
- Made Screen 01;
- Made Screen 02;
- Connect.

At 1440px the static layout should visually resemble the references before continuing.

## Phase 3 — Hero motion

Implement simultaneously:
- `SOOOOOOOOOOO` right-to-left scroll-linked movement;
- `ME` movement Hero → About;
- Header shrink + right shift.

## Phase 4 — Journey

Implement pinned horizontal progression with 3 panels and the specified slight resistance behavior.

## Phase 5 — Made

Implement:
- infinite works marquee;
- wheel-to-horizontal control only while pointer is over the marquee;
- cover-deck cycling;
- cover hover state;
- player spring press;
- cover ↔ audio ↔ title synchronization;
- play/pause;
- playing-track title marquee.

## Phase 6 — Connect

Implement:
- contact tattoo links;
- scroll-linked hand reach;
- periodic phone vibration + 3–5% scale pulse.

## Phase 7 — QA

Test:
- 1280px;
- 1440px;
- 1600px;
- mouse wheel;
- trackpad;
- keyboard interaction;
- reduced-motion preference.

---

# 10. Important interaction rules

## Header

One component only.
Never disappear.
Never gain a background.
Hero state → smoothly transforms → settled state.

## Journey

Vertical wheel input controls the horizontal sequence only while Journey is pinned.
After panel 03, normal page scrolling must resume reliably.

## Made marquee

Do not permanently hijack page scroll.
Only convert wheel motion to horizontal marquee browsing while pointer is over the marquee.
On pointer exit, normal page scroll must work immediately.

## Audio

Never autoplay.
A cover change selects a track but does not automatically start it.

## Connect

Hand movement is scroll-linked but the section itself is not pinned.

---

# 11. Animation technology

Use the existing project stack where possible.

CSS is preferred for simple hover/press/loop effects.
For complex scroll-linked choreography, use the lightest reliable approach supported by the project.

Do not add a large animation dependency only for trivial effects.
If a scroll library is already installed, reuse it.

Whatever implementation is chosen must remain easy to tune.

---

# 12. Accessibility / behavior

Required:
- semantic anchors/buttons;
- keyboard activation for player and front cover;
- visible focus state;
- `prefers-reduced-motion` support;
- no audio autoplay;
- contact links are real links;
- no permanent scroll traps.

---

# 13. What Codex must not do

Do not:
- redesign the site;
- add gradients;
- add generic cards;
- add glassmorphism;
- add shadows unless explicitly present in supplied assets;
- add rounded UI containers;
- change the palette;
- change fonts;
- invent section titles;
- add decorative animation;
- change section order;
- build the final mobile design yet;
- replace artwork;
- introduce placeholder stock imagery.

---

# 14. First-build completion criteria

The first desktop prototype is ready for review when:

1. all sections exist in the correct order;
2. 1440px composition closely matches references;
3. Header has both required states;
4. Hero scroll choreography works;
5. Journey progresses through all 3 panels and releases correctly;
6. Made marquee and manual wheel interaction work without trapping scroll;
7. cover deck / audio / title mapping works for all 5 tracks;
8. Connect hand and phone animations work;
9. local fonts load correctly;
10. no console errors occur;
11. project builds successfully;
12. desktop remains usable at 1280px and 1600px.

After this milestone, stop and wait for visual-polish feedback before inventing additional behavior.
