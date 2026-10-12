import { mobileHeroQuery } from './mobile-header.js';

// Align visible artwork to the heading glyph without changing the text wrap.
export function initAboutArrow() {
  const arrow = document.querySelector('.about-arrow');
  const image = arrow.querySelector('img');
  const glyph = document.querySelector('.about-arrow-reference');
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  let outline;
  function measure() {
    if (window.matchMedia(mobileHeroQuery).matches) return;
    if (!image.complete || !image.naturalWidth) return;
    if (!outline) {
      canvas.width = image.naturalWidth; canvas.height = image.naturalHeight;
      context.drawImage(image, 0, 0);
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
      outline = [];
      for (let y = 0; y < canvas.height; y++) {
        let left = -1, right = -1;
        for (let x = 0; x < canvas.width; x++) {
          if (pixels[(y * canvas.width + x) * 4 + 3] > 64) {
            if (left < 0) left = x;
            right = x;
          }
        }
        if (left >= 0) outline.push([left, y], [right, y]);
      }
    }
    const css = getComputedStyle(arrow);
    const scale = parseFloat(css.getPropertyValue('--arrow-scale'));
    const angle = parseFloat(css.getPropertyValue('--arrow-angle')) * Math.PI / 180;
    const cx = arrow.offsetWidth / 2, cy = arrow.offsetHeight / 2;
    const imageCSS = getComputedStyle(image);
    const imageWidth = parseFloat(imageCSS.width), imageHeight = parseFloat(imageCSS.height);
    const imageX = parseFloat(imageCSS.left), imageY = parseFloat(imageCSS.top);
    let minX = Infinity, minY = Infinity;
    outline.forEach(([x, y]) => {
      const dx = imageX + x / image.naturalWidth * imageWidth - cx;
      const dy = imageY + y / image.naturalHeight * imageHeight - cy;
      minX = Math.min(minX, dx * Math.cos(angle) - dy * Math.sin(angle));
      minY = Math.min(minY, dx * Math.sin(angle) + dy * Math.cos(angle));
    });
    const font = getComputedStyle(glyph);
    context.font = `${font.fontWeight} ${font.fontSize} ${font.fontFamily}`;
    const inkLeft = glyph.getBoundingClientRect().left - context.measureText('o').actualBoundingBoxLeft;
    const parentLeft = arrow.offsetParent.getBoundingClientRect().left;
    arrow.style.setProperty('--arrow-glyph-left', `${inkLeft - parentLeft - cx - minX * scale}px`);
    const body = document.querySelector('.about-copy');
    const bodyFont = getComputedStyle(body);
    context.font = `${bodyFont.fontWeight} ${bodyFont.fontSize} ${bodyFont.fontFamily}`;
    const metrics = context.measureText(body.textContent.split('.')[0]);
    const baseline = (parseFloat(bodyFont.lineHeight) - metrics.fontBoundingBoxAscent - metrics.fontBoundingBoxDescent) / 2 + metrics.fontBoundingBoxAscent;
    arrow.style.setProperty('--about-copy-ink-top', `${baseline - metrics.actualBoundingBoxAscent}px`);
    arrow.style.setProperty('--arrow-visible-top', `${cy + minY * scale}px`);
  }
  image.addEventListener('load', measure);
  window.addEventListener('resize', measure, { passive: true });
  document.fonts.ready.then(measure);
  measure();
}
