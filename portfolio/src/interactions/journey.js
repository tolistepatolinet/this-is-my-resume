import { motion } from './config.js';
import { clamp, reducedMotion, documentTop } from './scroll.js';

export function journeyProgress(progress, reduce = false) {
  const stage = clamp(progress) * 2;
  if (stage >= 2) return 2;
  const index = Math.floor(stage);
  const local = stage - index;
  const hold = motion.journey.settledFraction;
  const travel = clamp((local - hold) / (1 - 2 * hold));
  return index + (reduce ? travel : travel ** motion.journey.resistancePower);
}

export function initJourney(scroll) {
  const section = document.querySelector('.journey');
  const stage = document.querySelector('.journey-stage');
  const track = document.querySelector('.journey-track');
  let top, length, width;
  scroll.add({
    measure() {
      top = documentTop(section);
      length = section.offsetHeight - stage.offsetHeight;
      width = stage.clientWidth;
    },
    update(scrollY) {
      const p = clamp((scrollY - top) / Math.max(1, length));
      track.style.transform = `translateX(${-journeyProgress(p, reducedMotion.matches) * width}px)`;
    },
  });
}
