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

  function layout() {
    order.forEach((index, depth) => {
      const card = cards[index];
      card.style.setProperty('--cover-depth', depth);
      card.style.setProperty('--cover-shade-depth', depth);
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
  function press() {
    if (reducedMotion.matches) return;
    pressAnimation?.cancel();
    const { pressScale, pressDepth, pressDuration, returnDuration } = motion.player;
    pressAnimation = player.animate([
      { transform: 'translateY(0) scale(1)', offset: 0 },
      { transform: `translateY(${pressDepth}px) scale(${pressScale})`, offset: pressDuration / (pressDuration + returnDuration), easing: 'cubic-bezier(.2,.8,.2,1)' },
      { transform: 'translateY(0) scale(1)', offset: 1 },
    ], { duration: pressDuration + returnDuration, easing: 'ease-out' });
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
      cards[index].style.setProperty('--cover-depth', depth);
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
    press();
    if (selecting) return;
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
    const start = player.offsetLeft + player.offsetWidth * originX - titleWindow.offsetLeft;
    titleWindow.style.setProperty('--title-origin-width', `${start}px`);
    titleWindow.style.setProperty('--title-origin-top', `${player.offsetTop + player.offsetHeight * originY - title.offsetHeight / 2}px`);
    const end = -title.offsetWidth;
    const speed = parseFloat(css.getPropertyValue('--title-speed'));
    titleWindow.style.setProperty('--title-start', `${start}px`);
    titleWindow.style.setProperty('--title-end', `${end}px`);
    titleWindow.style.setProperty('--title-cycle', `${(start - end) / speed}s`);
  }
  new ResizeObserver(measureTitle).observe(player);
  new ResizeObserver(measureTitle).observe(titleWindow);
  new ResizeObserver(measureTitle).observe(title);
  select(0);
  layout();
  measureTitle();
}
