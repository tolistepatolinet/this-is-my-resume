import '../styles/header-contrast.css';

// Known image geometry and actual artwork alpha define foreground coverage.
// Text uses glyph masks rather than heading rectangles, leaving blue gaps black.
// No blend modes or changes to the original header/scroll controller are needed.
export function initHeaderContrast() {
  const base = document.querySelector('body > .site-header');
  const layer = document.createElement('div');
  layer.className = 'header-contrast-layer';
  layer.setAttribute('aria-hidden', 'true');
  layer.inert = true;
  const copy = base.cloneNode(true);
  copy.classList.add('header-contrast-copy');
  copy.removeAttribute('id');
  copy.querySelectorAll('[id]').forEach(element => element.removeAttribute('id'));
  copy.querySelectorAll('a').forEach(link => { link.tabIndex = -1; });
  layer.append(copy);
  document.body.append(layer);

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const main = document.querySelector('main');
  const images = [...main.querySelectorAll('img')];
  const blocks = [...main.querySelectorAll('[data-header-contrast-region]')];
  const textNodes = [];
  const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    if (walker.currentNode.textContent.trim()) textNodes.push(walker.currentNode);
  }
  const range = document.createRange();
  const links = [...base.querySelectorAll('a')];
  const copyLinks = [...copy.querySelectorAll('a')];
  let frame;

  function intersects(rect, header) {
    return rect.right > header.left && rect.left < header.right &&
      rect.bottom > header.top && rect.top < header.bottom;
  }

  // Recover the transformed quad from the accumulated linear transform and its
  // measured center. This includes nested rotation, scale and animation transforms.
  function geometry(element) {
    const rect = element.getBoundingClientRect();
    let matrix = new DOMMatrix();
    for (let parent = element; parent; parent = parent.parentElement) {
      const transform = getComputedStyle(parent).transform;
      if (transform !== 'none') matrix = new DOMMatrix(transform).multiply(matrix);
    }
    const width = element.offsetWidth, height = element.offsetHeight;
    return { width, height, matrix: new DOMMatrix([
      matrix.a, matrix.b, matrix.c, matrix.d,
      rect.left + rect.width / 2 - matrix.a * width / 2 - matrix.c * height / 2,
      rect.top + rect.height / 2 - matrix.b * width / 2 - matrix.d * height / 2,
    ]) };
  }

  function shape(element) {
    const { width, height, matrix } = geometry(element);
    context.save();
    context.transform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f);
    context.beginPath();
    const radius = parseFloat(getComputedStyle(element).borderTopLeftRadius) || 0;
    context.roundRect(0, 0, width, height, Math.min(radius, width / 2, height / 2));
    context.restore();
  }

  function clipAncestors(element) {
    for (let parent = element.parentElement; parent && parent !== main.parentElement; parent = parent.parentElement) {
      const css = getComputedStyle(parent);
      if (['hidden', 'clip', 'scroll', 'auto'].includes(css.overflowX) ||
          ['hidden', 'clip', 'scroll', 'auto'].includes(css.overflowY)) {
        shape(parent);
        context.clip();
      }
    }
  }

  function paintImage(image) {
    const { width, height, matrix } = geometry(image);
    context.save();
    clipAncestors(image);
    context.transform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f);
    const fit = getComputedStyle(image).objectFit;
    if (fit === 'cover' || fit === 'contain') {
      const scale = (fit === 'cover' ? Math.max : Math.min)(width / image.naturalWidth, height / image.naturalHeight);
      const drawnWidth = image.naturalWidth * scale, drawnHeight = image.naturalHeight * scale;
      context.beginPath(); context.rect(0, 0, width, height); context.clip();
      context.drawImage(image, (width - drawnWidth) / 2, (height - drawnHeight) / 2, drawnWidth, drawnHeight);
    } else context.drawImage(image, 0, 0, width, height);
    context.restore();
  }

  function paintText(node, header) {
    const element = node.parentElement;
    if (!intersects(element.getBoundingClientRect(), header)) return;
    const css = getComputedStyle(element);
    if (css.visibility !== 'visible' || css.display === 'none') return;
    range.selectNodeContents(node);
    if (!intersects(range.getBoundingClientRect(), header)) return;
    context.save();
    clipAncestors(element);
    const { matrix } = geometry(element);
    // Rotated tattoo links never intersect the header in this composition.
    // Avoid treating transformed text as an unrotated rectangular foreground.
    if (Math.abs(matrix.b) > .0001 || Math.abs(matrix.c) > .0001) { context.restore(); return; }
    context.font = `${css.fontStyle} ${css.fontWeight} ${css.fontSize} ${css.fontFamily}`;
    context.letterSpacing = css.letterSpacing === 'normal' ? '0px' : css.letterSpacing;
    context.fillStyle = '#fff';
    const metrics = context.measureText('Mg');
    const ascent = metrics.fontBoundingBoxAscent;
    // Group character ranges into rendered lines so wrapping and inline spans
    // remain aligned with their existing layout, without masking whole text boxes.
    let line = '', left = 0, top = NaN;
    const flush = () => { if (line) context.fillText(line, left, top + ascent); };
    for (let i = 0; i < node.length; i++) {
      range.setStart(node, i); range.setEnd(node, i + 1);
      const rect = range.getBoundingClientRect();
      if (!rect.height) continue;
      if (rect.top !== top) { flush(); line = ''; left = rect.left; top = rect.top; }
      line += node.textContent[i];
    }
    flush();
    context.restore();
  }

  function update() {
    // The original header remains the sole source of layout/transition values.
    // Copy the variables after scroll updates, including reverse-scroll frames.
    copy.style.cssText = base.style.cssText;
    copyLinks.forEach((link, i) => link.classList.toggle('is-hovered', links[i].matches(':hover')));
    const header = base.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    const width = Math.ceil(header.width), height = Math.ceil(header.height);
    if (canvas.width !== Math.ceil(width * ratio) || canvas.height !== Math.ceil(height * ratio)) {
      canvas.width = Math.ceil(width * ratio); canvas.height = Math.ceil(height * ratio);
    }
    context.setTransform(ratio, 0, 0, ratio, -header.left * ratio, -header.top * ratio);
    context.clearRect(header.left, header.top, width, height);
    images.forEach(image => {
      if (image.complete && image.naturalWidth && intersects(image.getBoundingClientRect(), header)) paintImage(image);
    });
    blocks.forEach(block => {
      if (!intersects(block.getBoundingClientRect(), header)) return;
      context.save(); clipAncestors(block); shape(block); context.fillStyle = '#fff'; context.fill(); context.restore();
    });
    textNodes.forEach(node => paintText(node, header));
    copy.style.maskImage = `url("${canvas.toDataURL()}")`;
    copy.style.maskSize = `${width}px ${height}px`;
    frame = requestAnimationFrame(update);
  }
  // Synchronize immediately when the existing header changes its inline variables.
  const observer = new MutationObserver(() => {
    const maskImage = copy.style.maskImage, maskSize = copy.style.maskSize;
    copy.style.cssText = base.style.cssText;
    copy.style.maskImage = maskImage; copy.style.maskSize = maskSize;
  });
  observer.observe(base, { attributes: true, attributeFilter: ['style'] });
  frame = requestAnimationFrame(update);
  return () => { cancelAnimationFrame(frame); observer.disconnect(); layer.remove(); };
}
