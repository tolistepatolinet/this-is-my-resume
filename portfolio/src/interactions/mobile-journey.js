import { mobileHeroQuery } from './mobile-header.js';

// Layout measurement only. Mobile Journey remains entirely in native flow:
// no input listeners, scroll writes, animation loop, or momentum interception.
export function initMobileJourneyComposition(scroll) {
  const mobile = window.matchMedia(mobileHeroQuery);
  const panels = [...document.querySelectorAll('.journey-panel')];
  scroll.add({
    measure() {
      if (!mobile.matches) return;
      // Keep the approved shared body start and equal top/bottom padding.
      const headingHeight = Math.max(...panels.map(panel => panel.querySelector('.journey-heading').getBoundingClientRect().height));
      const bodyHeight = Math.min(...panels.map(panel => panel.querySelector('.journey-copy').getBoundingClientRect().height));
      document.documentElement.style.setProperty('--mobile-journey-heading-height', `${headingHeight}px`);
      document.documentElement.style.setProperty('--mobile-journey-shortest-body-height', `${bodyHeight}px`);
    },
    update() {},
  });
}
