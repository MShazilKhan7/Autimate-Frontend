/**
 * Sound utility to play success and error sounds
 */

const SUCCESS_SOUND_URL = 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3';
const ERROR_SOUND_URL = 'https://assets.mixkit.co/active_storage/sfx/2573/2573-preview.mp3';

export const playSuccessSound = () => {
  const audio = new Audio(SUCCESS_SOUND_URL);
  audio.crossOrigin = 'anonymous';
  audio.volume = 0.5;
  audio.play().catch(err => console.log('Sound play error:', err));
};

export const playErrorSound = () => {
  const audio = new Audio(ERROR_SOUND_URL);
  audio.crossOrigin = 'anonymous';
  audio.volume = 0.4;
  audio.play().catch(err => console.log('Sound play error:', err));
};

