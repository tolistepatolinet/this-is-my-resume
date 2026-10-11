// Derive the rectangular copy width from the existing heading's visible b glyph.
export function initAboutCopy() {
  const copy = document.querySelector('.about-copy');
  const glyph = document.querySelector('.about-arrow-reference');
  const range = document.createRange();
  const context = document.createElement('canvas').getContext('2d');
  function measure() {
    const node = glyph.previousSibling;
    const start = node.textContent.lastIndexOf('b');
    range.setStart(node, start);
    range.setEnd(node, start + 1);
    const font = getComputedStyle(glyph);
    context.font = `${font.fontWeight} ${font.fontSize} ${font.fontFamily}`;
    const right = range.getBoundingClientRect().left - context.measureText('b').actualBoundingBoxLeft;
    const width = right - copy.getBoundingClientRect().left;
    copy.style.setProperty('--about-copy-width', `${width}px`);
  }
  window.addEventListener('resize', measure, { passive: true });
  document.fonts.ready.then(measure);
  measure();
}
