import { motion } from './config.js';
import { clamp, lerp, reducedMotion, documentTop } from './scroll.js';
import { mobileHeroQuery } from './mobile-header.js';

export function initHeroAbout(scroll) {
  const header = document.querySelector('.site-header');
  const stage = document.querySelector('.hero-about');
  const hero = document.querySelector('.hero');
  const about = document.querySelector('.about');
  const me = document.querySelector('.me');
  const marquee = document.querySelector('.hero-marquee');
  me.style.setProperty('--me-width', motion.hero.meWidth);
  let geometry;
  const mobile = window.matchMedia(mobileHeroQuery);
  mobile.addEventListener('change', () => scroll.refresh());
  scroll.add({
    measure() {
      if (mobile.matches) {
        me.style.width = me.style.left = me.style.top = me.style.transform = '';
        const ruler = document.createElement('span');
        ruler.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;left:var(--mobile-hero-scroll-travel);top:var(--mobile-me-y)';
        document.body.append(ruler);
        const travel = parseFloat(getComputedStyle(ruler).left);
        const startY = parseFloat(getComputedStyle(ruler).top);
        ruler.style.left = 'var(--mobile-me-x)';
        const startX = parseFloat(getComputedStyle(ruler).left);
        ruler.style.left = 'var(--mobile-about-me-x)';
        const endX = parseFloat(getComputedStyle(ruler).left);
        const mobileCSS = getComputedStyle(document.documentElement);
        const startScale = parseFloat(mobileCSS.getPropertyValue('--mobile-me-scale'));
        const endScale = parseFloat(mobileCSS.getPropertyValue('--mobile-about-me-scale')) / startScale;
        const composition = about.querySelector('.section-composition');
        const endY = documentTop(about) - documentTop(stage) + parseFloat(getComputedStyle(composition).getPropertyValue('--mobile-about-me-top'));
        const startCrop = Math.max(0, me.offsetHeight + startY - hero.offsetHeight);
        ruler.remove();
        geometry = { mobile: true, top: documentTop(stage), height: hero.offsetHeight, travel, startX, startY, endX, endY, endScale, startCrop };
        me.style.left = me.style.top = '0';
        return;
      }
      me.style.clipPath = '';
      const css = getComputedStyle(document.documentElement);
      const width = window.innerWidth;
      const height = hero.offsetHeight;
      const padding = parseFloat(css.getPropertyValue('--page-padding'));
      const [artWidth, artHeight] = getComputedStyle(me).aspectRatio.split('/').map(Number);
      const meWidth = width * motion.hero.meWidth;
      const meHeight = meWidth * artHeight / artWidth;
      // Preserve the destination anchor; only reduce scale when a shorter
      // desktop viewport needs additional room for the complete figure.
      const endScale = Math.min(
        motion.hero.endScale,
        (width * (1 - motion.hero.endX) - padding) / meWidth,
        (height * (1 - motion.hero.endY) - padding) / meHeight,
      );
      // Resolve clamp() values via a non-visible measuring element.
      const ruler = document.createElement('span');
      ruler.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none';
      document.body.append(ruler);
      ruler.style.width = 'var(--settled-header-width)';
      ruler.style.left = 'var(--settled-header-left)';
      const settledWidth = parseFloat(getComputedStyle(ruler).width);
      const settledLeft = parseFloat(getComputedStyle(ruler).left);
      ruler.style.fontSize = 'var(--header-hero-type)';
      const startFont = parseFloat(getComputedStyle(ruler).fontSize);
      ruler.style.fontSize = 'var(--header-settled-type)';
      const endFont = parseFloat(getComputedStyle(ruler).fontSize);
      ruler.remove();
      // Use ink bounds, including the fonts' ascenders/descenders, rather than
      // centering the oversized display line box.
      const context = document.createElement('canvas').getContext('2d');
      function inkBounds(element, text, size, lineHeight) {
        const font = getComputedStyle(element);
        context.font = `${font.fontWeight} ${size}px ${font.fontFamily}`;
        const metrics = context.measureText(text);
        const baseline = (lineHeight - metrics.fontBoundingBoxAscent - metrics.fontBoundingBoxDescent) / 2 + metrics.fontBoundingBoxAscent;
        return { top: baseline - metrics.actualBoundingBoxAscent, bottom: baseline + metrics.actualBoundingBoxDescent };
      }
      const headerFont = getComputedStyle(header);
      const headerInk = [...header.querySelectorAll('a')].map(link => inkBounds(link, link.textContent, startFont,
        startFont * parseFloat(headerFont.lineHeight) / parseFloat(headerFont.fontSize)));
      const headerBottom = parseFloat(css.getPropertyValue('--header-hero-top')) + Math.max(...headerInk.map(ink => ink.bottom));
      const phrase = hero.querySelector('.resume-phrase');
      const phraseFont = getComputedStyle(phrase);
      const phraseInk = inkBounds(phrase, phrase.textContent, parseFloat(phraseFont.fontSize), parseFloat(phraseFont.lineHeight));
      const phraseTop = phrase.offsetTop + phraseInk.top;
      const marqueeFont = getComputedStyle(marquee);
      const marqueeInk = inkBounds(marquee, marquee.textContent, parseFloat(marqueeFont.fontSize), parseFloat(marqueeFont.lineHeight));
      const initialY = (headerBottom + phraseTop - marqueeInk.top - marqueeInk.bottom) / 2 + parseFloat(css.getPropertyValue('--hero-initial-y-adjust'));
      marquee.style.setProperty('--hero-initial-y', `${initialY}px`);
      // Preserve the previous scroll-linked vertical travel independently of
      // the new starting position.
      const originalTop = Math.round(height * parseFloat(css.getPropertyValue('--hero-type-top')) / 100 + window.innerHeight * parseFloat(css.getPropertyValue('--hero-offset-y')) / 100);
      geometry = {
        width, height, padding, settledWidth, settledLeft, startFont, endFont, endScale,
        startTop: parseFloat(css.getPropertyValue('--header-hero-top')),
        endTop: parseFloat(css.getPropertyValue('--header-settled-top')),
        top: documentTop(stage), aboutY: documentTop(about) - documentTop(stage),
        // Keep the lettering visible in the remaining Hero slice, while the
        // Hero's own overflow clips it completely before settled About.
        // Keep the existing scroll path independent of the visual size adjustment.
        marqueeEndY: Math.max(0, height - originalTop + window.innerHeight * parseFloat(css.getPropertyValue('--hero-offset-y')) / 100 - Math.round(parseFloat(getComputedStyle(marquee).lineHeight) / parseFloat(css.getPropertyValue('--hero-size-scale'))) + height * motion.hero.marqueeBottomOverscan),
      };
      me.style.width = `${width * motion.hero.meWidth}px`;
      me.style.left = '0';
      me.style.top = '0';
    },
    update(scrollY) {
      const g = geometry;
      if (g.mobile) {
        const progress = clamp((scrollY - g.top) / g.height);
        marquee.style.transform = reducedMotion.matches ? 'none' : `translateX(${g.travel * progress}px)`;
        me.style.transform = `translate(${lerp(g.startX, g.endX, progress)}px, ${lerp(g.startY, g.endY, progress)}px) scale(${lerp(1, g.endScale, progress)})`;
        me.style.clipPath = `inset(0 0 ${lerp(g.startCrop, 0, progress)}px 0)`;
        stage.classList.remove('is-settled');
        return;
      }
      const local = Math.max(0, scrollY - g.top);
      const p = clamp(local / (g.height * motion.hero.scrollViewports));
      // Smootherstep has zero velocity and acceleration at both endpoints.
      // It is a deterministic scroll mapping, so reverse scroll is identical.
      const smooth = p * p * p * (p * (p * 6 - 15) + 10);
      const headerP = lerp(p, smooth, motion.hero.headerSmoothing);
      header.style.setProperty('--header-font', `${lerp(g.startFont, g.endFont, headerP)}px`);
      header.style.setProperty('--header-width', `${lerp(g.width - 2 * g.padding, g.settledWidth, headerP)}px`);
      header.style.setProperty('--header-left', `${lerp(g.padding, g.settledLeft, headerP)}px`);
      header.style.setProperty('--header-top', `${lerp(g.startTop, g.endTop, headerP)}px`);
      // The destination includes About's document offset. One image stays attached
      // to the shared region and then leaves with About in normal document flow.
      const x = reducedMotion.matches ? g.width * motion.hero.endX : lerp(g.width * motion.hero.startX, g.width * motion.hero.endX, p);
      const y = lerp(g.height * motion.hero.startY, g.aboutY + g.height * motion.hero.endY, p);
      const scale = reducedMotion.matches ? g.endScale : lerp(1, g.endScale, p);
      me.style.transform = `translate(${x + g.width * motion.hero.meOffsetX}px, ${y}px) scale(${scale})`;
      marquee.style.transform = reducedMotion.matches ? 'none' : `translate(${g.width * motion.hero.marqueeTravel * motion.hero.marqueeTravelMultiplier * p}px, ${g.marqueeEndY * p}px)`;
      stage.classList.toggle('is-settled', p === 1);
    },
  });
}
