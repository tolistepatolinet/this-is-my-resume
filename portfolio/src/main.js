import './styles/tokens.css';
import './styles/global.css';
import './styles/sections.css';
import './styles/mobile-hero.css';
import './styles/mobile-about.css';
import './styles/mobile-journey.css';
import './styles/mobile-made-01.css';
import './styles/mobile-made-02.css';
import './styles/mobile-connect.css';
import { content } from './data/content.js';
import { journeyPanels } from './data/journey.js';
import { works, tracks } from './data/made.js';
import { createScrollController } from './interactions/scroll.js';
import { initHeroAbout } from './interactions/hero-about.js';
import { initJourney } from './interactions/journey.js';
import { initJourneyComposition } from './interactions/journey-composition.js';
import { initMadeMarquee } from './interactions/made-marquee.js';
import { initAudioDeck } from './interactions/made-audio-deck.js';
import { initConnect } from './interactions/connect.js';
import { initAboutCopy } from './interactions/about-copy.js';
import { initAboutArrow } from './interactions/about-arrow.js';
import { initHeaderContrast } from './interactions/header-contrast.js';
import { initMobileHeader } from './interactions/mobile-header.js';
import { initMobileAbout } from './interactions/mobile-about.js';
import { initMobileJourneyComposition } from './interactions/mobile-journey.js';
import { initMobileConnect } from './interactions/mobile-connect.js';

for (const element of document.querySelectorAll('[data-copy]')) {
  const copy = content[element.dataset.copy];
  if (Array.isArray(copy)) {
    for (const text of copy) {
      const paragraph = document.createElement('p');
      paragraph.textContent = text;
      if (element.dataset.copy === 'about' || element.dataset.copy === 'connect') {
        paragraph.lang = 'en';
        const emphasized = element.dataset.copy === 'connect'
          ? /Here’s the deal:|make them real|good things happen|creative partner|Sounds like a fair trade|Let’s talk!/g
          : /\b(digital specialist|loves|visuals|music|sound|websites|portfolio|keep going|keep growing|results)\b/gi;
        const fragments = [];
        let cursor = 0;
        for (const match of text.matchAll(emphasized)) {
          fragments.push(document.createTextNode(text.slice(cursor, match.index)));
          const phrase = document.createElement('strong');
          phrase.className = `${element.dataset.copy}-emphasis`;
          phrase.textContent = match[0];
          fragments.push(phrase);
          cursor = match.index + match[0].length;
        }
        fragments.push(document.createTextNode(text.slice(cursor)));
        paragraph.replaceChildren(...fragments);
      }
      element.append(paragraph);
    }
  } else {
    element.textContent = copy;
    if (element.dataset.copy === 'micro') {
      const fragments = [];
      let cursor = 0;
      for (const match of copy.matchAll(/I WON’T MIND|WE ALL STEAL/g)) {
        fragments.push(document.createTextNode(copy.slice(cursor, match.index)));
        const phrase = document.createElement('strong');
        phrase.className = 'micro-emphasis';
        phrase.textContent = match[0];
        fragments.push(phrase);
        cursor = match.index + match[0].length;
      }
      fragments.push(document.createTextNode(copy.slice(cursor)));
      element.replaceChildren(...fragments);
    }
    if (element.dataset.copy === 'made') {
      const emphasized = /\b(Music|joy and sadness|real love of mine|Ableton|DAWs|have fun|something bigger)\b/g;
      const fragments = [];
      let cursor = 0;
      for (const match of copy.matchAll(emphasized)) {
        fragments.push(document.createTextNode(copy.slice(cursor, match.index)));
        const phrase = document.createElement('strong');
        phrase.className = 'made2-emphasis';
        phrase.textContent = match[0];
        fragments.push(phrase);
        cursor = match.index + match[0].length;
      }
      fragments.push(document.createTextNode(copy.slice(cursor)));
      element.replaceChildren(...fragments);
      const shape = document.createElement('span');
      shape.className = 'made2-player-wrap';
      shape.setAttribute('aria-hidden', 'true');
      element.prepend(shape);
    }
  }
}

const journeyTrack = document.querySelector('#journey-track');
journeyPanels.forEach((panel, index) => {
  const article = document.createElement('article');
  article.className = 'journey-panel';
  article.setAttribute('aria-labelledby', `role-${index}`);
  article.innerHTML = `<img class="journey-image" src="${panel.image}" alt="${panel.alt}" width="1280" height="1440" loading="lazy" />
    <div class="journey-text"><div class="journey-heading"><h3 id="role-${index}">${panel.title}</h3><p class="journey-metadata">${panel.metadata}</p></div><p class="journey-copy body-copy" lang="en"></p></div>`;
  const paragraph = article.querySelector('.journey-copy');
  paragraph.textContent = panel.copy ?? content.journey;
  if (panel.copy) paragraph.lang = 'en';
  journeyTrack.append(article);
});

const worksTrack = document.querySelector('#works-track');
for (let repeat = 0; repeat < 2; repeat++) {
  const sequence = document.createElement('div');
  sequence.className = 'works-sequence';
  if (repeat) sequence.setAttribute('aria-hidden', 'true');
  works.forEach(({ src, width, height }, index) => {
    const image = document.createElement('img');
    image.src = src;
    image.width = width;
    image.height = height;
    image.alt = repeat ? '' : `Portfolio work ${index + 1}`;
    image.loading = 'lazy';
    sequence.append(image);
  });
  worksTrack.append(sequence);
}

const covers = document.querySelector('#covers');
tracks.forEach(track => {
  const card = document.createElement('span');
  card.className = 'cover';
  const image = document.createElement('img');
  image.src = track.cover;
  image.alt = '';
  image.width = image.height = 640;
  image.loading = 'lazy';
  card.append(image);
  covers.append(card);
});

const scroll = createScrollController();
initMobileHeader();
initMobileAbout(scroll);
initHeroAbout(scroll);
initAboutCopy();
initAboutArrow();
initJourney(scroll);
initMobileJourneyComposition(scroll);
initJourneyComposition();
initMadeMarquee();
initAudioDeck();
initMobileConnect(scroll);
initConnect(scroll);
initHeaderContrast();
window.addEventListener('load', () => scroll.refresh(), { once: true });
