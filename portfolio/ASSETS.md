# ASSETS.md

> Production asset inventory for the portfolio website.
> This file is based on the actual contents of the supplied `assets.zip`.
> Use these exact paths unless the asset package is intentionally revised.

---

# 1. Package status

Production files found:

```text
20 image assets
5 audio tracks
3 font files
28 production files total
```

The archive also contained macOS service files (`.DS_Store`, `__MACOSX`, `._*`).
They are not production assets and must not be copied into the website project.

A cleaned archive with those files removed is supplied separately.

---

# 2. Required directory structure

```text
assets/
├── about/
├── connect/
├── fonts/
│   ├── arial-black/
│   └── cascadia/
├── hero/
├── journey/
└── made/
    ├── audio/
    ├── covers/
    └── marquee/
```

---

# 3. Hero

## Main `ME` asset

```text
Path:
assets/hero/me.png

Format:
PNG with transparency

Used in:
Hero
About

Purpose:
Persistent main character visual.

Behavior:
- starts in Hero;
- moves into About during scroll;
- must be treated as the same visual object.

Do not:
- recolor;
- add shadow;
- replace;
- flatten transparency.
```

Technical note:

```text
Canvas: 3655 × 4730
Visible alpha content occupies only part of the canvas.
There is substantial transparent padding, especially below the figure.
```

This is usable, but trimming transparent margins would make CSS positioning easier.

---

# 4. About

## Arrow

```text
Path:
assets/about/arrow.png

Format:
PNG with transparency

Canvas:
1254 × 1254

Purpose:
Yellow outlined arrow between About text and ME.

Behavior:
Static.
```

The file contains significant transparent padding around the arrow.
It is usable, but trimming is recommended for simpler positioning.

---

# 5. Journey

Panel order is fixed:

```text
01 → Physical Therapy
02 → Bartender
03 → Content Specialist
```

## Panel 01

```text
Path:
assets/journey/physical-therapy.webp

Size:
1280 × 1440

Format:
WebP
```

## Panel 02

```text
Path:
assets/journey/bartender.webp

Size:
1280 × 1440

Format:
WebP
```

## Panel 03

```text
Path:
assets/journey/content-specialist.webp

Size:
1280 × 1440

Format:
WebP
```

All three files use matching dimensions, which is ideal for Journey panel consistency.

---

# 6. Made — shared graphics

## Laptop

```text
Path:
assets/made/laptop.png

Size:
1254 × 1254

Format:
PNG with transparency
```

Used on Made Screen 01.

## Player

```text
Path:
assets/made/player.png

Size:
1254 × 1254

Format:
PNG with transparency
```

Used on Made Screen 02.

Behavior:
- clickable audio controller;
- press / spring animation;
- controls audio associated with the active front cover;
- active track title marquee appears while playback is active.
```

---

# 7. Made Screen 01 — marquee works

Exact sequence:

```text
01. assets/made/marquee/work-01.webp
02. assets/made/marquee/work-02.webp
03. assets/made/marquee/work-03.webp
04. assets/made/marquee/work-04.webp
05. assets/made/marquee/work-05.webp
06. assets/made/marquee/work-06.webp
→ repeat
```

Behavior:
- continuous slow right-to-left marquee;
- files sit directly next to each other;
- wheel / trackpad controls horizontal movement while pointer is over the strip;
- automatic movement resumes after interaction.

Source dimensions:

```text
work-01.webp — 3508 × 4961
```
```text
work-02.webp — 3240 × 1080
```
```text
work-03.webp — 1080 × 1920
```
```text
work-04.webp — 1080 × 1350
```
```text
work-05.webp — 5400 × 1080
```
```text
work-06.webp — 1080 × 1920
```

Important:
the six works have very different aspect ratios.
Implementation should use a shared marquee height with `width: auto` rather than forcing all images into one fixed aspect ratio.

Several source files are much larger than needed for browser display.
Web optimization is recommended before launch.

---

# 8. Made Screen 02 — cover deck

Current deck contains 5 covers.

Initial order:

```text
01. assets/made/covers/cover-01.jpg
02. assets/made/covers/cover-02.jpg
03. assets/made/covers/cover-03.jpg
04. assets/made/covers/cover-04.jpg
05. assets/made/covers/cover-05.jpg
```

All covers are:

```text
640 × 640
JPEG
```

Behavior:
- first item is the active / front cover;
- hover slightly enlarges front cover;
- click moves front cover to the back;
- next cover becomes active;
- repeat indefinitely.

## Approved cover format

These five supplied covers are JPEG files and therefore do **not** contain transparency.

This is intentional and approved for the current design.

Use the JPEG covers exactly as supplied.
Do not convert them to PNG solely to add transparency.

---

# 9. Made Screen 02 — audio

Current package contains 5 tracks:

```text
assets/made/audio/track-01.mp3
Duration: 42.48s
Bitrate: 320 kbps
Sample rate: 44100 Hz
Stereo: yes
```

```text
assets/made/audio/track-02.mp3
Duration: 48.01s
Bitrate: 320 kbps
Sample rate: 44100 Hz
Stereo: yes
```

```text
assets/made/audio/track-03.mp3
Duration: 48.01s
Bitrate: 320 kbps
Sample rate: 44100 Hz
Stereo: yes
```

```text
assets/made/audio/track-04.mp3
Duration: 48.01s
Bitrate: 320 kbps
Sample rate: 44100 Hz
Stereo: yes
```

```text
assets/made/audio/track-05.mp3
Duration: 47.52s
Bitrate: 320 kbps
Sample rate: 44100 Hz
Stereo: yes
```

All tracks are valid MP3 files.

No embedded track-title metadata was found, so the visible names for the player marquee must be supplied separately in `ASSETS.md` / application data.

---

# 10. Cover ↔ track ↔ title mapping

The required data relationship is:

```text
cover-01.jpg ↔ track-01.mp3 ↔ Moosham - Я.mp3
cover-02.jpg ↔ track-02.mp3 ↔ Cathou, Moosham - Я так дышу (alternative version).mp3
cover-03.jpg ↔ track-03.mp3 ↔ Moosham, Cathou - Хамелеон.mp3
cover-04.jpg ↔ track-04.mp3 ↔ Moosham - Accidentally.mp3
cover-05.jpg ↔ track-05.mp3 ↔ Moosham, lera blvmrkv - Солнце.mp3
```

Track display titles are confirmed and must be rendered exactly as listed above.

The title is:
- displayed in the small running line near the player;
- shown only while its track is playing;
- changed whenever a different cover becomes active.

Recommended application data structure:

```js
[
  {
    cover: "/assets/made/covers/cover-01.jpg",
    audio: "/assets/made/audio/track-01.mp3",
    title: "Moosham - Я.mp3"
  }
]
```

Do not infer titles from filenames.

---

# 11. Connect

## Hand

```text
Path:
assets/connect/hand.png

Size:
2172 × 724

Format:
PNG with transparency
```

Purpose:
- large arm visual;
- moves toward phone based on Connect scroll progress;
- clickable contact tattoos are positioned over / attached to it.

This asset has a tight canvas and is suitable for positioning.

## Phone

```text
Path:
assets/connect/phone.png

Size:
1254 × 1254

Format:
PNG with transparency
```

Behavior:
- periodic vibration;
- synchronized 3–5% scale pulse.

The phone has substantial transparent side margins.
Trimming is recommended for easier transform-origin and positioning.

---

# 12. Fonts

## Cascadia

Supplied:

```text
assets/fonts/cascadia/CascadiaMono-Regular.woff2
assets/fonts/cascadia/CascadiaMono-Bold.woff2
```

Detected family:

```text
Cascadia Mono
```

Available weights:

```text
Regular
Bold
```

Use:
- body;
- navigation;
- metadata;
- micro-copy;
- interface text.

Note:
the supplied font is specifically `Cascadia Mono`, not the proportional Cascadia variant.

## Display font

Supplied:

```text
assets/fonts/arial-black/Arial-Black.woff
```

Important validation result:

```text
Filename: Arial-Black.woff
Internal family: Arial
Internal full name: Arial Bold
Internal weight class: 700
```

This file identifies itself internally as **Arial Bold**, not Arial Black / weight 900.

Current decision:
- use this supplied font for the first implementation;
- treat it as the approved provisional display font;
- keep the typography system structured so the display font can be replaced later without changing section layout or markup.

If the visual result is not strong enough after implementation, replace only the display font asset / `@font-face` definition with a heavier or more suitable similar face, then retune font-size / line-height only if needed.

---

# 13. Transparent-asset positioning notes

The following assets contain large transparent margins:

```text
hero/me.png
about/arrow.png
made/player.png
connect/phone.png
```

They will work as-is, but CSS width/position values apply to the full transparent canvas, not only the visible drawing.

Recommended before final build:
- trim transparent canvas edges;
- keep a small intentional safety margin;
- do not alter the artwork itself.

`connect/hand.png` already has a tight canvas.

---

# 14. Performance notes

Current production asset payload is approximately:

```text
23.8 MB uncompressed
```

The largest visual files are primarily in the Made marquee.

Before deployment:
- resize very large marquee sources to the maximum real display resolution needed;
- export optimized WebP/AVIF where appropriate;
- lazy-load below-the-fold images;
- do not preload all five MP3 files;
- load audio on interaction or with `preload="metadata"` / `none`;
- preload only critical Hero resources and fonts.

Do not sacrifice visible image quality purely to minimize bytes.

---

# 15. Asset integrity rules

Codex must use these assets as supplied unless explicitly instructed otherwise.

Do not:
- recolor;
- redraw;
- add shadows;
- add borders;
- add corner radius;
- replace transparent backgrounds;
- apply filters;
- generate substitute assets.

Cropping / `object-fit` is allowed only where section specifications require it.

---

# 16. Contact links

Confirmed footer contacts:

```text
Email label: email >
Email URL: mailto:koftakrot@gmail.com

Telegram label: telegram >
Telegram username: @sirmoosham
Telegram URL: https://t.me/sirmoosham
```

These are real interactive links positioned over the hand asset.

---

# 17. Non-blocking polish decisions

These can be decided after the first desktop prototype:

```text
[x] Track 01 visible title confirmed
[x] Track 02 visible title confirmed
[x] Track 03 visible title confirmed
[x] Track 04 visible title confirmed
[x] Track 05 visible title confirmed

[x] JPEG covers are intentionally approved as full square images

[x] Use the supplied Arial-Black.woff for the first implementation
    (provisional; may be replaced after visual review)

[ ] Decide whether to trim transparent margins from:
    hero/me.png
    about/arrow.png
    made/player.png
    connect/phone.png
```

Everything required for the first desktop implementation is present.
