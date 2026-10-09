import './styles/tokens.css';
import './styles/global.css';
import './styles/sections.css';
import { content } from './data/content.js';
import { journeyPanels } from './data/journey.js';
import { works, tracks } from './data/made.js';
import { createScrollController } from './interactions/scroll.js';
import { initHeroAbout } from './interactions/hero-about.js';
import { initJourney } from './interactions/journey.js';
import { initMadeMarquee } from './interactions/made-marquee.js';
import { initAudioDeck } from './interactions/made-audio-deck.js';
import { initConnect } from './interactions/connect.js';
import { initHeaderContrast } from './interactions/header-contrast.js';

for (const element of document.querySelectorAll('[data-copy]')) {
  const copy = content[element.dataset.copy];
  if (Array.isArray(copy)) {
    for (const text of copy) {
      const paragraph = document.createElement('p');
      paragraph.textContent = text;
      if (element.dataset.copy === 'about') paragraph.lang = 'ru';
      element.append(paragraph);
    }
  } else element.textContent = copy;
}

const journeyTrack = document.querySelector('#journey-track');
journeyPanels.forEach((panel, index) => {
  const article = document.createElement('article');
  article.className = 'journey-panel';
  article.setAttribute('aria-labelledby', `role-${index}`);
  article.innerHTML = `<img class="journey-image" src="${panel.image}" alt="${panel.alt}" width="1280" height="1440" loading="lazy" />
    <div class="journey-text"><div class="journey-heading"><h3 id="role-${index}">${panel.title}</h3><p class="journey-metadata">${panel.metadata}</p></div><p class="journey-copy body-copy" lang="ru"></p></div>`;
  article.querySelector('.journey-copy').textContent = content.journey;
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
initHeroAbout(scroll);
initJourney(scroll);
initMadeMarquee();
initAudioDeck();
initConnect(scroll);
initHeaderContrast();
window.addEventListener('load', () => scroll.refresh(), { once: true });
