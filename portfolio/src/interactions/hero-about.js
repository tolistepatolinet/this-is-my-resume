import { motion } from './config.js';
import { clamp, lerp, reducedMotion, documentTop } from './scroll.js';

export function initHeroAbout(scroll) {
  const header = document.querySelector('.site-header');
  const stage = document.querySelector('.hero-about');
  const hero = document.querySelector('.hero');
  const about = document.querySelector('.about');
  const me = document.querySelector('.me');
  const marquee = document.querySelector('.hero-marquee');
  me.style.setProperty('--me-width', motion.hero.meWidth);
  let geometry;
  scroll.add({
    measure() {
      const css = getComputedStyle(document.documentElement);
      const width = window.innerWidth;
      const height = hero.offsetHeight;
      const padding = parseFloat(css.getPropertyValue('--page-padding'));
      const settledWidth = Math.min(parseFloat(css.getPropertyValue('--header-settled-width')), width - 2 * padding);
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
      ruler.style.fontSize = 'var(--header-hero-type)';
      const startFont = parseFloat(getComputedStyle(ruler).fontSize);
      ruler.style.fontSize = 'var(--header-settled-type)';
      const endFont = parseFloat(getComputedStyle(ruler).fontSize);
      ruler.remove();
      geometry = {
        width, height, padding, settledWidth, startFont, endFont, endScale,
        startTop: parseFloat(css.getPropertyValue('--header-hero-top')),
        endTop: parseFloat(css.getPropertyValue('--header-settled-top')),
        top: documentTop(stage), aboutY: documentTop(about) - documentTop(stage),
        // Keep the lettering visible in the remaining Hero slice, while the
        // Hero's own overflow clips it completely before settled About.
        marqueeEndY: Math.max(0, height - marquee.offsetTop - marquee.offsetHeight + height * motion.hero.marqueeBottomOverscan),
      };
      me.style.width = `${width * motion.hero.meWidth}px`;
      me.style.left = '0';
      me.style.top = '0';
    },
    update(scrollY) {
      const g = geometry;
      const local = Math.max(0, scrollY - g.top);
      const p = clamp(local / (g.height * motion.hero.scrollViewports));
      // Smootherstep has zero velocity and acceleration at both endpoints.
      // It is a deterministic scroll mapping, so reverse scroll is identical.
      const smooth = p * p * p * (p * (p * 6 - 15) + 10);
      const headerP = lerp(p, smooth, motion.hero.headerSmoothing);
      header.style.setProperty('--header-font', `${lerp(g.startFont, g.endFont, headerP)}px`);
      header.style.setProperty('--header-width', `${lerp(g.width - 2 * g.padding, g.settledWidth, headerP)}px`);
      header.style.setProperty('--header-left', `${lerp(g.padding, g.width - g.padding - g.settledWidth, headerP)}px`);
      header.style.setProperty('--header-top', `${lerp(g.startTop, g.endTop, headerP)}px`);
      // The destination includes About's document offset. One image stays attached
      // to the shared region and then leaves with About in normal document flow.
      const x = reducedMotion.matches ? g.width * motion.hero.endX : lerp(g.width * motion.hero.startX, g.width * motion.hero.endX, p);
      const y = lerp(g.height * motion.hero.startY, g.aboutY + g.height * motion.hero.endY, p);
      const scale = reducedMotion.matches ? g.endScale : lerp(1, g.endScale, p);
      me.style.transform = `translate(${x + g.width * motion.hero.meOffsetX}px, ${y}px) scale(${scale})`;
      marquee.style.transform = reducedMotion.matches ? 'none' : `translate(${g.width * motion.hero.marqueeTravel * p}px, ${g.marqueeEndY * p}px)`;
      stage.classList.toggle('is-settled', p === 1);
    },
  });
}
