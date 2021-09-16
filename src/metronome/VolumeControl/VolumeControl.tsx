import React from 'react';
import './VolumeControl.scss';


interface VolumeControlProps {
  volume: number;
  onVolumeChange: (newVolume: number) => void;
}

export function VolumeControl({ volume, onVolumeChange }: VolumeControlProps) {
  return (
    <div className="volume-control-component">
      <div>
        <h4>Volume</h4>
      </div>
      <input className="control" type="range" value={volume} onChange={(e) => onVolumeChange(parseInt(e.target.value))} min="0" max="100" />
    </div>
  );
}
