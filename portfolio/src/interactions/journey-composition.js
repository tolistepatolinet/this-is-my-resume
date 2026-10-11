// Keep Panel 01 unchanged and share its exact body start with Panels 02 and 03.
export function initJourneyComposition() {
  const panels = [...document.querySelectorAll('.journey-panel')];
  const referenceWrapper = panels[0].querySelector('.journey-text');
  const referenceBody = panels[0].querySelector('.journey-copy');
  function measure() {
    const start = referenceBody.getBoundingClientRect().top - referenceWrapper.getBoundingClientRect().top;
    panels[0].parentElement.style.setProperty('--journey-text-body-start', `${start}px`);
  }
  const observer = new ResizeObserver(measure);
  observer.observe(referenceWrapper);
  observer.observe(referenceBody);
  window.addEventListener('resize', measure, { passive: true });
  document.fonts.ready.then(measure);
  measure();
}
