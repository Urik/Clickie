import React, { useState, ChangeEvent, KeyboardEvent } from 'react';
import { Song } from './Song';

import './SongsList.scss';

type SongsListProps = {
  songs: Song[];
  songSelected: (song: Song) => void;
  songListHasBeenModified: (newSongList: Song[]) => void;
  currentTempo: number;
  selectedSong?: Song;
};

export const SongsList: React.FC<SongsListProps> = ({
  songs,
  songSelected,
  selectedSong,
  currentTempo,
  songListHasBeenModified
}) => {
  const [newSongName, setNewSongName] = useState('');
  function addSong(songName: string): void {
    const sanitizedSongName = songName.trim();
    if(sanitizedSongName) {
        setNewSongName('');
        const newSong = {
            id: String(Math.random()),
            name: sanitizedSongName,
            tempo: currentTempo
        };
        songListHasBeenModified([...songs, newSong]);
        songSelected(newSong);
    }
  }

  function removeSong(song: Song): void {
    songListHasBeenModified(songs.filter(auxSong => auxSong !== song));
  }

  function songNameChanged(event: ChangeEvent<HTMLInputElement>): void {
    event.stopPropagation();
    setNewSongName(event.currentTarget.value);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.key === 'Enter') {
      addSong(newSongName);
    }
  }

  return (
    <div className="panel full-width">
      <div className="panel-heading">
        Song List
      </div>
      <div className="panel-block full-width">
        <div className="field is-grouped full-width">
          <div className="control is-expanded">
            <input className="input" type="text" placeholder="Add a song" value={newSongName} onKeyDown={handleKeyDown} onChange={songNameChanged} />
          </div>
          <div className="control">
            <button className="button is-success" onClick={() => addSong(newSongName)}>+</button>
          </div>
        </div>
      </div>
      <ul>
        {
          songs.map(song =>
            <li key={song.id} className={`panel-block song`}>
              <div className="song-name-parent full-width has-text-left" onClick={() => songSelected(song)}>
                <div className={`song-name ${song.id === selectedSong?.id ? 'selected-song' : ''}`}>
                  {song.name}
                </div>
              </div>
              <button className="button is-danger" onClick={() => removeSong(song)}>X</button>
            </li>
          )
        }
      </ul>


    </div>
  );
};
