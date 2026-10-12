import { mobileHeroQuery } from './mobile-header.js';

export function initMobileAbout(scroll) {
  const mobile = window.matchMedia(mobileHeroQuery);
  const composition = document.querySelector('.about > .section-composition');
  const copy = composition.querySelector('.about-copy');
  const me = document.querySelector('.me');
  const navigation = document.querySelector('.mobile-navigation');
  function measure() {
    if (!mobile.matches) { copy.style.minHeight = ''; return; }
    document.documentElement.style.setProperty('--mobile-about-nav-width', `${navigation.getBoundingClientRect().width}px`);
    const css = getComputedStyle(composition);
    const [artWidth, artHeight] = getComputedStyle(me).aspectRatio.split('/').map(Number);
    const meHeight = innerWidth * parseFloat(css.getPropertyValue('--mobile-about-me-scale')) * artHeight / artWidth;
    // Preserve the approved artwork endpoints while the copy gains width.
    const probe = copy.cloneNode(true);
    probe.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;min-height:0;margin:0';
    probe.style.width = `${composition.clientWidth - parseFloat(css.getPropertyValue('--mobile-about-artwork-reference-inset')) - parseFloat(getComputedStyle(navigation).width) - parseFloat(css.getPropertyValue('--mobile-hamburger-right')) - parseFloat(css.getPropertyValue('--mobile-about-nav-gap'))}px`;
    composition.append(probe);
    const reservedHeight = probe.offsetHeight;
    probe.remove();
    copy.style.minHeight = `${reservedHeight}px`;
    const arrowTop = copy.offsetTop + copy.offsetHeight + parseFloat(css.getPropertyValue('--mobile-about-body-arrow-gap'));
    const meTop = arrowTop + parseFloat(css.getPropertyValue('--mobile-about-arrow-me-gap')) + parseFloat(css.getPropertyValue('--mobile-about-me-offset-y'));
    composition.style.setProperty('--mobile-about-me-height', `${meHeight}px`);
    composition.style.setProperty('--mobile-about-arrow-top', `${arrowTop}px`);
    composition.style.setProperty('--mobile-about-me-top', `${meTop}px`);
    scroll.refresh();
  }
  new ResizeObserver(measure).observe(copy);
  window.addEventListener('resize', measure, { passive: true });
  document.fonts.ready.then(measure);
  measure();
}
