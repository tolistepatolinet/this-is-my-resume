import { motion } from './config.js';
import { clamp, reducedMotion, documentTop } from './scroll.js';

export function initConnect(scroll) {
  const section = document.querySelector('.connect');
  const hand = document.querySelector('.hand-reach');
  const phone = document.querySelector('.phone');
  let start, end, width, height;
  scroll.add({
    measure() {
      width = window.innerWidth;
      height = window.innerHeight;
      start = documentTop(section) - height * motion.connect.entryViewport;
      end = document.documentElement.scrollHeight - height;
    },
    update(scrollY) {
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
