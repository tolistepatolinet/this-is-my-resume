Header contrast enhancement
===========================

The original header remains the only interactive navigation. An inert,
aria-hidden copy follows its inline layout variables and uses a canvas-generated
alpha mask. The mask uses current image geometry, original artwork transparency,
ancestor clipping and rounded cover boundaries, plus visible text glyphs.
It updates every animation frame, independently of the existing scroll controller.
Future approved solid foreground blocks can opt in with
`data-header-contrast-region`.

Remove the `initHeaderContrast` import and call in `src/main.js` to disable the
enhancement. Its CSS is imported by its own module. No existing header layout,
navigation, typography or section animation implementation was changed.

Browser verification at 1440 × 810:
- Base and contrast layers have identical bounds and font sizes at the Hero
  endpoint, during Hero → About, and at the settled endpoint.
- Journey photo edge crosses the final letter of “made”; the photo-covered
  portion is white while the blue-covered portion stays black.
- The contrast copy is pointer-events none and absent from accessible navigation.
- Reverse scrolling returns to the original black header on blue.
- No browser errors or warnings were recorded.
- Build and the six existing behavior/asset tests pass.

Evidence: `screenshots/header-contrast-partial.jpg`.
