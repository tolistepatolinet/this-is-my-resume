import { motion } from './config.js';
import { clamp, reducedMotion, documentTop } from './scroll.js';
import { mobileHeroQuery } from './mobile-header.js';
import { createMobileScrollAnimation } from './mobile-scroll-animation.js';
import { createNativeMobileScroll } from './native-mobile-scroll.js';

export function initConnect(scroll) {
  const section = document.querySelector('.connect');
  const hand = document.querySelector('.hand-reach');
  const phone = document.querySelector('.phone');
  const mobile = window.matchMedia(mobileHeroQuery);
  const nativeAnimation = createNativeMobileScroll({ media: mobile, reducedMotion });
  let start, end, width, height, mobileTravel;
  const mobileAnimation = createMobileScrollAnimation({
    media: mobile, reducedMotion,
    isNative: nativeAnimation.active,
    rate: motion.mobileScroll.connectDamping,
    epsilon: motion.mobileScroll.settleEpsilon,
    getTarget: y => mobileTravel ? clamp((y - start) / Math.max(1, end - start)) : null,
    render(progress) {
      const [sx, sy, ex, ey] = mobileTravel;
      const amount = reducedMotion.matches ? 0 : progress;
      hand.style.transform = `translate3d(${width * (sx + (ex - sx) * amount)}px, ${width * (sy + (ey - sy) * amount)}px, 0)`;
    },
  });
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
        const [sx, sy, ex, ey] = mobileTravel;
        nativeAnimation.refresh({ start, end, tracks: [{ element: hand, frames: [
          { transform: `translate3d(${width * sx}px, ${width * sy}px, 0)` },
          { transform: `translate3d(${width * ex}px, ${width * ey}px, 0)` },
        ] }] });
        mobileAnimation.refresh();
      } else mobileTravel = null;
    },
    update(scrollY) {
      if (mobile.matches) return; // Mobile visual writes belong to its RAF sampler.
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
