import { tracks } from '../data/made.js';
import { motion } from './config.js';
import { reducedMotion } from './scroll.js';

export function initAudioDeck() {
  const deck = document.querySelector('.cover-deck');
  const cards = [...document.querySelectorAll('.cover')];
  const player = document.querySelector('.player');
  const audio = document.querySelector('#portfolio-audio');
  const titleWindow = document.querySelector('.music-title-window');
  const title = document.querySelector('.music-track-title');
  const status = document.querySelector('#audio-status');
  let order = tracks.map((_, i) => i), activeIndex = 0, busy = false, selecting = false, version = 0;
  let pressAnimation;
  const phaseDuration = motion.deck.duration / 2;
  deck.style.setProperty('--deck-duration', `${phaseDuration}ms`);

  function position(card, depth) {
    const scale = parseFloat(getComputedStyle(deck).getPropertyValue(`--cover-scale-${depth}`));
    card.style.setProperty('--cover-depth', depth);
    card.style.setProperty('--cover-scale', scale);
  }
  function layout() {
    order.forEach((index, depth) => {
      const card = cards[index];
      position(card, depth);
      card.style.setProperty('--cover-shade', `var(--cover-shade-${depth + 1})`);
      card.style.setProperty('--cover-z', tracks.length - depth);
      card.classList.toggle('is-front', depth === 0);
    });
    deck.setAttribute('aria-label', `Next track. Selected: ${tracks[activeIndex].title}`);
  }
  function playingState(playing) {
    player.setAttribute('aria-label', playing ? 'Pause audio' : 'Play audio');
    player.setAttribute('aria-pressed', String(playing));
    titleWindow.classList.toggle('is-playing', playing);
  }
  function select(index) {
    version++;
    audio.pause();
    playingState(false);
    activeIndex = index;
    audio.src = tracks[index].audio;
    title.textContent = tracks[index].title;
    measureTitle();
    status.textContent = `Selected: ${tracks[index].title}`;
  }
  function press(action) {
    if (reducedMotion.matches) return;
    pressAnimation?.cancel();
    const config = motion.player;
    pressAnimation = player.animate(config[`${action}Frames`].map(({ offset, scale, y }) => ({
      offset, transform: `translateY(${y}px) scale(${scale})`, easing: config.easing,
    })), { duration: config[`${action}Duration`] });
  }
  deck.addEventListener('click', async () => {
    if (busy) return;
    busy = true;
    selecting = true;
    deck.classList.add('is-cycling');
    const outgoing = cards[order[0]];
    audio.pause();
    version++;
    playingState(false);
    outgoing.classList.add('is-outgoing');
    // Rear covers advance during the outgoing cover's initial left/down motion.
    order.slice(1).forEach((index, depth) => {
      position(cards[index], depth);
    });
    if (!reducedMotion.matches) await new Promise(resolve => setTimeout(resolve, phaseDuration));
    order.push(order.shift());
    outgoing.classList.remove('is-outgoing');
    select(order[0]);
    selecting = false;
    layout();
    if (!reducedMotion.matches) await new Promise(resolve => setTimeout(resolve, phaseDuration));
    deck.classList.remove('is-cycling');
    busy = false;
  });
  player.addEventListener('click', async () => {
    if (selecting) return;
    press(audio.paused ? 'play' : 'pause');
    if (!audio.paused) { audio.pause(); return; }
    const attempt = ++version;
    try {
      await audio.play();
      if (attempt !== version) return;
    } catch {
      if (attempt !== version) return;
      playingState(false);
      status.textContent = 'Audio could not play. Press the player to try again.';
    }
  });
  audio.addEventListener('playing', () => {
    if (audio.paused || selecting) return;
    playingState(true);
    status.textContent = `Playing: ${tracks[activeIndex].title}`;
  });
  audio.addEventListener('waiting', () => titleWindow.classList.remove('is-playing'));
  audio.addEventListener('pause', () => { playingState(false); status.textContent = `Paused: ${tracks[activeIndex].title}`; });
  audio.addEventListener('ended', () => { playingState(false); status.textContent = `Finished: ${tracks[activeIndex].title}`; });
  audio.addEventListener('error', () => playingState(false));
  function measureTitle() {
    const css = getComputedStyle(titleWindow);
    const originX = parseFloat(css.getPropertyValue('--title-origin-x'));
    const originY = parseFloat(css.getPropertyValue('--title-origin-y'));
    const origin = player.offsetLeft + player.offsetWidth * originX;
    const rightInset = parseFloat(css.getPropertyValue('--title-clip-right'));
    const width = player.offsetParent.clientWidth - rightInset - origin;
    titleWindow.style.setProperty('--title-origin-left', `${origin}px`);
    titleWindow.style.setProperty('--title-origin-width', `${width}px`);
    const start = -title.offsetWidth;
    titleWindow.style.setProperty('--title-origin-top', `${player.offsetTop + player.offsetHeight * originY - title.offsetHeight / 2}px`);
    const end = width;
    const speed = parseFloat(css.getPropertyValue('--title-speed'));
    titleWindow.style.setProperty('--title-start', `${start}px`);
    titleWindow.style.setProperty('--title-end', `${end}px`);
    titleWindow.style.setProperty('--title-cycle', `${(end - start) / speed}s`);
  }
  new ResizeObserver(measureTitle).observe(player);
  new ResizeObserver(measureTitle).observe(titleWindow);
  new ResizeObserver(measureTitle).observe(title);
  select(0);
  layout();
  measureTitle();
}
