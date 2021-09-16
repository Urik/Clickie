

import React, { Component, SyntheticEvent } from 'react';
import { debounce } from 'lodash/fp';
import './Metronome.scss';
import '../utils/helpers.scss';
import TempoInput from './TempoInput/TempoInput';
import { SPACE } from '../utils/keyConstants';
import { BarPlayer } from './BarPlayer';
import { createBar } from '../music-beats/bar';
import { Song } from './Song';
import { SongsList } from './SongsList';
import { TapCalculator } from './tap-calculator/tap-calculator';
import { VolumeControl } from './VolumeControl/VolumeControl';

type State = {
  bpm: number,
  playingSound: boolean,
  subdivisions: number,
  songs: Song[],
  selectedSongId?: string,
  volume: number;
};

type Props = { defaultBpm: number };
class Metronome extends Component<Props, State> {
  private playingInterval: any = null;
  private tempoCalculator = new TapCalculator();
  private barPlayer: BarPlayer;

  constructor(props: Props) {
    super(props);

    const savedTempo = localStorage['tempo'];
    const tempo: number = savedTempo != null ? Number(savedTempo) : this.props.defaultBpm;

    this.state = {
      bpm: tempo,
      playingSound: false,
      subdivisions: 0,
      songs: [],
      selectedSongId: '',
      volume: 100
    };



    this.play = debounce(50, this.play).bind(this);
    this.barPlayer = new BarPlayer(createBar(this.state.subdivisions), this.state.volume, this.state.bpm);
    document.addEventListener('keydown', this.toggleOnSpacePress);
  }

  saveSongList(songs: Song[]) {
    localStorage.setItem('songs', JSON.stringify(songs));
  }

  togglePlay = () => {
    this.setState((prevState: State) => {
      const playing = !prevState.playingSound;
      if (playing) {
        this.play(prevState.bpm);
      } else {
        this.barPlayer.stop();
      }

      return { ...prevState, playingSound: playing };
    });
  };

  play = (bpm: number) => {
    this.barPlayer.setTempo(bpm);
    this.barPlayer.start();
  };

  changeTempo = (newBpm: number) => {
    this.setState(prevState => ({ ...prevState, bpm: newBpm }));
    if (this.state.playingSound) {
      this.barPlayer.setTempo(newBpm);
    }

    if (this.state.selectedSongId) {
      const songIndex = this.state.songs.findIndex(song => song.id === this.state.selectedSongId);
      const song = this.state.songs[songIndex];
      const newSongs = [...this.state.songs];
      newSongs[songIndex] = {
        ...song,
        tempo: newBpm
      };
      this.setState({ songs: newSongs }, () => {
        this.saveSongList(this.state.songs);
      });
      // this.state.selectedSong.tempo = newBpm;
    }

    localStorage.setItem('tempo', String(newBpm));
  };

  changeSubdivisions = (event: SyntheticEvent<HTMLInputElement>) => {
    const newDivisions = event.currentTarget.valueAsNumber;
    this.setState(previousState => ({ ...previousState, subdivisions: newDivisions}));
    this.barPlayer.setBar(createBar(newDivisions));
  };

  toggleOnSpacePress = (e: KeyboardEvent) => {
    if (e.keyCode === SPACE) {
      this.togglePlay();
    }
  };

  async componentWillMount() {
    const songs = JSON.parse(localStorage.getItem('songs') || '[]');
    await this.setState({
      songs,
    });
    if (songs[0]) {
      this.selectSong(songs[0]);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.toggleOnSpacePress);
  }

  songListModified(newSongList: Song[]) {
    this.saveSongList(newSongList);
    this.setState({ songs: newSongList })
  }

  selectSong = async (song: Song): Promise<void> => {
    await this.setState({ selectedSongId: song.id });
    this.changeTempo(song.tempo);
  };

  tapTempo = () => {
    const tempo = this.tempoCalculator.tap();
    if (tempo) {
      this.changeTempo(tempo);
      console.log(tempo);
    }
  };

  setVolume = (volume: number) => {
    this.setState({ volume });
    this.barPlayer.setVolume(volume);
  };

  render() {
    const playButtonClass = this.state.playingSound ? 'fa-stop' : 'fa-play';
    return (
      <div className="metronome">
        <div className="tempo-row">
          <div className="tempo-input">
            <TempoInput bpm={this.state.bpm} changeTempo={this.changeTempo} />
          </div>
          <div className="volume-control">
            <VolumeControl volume={this.state.volume} onVolumeChange={(volume) => this.setVolume(volume)} />
          </div>
        </div>
        <button
          className="button is-success full-width tap-button"
          onMouseDown={this.tapTempo}
          onTouchStart={this.tapTempo}
          onTouchEnd={(e) => e.preventDefault()}
        >
          Tap
        </button>
        <div className="hidden">
          <input type="number" value={this.state.subdivisions} onChange={this.changeSubdivisions}/>
        </div>
        <button className="button is-link is-light start-button full-width" onClick={this.togglePlay}>
          <span className={`fa ${playButtonClass}`} />
        </button>

        <div className="songs-list full-width">
          <SongsList
            songs={this.state.songs}
            currentTempo={this.state.bpm}
            selectedSong={this.state.songs.find(song => song.id === this.state.selectedSongId)}
            songSelected={this.selectSong.bind(this)}
            songListHasBeenModified={this.songListModified.bind(this)}
          />
        </div>
      </div>
    );
  }
}

export default Metronome;
