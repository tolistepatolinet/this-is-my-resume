# MADE.md

> Updated specification for the Made section.
> Follows `DESIGN_SYSTEM.md`, `HERO.md`, `ABOUT.md`, and `JOURNEY.md`.

---

# 1. Section structure

```text
MADE
├── Screen 01
└── Screen 02
```

The two screens follow one another in normal vertical page flow.

```text
Screen 01
↓
normal vertical scroll
↓
Screen 02
```

There is no pinned section-level horizontal scroll.

The compact right-shifted header remains fixed throughout both screens.

---

# 2. Global Made rules

## Background

```text
#99E6FF
```

## Header

Persistent settled state:

```text
about
journey
made
connect
```

Rules:
- fixed at top;
- transparent;
- clickable;
- Cascadia Mono;
- #000000;
- compact / right-shifted;
- unchanged throughout Made.

---

# 3. SCREEN 01 — composition

Screen 01 contains:

- large display phrase on the upper-left;
- laptop graphic on the upper-right;
- horizontally moving portfolio collage below;
- normal vertical page behavior outside the collage interaction area.

---

# 4. Screen 01 — display phrase

## Content

```text
WHAT i've already
MADE:
```

## Typography

```text
Font:
var(--font-display) / supplied Portfolio Display face
```

## Color treatment

```text
WHAT
#000000

i've already
#313131

MADE:
#000000
```

## Behavior

Static.

---

# 5. Screen 01 — laptop graphic

Decorative supplied asset.

## Placement

```text
upper-right
below compact fixed header
```

## Behavior

Static by default.

Do not add automatic motion.

---

# 6. Screen 01 — infinite portfolio marquee

## 6.1 Content

The collage contains approximately:

```text
6 images
```

The images sit directly next to one another and form one continuous horizontal visual strip.

There should be no card gaps unless they are part of the supplied artwork.

## 6.2 Default behavior

When the user is not interacting with the collage:

```text
the image strip moves slowly and continuously
from right to left
as an infinite marquee
```

Required properties:

- seamless loop;
- constant slow movement;
- no visible jump when the sequence restarts;
- the images repeat continuously;
- no carousel buttons;
- no pagination dots;
- no automatic snapping between individual images.

Recommended implementation concept:

```text
duplicate the image sequence
and translate the track continuously
to create a seamless loop
```

## 6.3 Pointer / wheel interaction

When the pointer is over the collage:

```text
vertical mouse-wheel / trackpad input controls
the collage horizontally
instead of scrolling the page vertically
```

Desired behavior:

```text
wheel down  → collage moves left
wheel up    → collage moves right
```

During active manual scrolling:
- the automatic marquee may pause or temporarily yield to the user's movement;
- the user's input should feel direct and responsive;
- do not fight the user's manual direction with the automatic movement.

When the pointer leaves the collage:

```text
normal vertical page scrolling resumes
and the slow automatic marquee resumes
```

The page must not remain scroll-locked after pointer exit.

## 6.4 Interaction boundary

Only intercept wheel / trackpad scrolling while:

```text
pointer is inside the collage interaction area
```

Outside that area:
- page scroll remains normal;
- no horizontal input hijacking.

## 6.5 Infinite manual behavior

Because the collage loops continuously, manual horizontal interaction should also feel effectively infinite.

The user should not hit a hard left/right end.

## 6.6 Touch behavior

For touch devices:
- allow natural horizontal swiping on the collage;
- do not block normal vertical page scrolling unnecessarily;
- use touch direction detection so horizontal gestures affect the collage and vertical gestures continue to move the page.

## 6.7 Reduced motion

With:

```css
prefers-reduced-motion: reduce
```

disable the automatic marquee.

Manual horizontal browsing must still remain available.

---

# 7. SCREEN 02 — composition

Screen 02 contains:

- large display phrase on the upper-left;
- clickable player graphic on the left;
- body copy lower-left;
- interactive stacked cover deck on the right.

---

# 8. Screen 02 — display phrase

## Content

```text
...and THIS, too
```

## Typography

```text
Font:
var(--font-display) / supplied Portfolio Display face
```

## Color treatment

```text
...and
#313131

THIS
#000000

, too
#313131
```

## Behavior

Static.

---

# 9. Screen 02 — audio player graphic

## Role

The supplied iPod/player illustration is an interactive audio control.

## Placement

```text
left side
below the display phrase
above / near body copy
```

## Interaction

On click:

```text
toggle audio playback
```

Recommended behavior:

```text
first click:
play

second click:
pause

next click:
resume
```

Do not restart the track from the beginning on every click.

## Press / spring feedback

Every deliberate press on the player should produce a short physical "push" response.

Desired feel:

```text
click / tap
→ player sinks slightly inward / downward
→ compresses very slightly
→ springs back to its resting position
```

Recommended starting treatment:

```text
translateY: 0 → 4–8px → 0
scale: 1 → 0.97–0.99 → 1
duration: approximately 180–300ms
```

The return should feel lightly springy rather than mechanically linear.

Rules:
- the effect happens on every play / pause click;
- keep the displacement subtle;
- do not rotate or throw the player around;
- the player remains in its original layout position after the feedback finishes.

## Audio source

Store all production audio files in:

```text
/assets/made/audio/
```

Recommended format:

```text
.mp3
```

Optional browser fallback:

```text
.ogg
```

Recommended pair naming:

```text
/assets/made/covers/cover-01.jpg
/assets/made/audio/track-01.mp3

/assets/made/covers/cover-02.jpg
/assets/made/audio/track-02.mp3

/assets/made/covers/cover-03.jpg
/assets/made/audio/track-03.mp3
```

Each cover must map to exactly one track.

## Browser rule

Audio starts only after an explicit user click.

Do not autoplay audio when the section enters the viewport.

## Accessibility

The interactive player should be implemented as a real button or button-like control with:

```text
aria-label="Play audio"
```

and its accessible label should update when playing:

```text
aria-label="Pause audio"
```

Keyboard activation should also work with Enter / Space.

## Visual feedback

A subtle playing state may be added if needed later, but Codex must not invent one automatically.

The supplied player graphic remains the main visual control.

## Playing track title marquee

While the active track is playing, a small text line with the current track title repeatedly emerges from behind the player and travels from right to left.

Conceptual behavior:

```text
player
  ↓
track title starts hidden behind / under the player
  ↓
moves left into view
  ↓
reaches its intended visible alignment with the text area above
  ↓
cycle resets behind the player
  ↓
repeats while audio is playing
```

The title line should feel like a small music-player marquee, not a large section animation.

### Direction

```text
right → left
```

### Alignment target

The visible title should travel far enough left to align visually with the left-side text column shown in the supplied reference.

Exact x-position should be tuned against the real player asset and final desktop layout.

### Typography

```text
Font:
Cascadia Mono

Color:
#000000

Role:
small / supporting track label
```

Example placeholder only:

```text
Moosham - Я.mp3
```

The real display strings will be defined later in `ASSETS.md`.

### Playback synchronization

```text
track playing
→ title marquee active

track paused
→ title marquee animation pauses / stops

track resumed
→ title marquee continues / restarts

active cover changed
→ old audio stops
→ old title animation stops
→ displayed track title source changes to the newly selected cover's title
→ new title does not begin cycling until Play is pressed
```

No track-title marquee should run when audio is not playing.

### Loop behavior

The track title repeats continuously for the duration of playback.

The reset should happen outside / behind the player so there is no obvious visual jump in the open area.

### Layering

The player should visually mask the title at its starting point, creating the impression that the text is physically sliding out from behind the player.

Suggested conceptual layers:

```text
track-title marquee   behind player
player graphic        above title at overlap point
```

### Reduced motion

Under `prefers-reduced-motion: reduce`:
- do not continuously animate the title;
- show the active track title statically near the player while audio plays.

---

# 10. Screen 02 — body copy

## Typography

```text
Font:
Cascadia Mono

Color:
#000000

Alignment:
left
```

## Placement

```text
lower-left quadrant
```

Use a compact text column.

---

# 11. Screen 02 — interactive cover deck

## 11.1 Structure

The right-side artwork is a stack / deck of multiple covers.

Conceptually:

```text
cover 1  ← front / active
cover 2
cover 3
cover 4
...
```

The covers are visually offset behind one another.

They are not a carousel with arrows.

## 11.2 Hover behavior

When the pointer is over the front cover:

```text
front cover scales up slightly
```

Recommended starting range:

```text
scale: 1 → approximately 1.02–1.04
```

The effect should be subtle.

When pointer leaves:

```text
front cover returns to normal scale
```

Use a smooth short transition.

## 11.3 Click behavior

When the user clicks the front cover:

```text
1. current front cover moves away from the front position;
2. it moves to the back / last position in the deck;
3. the next cover becomes the new front cover;
4. all remaining covers shift forward by one position.
```

Then the same behavior repeats indefinitely.

Example:

```text
Before click:
A B C D

After click:
B C D A

After next click:
C D A B
```

## 11.4 Animation feel

The outgoing front cover should visibly leave the front position before settling behind the deck.

The transition should:
- be clear;
- be quick;
- not feel abrupt;
- preserve the physical "stack of covers" metaphor.

Suggested timing:

```text
300–500ms
```

Exact timing may be tuned visually.

## 11.5 No automatic cycling

Covers only advance through explicit user interaction.

Do not:
- auto-rotate;
- auto-cycle;
- change cover on a timer.

## 11.6 Click target

Only the front cover needs to be the primary clickable item.

The visual deck should not expose confusing multiple overlapping click targets unless explicitly designed later.

## 11.7 Keyboard accessibility

The front cover should be keyboard-focusable and activatable with:

```text
Enter
Space
```

## 11.8 Reduced motion

Under reduced-motion preferences:
- keep deck cycling functional;
- simplify the transition to a short fade / instant reorder if necessary;
- do not remove the interaction itself.

---


# 11.9 Cover-to-track synchronization

## Final cover / audio / display-title mapping

```text
cover-01.jpg ↔ track-01.mp3 ↔ Moosham - Я.mp3
cover-02.jpg ↔ track-02.mp3 ↔ Cathou, Moosham - Я так дышу (alternative version).mp3
cover-03.jpg ↔ track-03.mp3 ↔ Moosham, Cathou - Хамелеон.mp3
cover-04.jpg ↔ track-04.mp3 ↔ Moosham - Accidentally.mp3
cover-05.jpg ↔ track-05.mp3 ↔ Moosham, lera blvmrkv - Солнце.mp3
```

These exact strings drive the small playing-track marquee.



Each cover in the deck has exactly one associated audio track.

Conceptually:

```text
Cover 1 ↔ Track 1
Cover 2 ↔ Track 2
Cover 3 ↔ Track 3
Cover 4 ↔ Track 4
...
```

The active / front cover determines the active audio track.

## Playback rule

```text
If Cover 1 is front → player controls Track 1
If Cover 2 is front → player controls Track 2
If Cover 3 is front → player controls Track 3
...
```

The user does not choose a track separately from the cover deck.

The visual deck itself is the track selector.

## On cover change

When the front cover is clicked and moves to the back:

```text
A B C D
↓ click
B C D A
```

the active audio track changes accordingly:

```text
Track A → Track B
```

## Playback state when changing covers

Recommended behavior:

```text
If audio is paused:
changing the cover only changes the selected track.
Playback does not start automatically.

If audio is currently playing:
changing the cover stops / pauses the current track,
switches the active source to the new front cover's track,
and waits for the user to press Play again.
```

This avoids unexpected audio starting automatically after a cover change.

Do not automatically start the next track when the deck advances.

## Restart behavior

When a newly selected track is activated, its playback position should begin from:

```text
0:00
```

unless persistent per-track playback positions are explicitly added later.

## Data mapping

Codex should treat each cover / track pair as one data object.

Example conceptual structure:

```text
{
  cover: "cover-01.jpg",
  audio: "track-01.mp3",
  title: "Track display title"
}
```

The front item in the deck is also the active audio item.

## Player state

The player must reflect the current active track.

Required state variables conceptually:

```text
activeIndex
isPlaying
currentAudio
currentTrackTitle
```

The `currentTrackTitle` value drives the playing-track marquee near the player.


# 12. Screen 02 — deck layering

Recommended conceptual stack:

```text
front cover         highest cover layer
cover 2             behind / offset
cover 3             further behind
cover 4             further behind
```

The deck remains on the right half of the screen.

Approximate structural span:

```text
columns 7–12
```

Do not convert it into a horizontal thumbnail strip.

---

# 13. Motion summary

## Screen 01

Required:

```text
continuous slow horizontal marquee
+
manual horizontal wheel / trackpad interaction on hover
```

## Screen 02

Required:

```text
front cover hover scale
+
click-to-cycle deck animation
+
audio play / pause on player click
+
player press / spring feedback
+
playing track-title marquee
```

No additional automatic animation is approved.

---

# 14. Scroll behavior summary

Outside the Screen 01 collage:

```text
normal vertical page scroll
```

Inside the Screen 01 collage while pointer is hovering:

```text
wheel / trackpad controls horizontal collage movement
```

After pointer leaves:

```text
normal vertical page scroll returns immediately
automatic marquee continues
```

Screen 02 does not hijack page scrolling.

---

# 15. Layering

## Screen 01

```text
Layer 0:
blue background

Layer 1:
display phrase

Layer 2:
laptop graphic
portfolio marquee

Layer 3:
fixed compact header
```

## Screen 02

```text
Layer 0:
blue background

Layer 1:
display phrase
body copy

Layer 2:
player graphic

Layer 3:
interactive cover deck

Layer 4:
fixed compact header
```

---

# 16. Codex implementation rules

Codex may:
- create a seamless duplicated marquee track;
- translate wheel `deltaY` into horizontal collage movement while hovered;
- temporarily pause auto-marquee during manual input;
- resume marquee automatically after interaction;
- implement cover-deck ordering in JS state;
- animate the outgoing cover and reorder the deck;
- use the Web Audio / HTMLAudioElement API for user-triggered playback.

Codex may NOT:
- permanently capture page wheel scrolling;
- autoplay sound;
- turn the cover deck into an automatic carousel;
- add carousel arrows or pagination dots;
- let hover permanently pause the collage after pointer exit;
- introduce unrelated animation;
- add backgrounds or controls not present in the design.

---

# 17. Asset status

Confirmed production assets:

```text
Screen 01 marquee:
work-01.webp → work-06.webp

Player:
/assets/made/player.png

Covers:
cover-01.jpg → cover-05.jpg

Audio:
track-01.mp3 → track-05.mp3
```

Remaining TODOs:
- final Screen 02 body copy;
- final mobile composition.

Neither item blocks the desktop prototype.

---

# 18. Acceptance criteria

Made is correct when:

- both screens remain in normal vertical page flow;
- compact fixed header persists;
- Screen 01 collage loops continuously right → left;
- roughly 6 images form one seamless repeated strip;
- wheel input over the collage manually moves it horizontally;
- page scrolling returns immediately when pointer leaves;
- automatic marquee resumes after manual interaction;
- Screen 02 front cover subtly enlarges on hover;
- clicking the front cover sends it to the back of the deck;
- the next cover becomes front;
- the deck cycles indefinitely through clicks;
- the player starts audio only after click;
- player click toggles play/pause;
- every player click produces a short spring-like pressed feedback;
- while audio plays, the active track title repeatedly slides out from behind the player right → left;
- the title marquee stops when audio is not playing;
- the active front cover determines the active track;
- changing the front cover changes the selected track;
- changing covers does not autoplay the newly selected track;
- no sound autoplays;
- no unapproved controls or animations are introduced.
