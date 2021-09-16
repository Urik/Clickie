

import { Howl } from 'howler';
import audioPath from '../sound-clips/main.wav';

const audio = new Howl({ src: audioPath });
export const main = {
  play(volume: number = 100) {
    audio.volume(volume / 100);
    return Promise.resolve(audio.play());
  }
};
