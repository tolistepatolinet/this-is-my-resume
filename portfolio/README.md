# Desktop portfolio prototype

Vite with vanilla HTML, CSS and JavaScript. No animation framework or component library.

## Run

```sh
npm install
npm run dev
```

The local preview is at `http://127.0.0.1:5173/`.

```sh
npm test
npm run build
npm run preview
```

Requires a Node version supported by Vite 7 (Node 20.19+ or 22.12+).

## Calibration and content

- `src/styles/tokens.css`: fonts, palette, type roles, spacing, art placement, section dimensions, header endpoints, cover hover/exit, title timing and phone motion timing.
- `src/interactions/config.js`: Hero/ME geometry, transition range, Journey resistance and holds, marquee speed/input sensitivity, deck timing, player press and hand travel.
- `src/data/content.js`: draft body copy, isolated from layout and interaction code.
- `src/data/journey.js`: exact role order, metadata and image mappings.
- `src/data/made.js`: works order/intrinsic dimensions and all five confirmed cover/audio/title mappings.

Source production files remain in `assets/`. Identical copies in `public/assets/` are served by Vite and included in the build. No artwork was edited or trimmed. Transparent canvas bounds are compensated for in CSS.

## Scroll architecture

One persistent header and one ME image. Hero, header and ME share normalized progress measured from native page scroll. ME's destination includes About's document offset, so the image leaves with About afterward. The resume phrase is clipped/released with Hero.

Journey uses a 300svh wrapper and a 100svh sticky stage. The horizontal track moves from native scroll progress. Ease-in resistance and short holds preserve exact settled panel boundaries; the wrapper end releases the stage into Made.

Made's wheel listener is attached only to its works region. The gapless repeated strip wraps its measured width, preserving manual movement in either direction. Playback state comes from audio events. Cover selection stops audio and selects the next source at zero without autoplay.

Connect stays in normal flow. The hand and contact anchors share a transformed wrapper. A separate phone layer preserves its resting angle while the vibration/pulse runs only near the viewport.

## Scope

Desktop prototype at 1280, 1440 and 1600px. Final mobile art direction, final copy, display-font replacement and production asset optimization remain deferred as specified. Current arrow artwork is provisionally accepted by `CODEX_CLARIFICATIONS.md`.

See `qa/REVIEW.md` and `qa/screenshots/` for verification and visual review captures.
