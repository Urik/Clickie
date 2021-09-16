import { clearDriftless, setDriftlessInterval, setDriftlessTimeout } from 'driftless';
import { Bar } from "../music-beats/bar";
import { main as mainBeep } from './beeps/main';
import { subdivision as subdivisionBeep } from './beeps/subdivision';
import { MusicMeasure } from '../music-beats/musicMeasure';

export class BarPlayer {
    i: number = 0;
    intervalId: number | null = null;
    lastPlayedBeatTime: number = Date.now();

    constructor(
        private bar: Bar = [],
        private volume: number,
        private metronomeBpm: number = 60
    ) {}

    start() {
        this.stop();
        this.i = 0;

        this.startInterval();
    }

    stop() {
        if (this.intervalId !== null) {
            clearDriftless(this.intervalId);
        }
        this.intervalId = null;
    }

    setTempo(bpm: number) {
        this.metronomeBpm = bpm;
        this.startInterval()
    }

    setBar(bar: Bar) {
        if (this.i >= bar.length) {
            this.i = bar.length - 1;
        }

        this.bar = bar;
        this.startInterval();
    }

    setVolume(volume: number) {
        this.volume = volume;
    }

    private async playBeat() {
        const beep = this.bar[this.i] === MusicMeasure.Beat ?
            mainBeep :
            subdivisionBeep;
        await beep.play(this.volume);
        this.lastPlayedBeatTime = Date.now();
    }


    private startInterval() {
        const intervalWithSubdivisions = this.calculateInterval(this.metronomeBpm);

        if (this.intervalId) {
            clearDriftless(this.intervalId);
        }

        const nextBeatTimestamp = this.lastPlayedBeatTime + intervalWithSubdivisions;
        const now = Date.now();
        const timeToNextBeat = (nextBeatTimestamp - now) > 0 ?
            nextBeatTimestamp - now :
            0;

        const play = () => {
            this.playBeat();
            this.advanceBeat(this.bar);
        };

        this.intervalId = setDriftlessTimeout(() => {
            play();
            this.intervalId = setDriftlessInterval(play, intervalWithSubdivisions);
        }, timeToNextBeat);
    }

    private calculateInterval(bpm: number) {
        const noteIntervalForBeat = Math.round(60000 / bpm);
        return noteIntervalForBeat / this.bar.length;
    }


    advanceBeat(bar: Bar) {
        this.i++;
        if (this.i >= bar.length) {
            this.i = 0;
        }
    }
}
