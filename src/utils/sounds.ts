/**
 * Sound utility to play success and error sounds
 */

const SUCCESS_SOUND_URL = 'https://codeskulptor-demos.commondatastorage.googleapis.com/descent/gotitem.mp3';
const ERROR_SOUND_URL = 'https://codeskulptor-demos.commondatastorage.googleapis.com/descent/Crumble%20Sound.mp3';

export const playSuccessSound = () => {
  const audio = new Audio(SUCCESS_SOUND_URL);
  audio.volume = 0.5;
  audio.play().catch(err => console.log('Sound play error:', err));
};

export const playErrorSound = () => {
  const audio = new Audio(ERROR_SOUND_URL);
  audio.volume = 0.4;
  audio.play().catch(err => console.log('Sound play error:', err));
};


