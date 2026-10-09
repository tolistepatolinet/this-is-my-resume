const workDimensions = [[3508, 4961], [3240, 1080], [1080, 1920], [1080, 1350], [5400, 1080], [1080, 1920]];
export const works = workDimensions.map(([width, height], i) => ({ src: `/assets/made/marquee/work-0${i + 1}.webp`, width, height }));
const titles = [
  'Moosham - Я.mp3',
  'Cathou, Moosham - Я так дышу (alternative version).mp3',
  'Moosham, Cathou - Хамелеон.mp3',
  'Moosham - Accidentally.mp3',
  'Moosham, lera blvmrkv - Солнце.mp3',
];
export const tracks = titles.map((title, i) => ({
  title,
  cover: `/assets/made/covers/cover-0${i + 1}.jpg`,
  audio: `/assets/made/audio/track-0${i + 1}.mp3`,
}));
