import React, { useState } from 'react';
import audioManager from './AudioManager.jsx';

export default function AudioControls() {
  const [musicEnabled, setMusicEnabled] = useState(audioManager.musicEnabled);
  const [volume, setVolume] = useState(audioManager.musicVolume);

  const handleMusicToggle = () => {
    audioManager.toggleMusic();
    setMusicEnabled(!musicEnabled);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    audioManager.setVolume(newVolume);
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '0 12px'
      }}
    >
      <button
        onClick={handleMusicToggle}
        style={{
          padding: '6px 12px',
          fontSize: '12px',
          minWidth: 'auto'
        }}
      >
        {musicEnabled ? '♪ ON' : '♪ OFF'}
      </button>

      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={volume}
        onChange={handleVolumeChange}
        style={{
          width: '100px',
          cursor: 'pointer'
        }}
        title={`Volume: ${Math.round(volume * 100)}%`}
      />

      <span style={{ fontSize: '12px', color: '#999', minWidth: '30px' }}>
        {Math.round(volume * 100)}%
      </span>
    </div>
  );
}
