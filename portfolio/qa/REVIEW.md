# Desktop prototype verification

Date: 2026-10-09. Tested in the Codex in-app Chromium browser.

## Desktop layout

| Viewport | Horizontal document width | Broken images | Settled Journey positions |
| --- | --- | --- | --- |
| 1280 × 720 | 1280px | None detected | 0 / -1280 / -2560px |
| 1440 × 810 | 1440px | None detected | 0 / -1440 / -2880px |
| 1600 × 900 | 1600px | None detected | 0 / -1600 / -3200px |

Captured and inspected Hero, About, all three Journey panels, both Made screens and Connect at the required widths. Screenshots are in `screenshots/`. Anchor/layout measurements are in `desktop-measurements.json`.

## Behavior verified in browser

- One persistent fixed transparent header and one ME image; header reaches its compact right-side state at About.
- SOOOOO moves with page scroll and has no autonomous loop. ME settles into About and then scrolls away with that section. Resume phrase does not remain in About.
- Journey's sticky stage stays at viewport top during the sequence, reaches exact panel boundaries, and releases into normal page flow after panel 03.
- Wheel input inside the works strip changes horizontal position while page scroll stays still. Wheel input outside resumes vertical page scroll. Manual keyboard browsing also works.
- All five MP3s play after explicit player activation. Their duration, selected cover and exact confirmed display title were checked.
- Player toggles play/pause and preserves position on resume. Enter and Space activate player and front cover. Cover changes stop playback, select the next source at zero, and hide the title until deliberate playback.
- Deck wraps from track 05 back to track 01. Its total transition duration is 380ms, split across outgoing and reorder phases.
- Tattoo anchors remain visible, focusable and attached to the hand; URLs match the specification.
- Hand reaches toward the phone while Connect remains in normal flow; a visible final gap remains. Phone uses an intermittent 200ms vibration/scale burst with a 5-second pause.
- No application warnings or console errors observed in browser QA.

Wheel behavior was exercised with browser-native wheel input, including its momentum. Physical mouse and trackpad hardware were not separately tested.

## Reduced motion

A temporary browser fixture forced the application's reduced-motion preference and applied the existing reduced-motion stylesheet rules. The fixture was removed afterward and is not part of the production application.

Verified:

- automatic works movement stays stopped, while ArrowRight still browses;
- cover cycling remains functional with a zero-duration transition and no autoplay;
- playing-track title is visible and static (`animation-name: none`, `transform: none`); long names wrap in the left text area so they remain readable without movement;
- phone vibration is disabled;
- hand travel is reduced to 15% of its standard travel;
- Journey's reduced linear progression retains exact endpoint boundaries in automated tests.

This checks reduced-mode behavior through a simulated preference; the operating system's global preference was not changed.

## Automated checks

`npm test`: four passing tests covering Journey clamps/settled boundaries, monotonic resistance without overshoot, reduced transition mapping, all 28 unchanged asset copies, and exact track titles/source uniqueness.

`npm run build`: production bundle builds successfully.

## Deferred by specification

Final mobile/tablet art direction, final body copy and emphasis, final track-title typography polish, provisional display-font/arrow replacement, and production image optimization. No new artwork, colors, controls or decorative motion were introduced.
