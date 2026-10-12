# Final responsive baseline QA

Date: 2026-10-12. The approved visual design was preserved.

## Viewports and visual review

Development and production previews were inspected at the following sizes:

| Viewport | Composition | Horizontal page overflow |
| --- | --- | --- |
| 1600 × 900 | Desktop | None |
| 1440 × 900 | Desktop | None |
| 1280 × 900 | Desktop | None |
| 1024 × 900 | Existing desktop composition | None |
| 768 × 844 | Mobile | None |
| 430 × 844 | Mobile | None |
| 390 × 844 | Mobile | None |

Hero, About, Journey, Made 01, Made 02, and Connect were captured at every width (42 section screenshots). Main text containers had no horizontal text overflow. Artwork cropping and oversized Hero-letter clipping were reviewed separately from page overflow.

At 1024px, the existing desktop composition has artwork/heading overlap in About, Made 01, and Connect; the About arrow can be obscured by ME. These are retained visual-baseline observations, not newly introduced runtime defects. They were not redesigned during QA. Mobile sections taller than the viewport remain naturally scrollable.

## Functional checks

| Feature | Verification |
| --- | --- |
| Header navigation | All four desktop and mobile links navigate to their targets. Journey navigation returns to Panel 01. |
| Desktop Header contrast | Black on blue; masked white copy over foreground content; the original header remains interactive. |
| Mobile Header | Burger/X and menu reveal retain approved geometry; item activation closes the menu; Escape closes it and returns focus to the toggle. |
| Mobile Header contrast | White strokes/letters over Journey photographs and ME; black portions over blue; duplicate layer is hidden from accessibility and non-interactive. |
| Hero / ME | Start, midpoint, About endpoint, and reverse-to-start inspected at all seven widths. Reverse transforms match initial transforms; desktop header resolves from 32px to 18px. |
| About | Current copy, emphasis, rectangular bounds, arrow and ME reviewed; no layout changes applied. |
| Desktop Journey | Stationary-cursor About → 01 → 02 → 03 → Made and reverse sequence passes. Tracks settle at 0, −1440, −2880px at 1440px. PageDown/PageUp with page focus also advance/reverse correctly. |
| Mobile Journey | Native forward/reverse vertical scrolling through all panels into Made passes. No sticky stage, horizontal transform, or snap points. |
| Made 01 | Idle marquee, wheel control, keyboard arrows and inertial decay checked. Wheel input inside the desktop gallery keeps page Y fixed; input outside resumes page scrolling. Touch direction-lock and inertia are covered by controller tests. |
| Made 02 covers | Keyboard and pointer cycling advances the active cover in order, preserves nested geometry, and selects the mapped track. |
| Made 02 audio | All five sources play with readyState 4 and advancing currentTime. Each cover/title/source mapping matches. Changing covers while playing pauses the old track and does not autoplay the new one. |
| Player / track title | Enter activates playback; Space activates cover cycling; play/pause feedback retains the existing state-specific spring configuration. Title runs during playback, is clipped, and is hidden on pause/change. Loop endpoints and duration are derived from full title/viewport width. Mobile equal-spacing and deck alignment were previously measured and remain unchanged. |
| Connect | Scroll-linked hand movement/reverse and independent mobile artwork positioning checked. Phone animation was observed with a roughly 4.7% pulse plus rotation/translation, followed by rest. |
| Email | Approved `mailto:koftakrot@gmail.com` target verified. Delivery was not tested. |
| Telegram | `https://t.me/sirmoosham` resolves to the expected Telegram contact page. |
| Keyboard/accessibility | Header Tab/Enter, mobile toggle Enter/Escape, Journey page keys, gallery arrows, player Enter and cover Space tested. Focus-visible styling is present; mobile contact targets are 44px high; contrast duplicates are inert and aria-hidden. |
| Reduced motion | Automated reduced-motion checks verify immediate Journey/boundary settling in both directions and static gallery idle with direct keyboard control preserved. CSS/JS review confirms disabled title looping, cover transitions, phone pulse, and player spring under the preference. |
| Assets / console | Production font and asset loading, all mapped source/public asset pairs, and audio files checked. No application console errors observed in development or production. Production smoke test emitted no warnings/errors. |

## Bugs fixed during this QA pass

1. Journey English body copy was marked `lang="ru"`; corrected to `lang="en"` for screen-reader pronunciation.
2. The HTML preload still requested the retired Arial Black font; changed to the existing approved Montserrat Black WOFF2 URL.

No typography, layout, color, artwork, animation timing, or interaction design was changed. The asset parity test now includes the active display font and accounts for its different source/public directory names. Two reduced-motion regression tests were added.

## Results and limits

- `npm test`: 14 passed, 0 failed.
- `npm run build`: passed (Vite 7.3.7).
- Production output was smoke-tested at `http://127.0.0.1:4173/`, including responsive bounds and audio playback.
- `git diff --check`: passed.
- Physical iOS/Android touch and device audio behavior were not exercised. Touch gestures/inertia were verified with controller tests and mobile viewport browser checks.
- The browser tool cannot override the OS reduced-motion preference; that check uses automated controller tests and stylesheet/handler review rather than an OS-level visual test.

The commit for this report and the approved responsive implementation uses the message `final responsive visual baseline`.
