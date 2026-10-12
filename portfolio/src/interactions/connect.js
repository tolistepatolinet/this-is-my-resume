import { motion } from './config.js';
import { clamp, reducedMotion, documentTop } from './scroll.js';
import { mobileHeroQuery } from './mobile-header.js';

export function initConnect(scroll) {
  const section = document.querySelector('.connect');
  const hand = document.querySelector('.hand-reach');
  const phone = document.querySelector('.phone');
  const mobile = window.matchMedia(mobileHeroQuery);
  let start, end, width, height, mobileTravel;
  scroll.add({
    measure() {
      width = window.innerWidth;
      height = window.innerHeight;
      start = documentTop(section) - height * motion.connect.entryViewport;
      end = document.documentElement.scrollHeight - height;
      if (mobile.matches) {
        const css = getComputedStyle(section);
        start = documentTop(section) - height * parseFloat(css.getPropertyValue('--mobile-connect-hand-progress-entry'));
        end -= parseFloat(css.getPropertyValue('--mobile-connect-hand-progress-end-inset'));
        mobileTravel = ['start-x', 'start-y', 'end-x', 'end-y'].map(key => parseFloat(css.getPropertyValue(`--mobile-connect-hand-${key}`)));
        mobileTravel[1] += height / width * parseFloat(css.getPropertyValue('--mobile-connect-hand-start-y-viewport-offset'));
      }
    },
    update(scrollY) {
      if (mobile.matches) {
        const p = clamp((scrollY - start) / Math.max(1, end - start));
        const [sx, sy, ex, ey] = mobileTravel;
        const amount = reducedMotion.matches ? 0 : p;
        hand.style.transform = `translate(${width * (sx + (ex - sx) * amount)}px, ${width * (sy + (ey - sy) * amount)}px)`;
        return;
      }
      const p = clamp((scrollY - start) / Math.max(1, end - start));
      // Shift travel later with a gentle, continuously increasing slope.
      // Both endpoints remain exact; there is no hold or early plateau.
      const resistance = motion.connect.progressResistance;
      const progress = reducedMotion.matches ? p : p * (1 - resistance + resistance * p);
      const amount = reducedMotion.matches ? motion.connect.reducedTravel : 1;
      hand.style.transform = `translate(${width * motion.connect.travelX * progress * amount}px, ${height * motion.connect.travelY * progress * amount}px)`;
    },
  });
  new IntersectionObserver(([entry]) => phone.classList.toggle('is-visible', entry.isIntersecting), { rootMargin: '100px' }).observe(section);
}
