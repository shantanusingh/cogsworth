import React, { useState, useEffect } from 'react';
import { USERNAMES } from '../engine/levels.js';
import { createRoom, joinRoom, addPlayer } from '../lib/supabase.js';
import audioManager from '../components/AudioManager.jsx';

export default function Setup({ isCreating, onComplete }) {
  const [teamName, setTeamName] = useState('');
  const [selectedUsername, setSelectedUsername] = useState('');
  const [mode, setMode] = useState('normal');
  const [roomCode, setRoomCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    audioManager.playTrackForScene('setup');
    return () => audioManager.stop();
  }, []);

  const handleCreateRoom = async () => {
    if (!teamName.trim() || !selectedUsername) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const room = await createRoom(teamName, mode);
      const player = await addPlayer(room.id, selectedUsername, true);
      onComplete({ room, player, username: selectedUsername });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!roomCode.trim() || !selectedUsername) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const room = await joinRoom(roomCode);
      if (!room) {
        setError('Room not found');
        return;
      }
      const player = await addPlayer(room.id, selectedUsername, false);
      onComplete({ room, player, username: selectedUsername });
    } catch (err) {
      setError(err.message || 'Failed to join room');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0a0a0f',
        padding: '20px'
      }}
    >
      <div
        style={{
          maxWidth: '600px',
          width: '100%',
          padding: '32px',
          backgroundColor: '#1a1a22',
          border: '1px solid #d4a843',
          borderRadius: 0
        }}
      >
        <h1 style={{ textAlign: 'center', marginBottom: '32px' }}>
          {isCreating ? 'Create Academy Room' : 'Join Academy Room'}
        </h1>

        {isCreating && (
          <>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px' }}>
                Team Name
              </label>
              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="e.g., Code Breakers"
                style={{ width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '12px' }}>
                Game Mode
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button
                  onClick={() => setMode('normal')}
                  style={{
                    padding: '12px',
                    backgroundColor: mode === 'normal' ? '#d4a843' : 'transparent',
                    color: mode === 'normal' ? '#0a0a0f' : '#d4a843'
                  }}
                >
                  Normal Mode
                  <div style={{ fontSize: '12px' }}>Take your time</div>
                </button>
                <button
                  onClick={() => setMode('timed')}
                  style={{
                    padding: '12px',
                    backgroundColor: mode === 'timed' ? '#d4a843' : 'transparent',
                    color: mode === 'timed' ? '#0a0a0f' : '#d4a843'
                  }}
                >
                  Timed Mode
                  <div style={{ fontSize: '12px' }}>Race the clock</div>
                </button>
              </div>
            </div>
          </>
        )}

        {!isCreating && (
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>
              Room Code
            </label>
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="6-digit code"
              maxLength="6"
              style={{
                width: '100%',
                fontSize: '1.2rem',
                textAlign: 'center',
                letterSpacing: '4px'
              }}
            />
          </div>
        )}

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '12px' }}>
            Select Your Username
          </label>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '8px',
            maxHeight: '200px',
            overflowY: 'auto'
          }}>
            {USERNAMES.map((name) => (
              <button
                key={name}
                onClick={() => setSelectedUsername(name)}
                style={{
                  padding: '8px',
                  fontSize: '12px',
                  backgroundColor: selectedUsername === name ? '#d4a843' : 'transparent',
                  color: selectedUsername === name ? '#0a0a0f' : '#d4a843',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div style={{
            marginBottom: '16px',
            padding: '12px',
            backgroundColor: '#ff6b6b20',
            color: '#ff6b6b',
            borderLeft: '3px solid #ff6b6b'
          }}>
            {error}
          </div>
        )}

        <button
          onClick={isCreating ? handleCreateRoom : handleJoinRoom}
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '1rem'
          }}
        >
          {isLoading ? '...' : isCreating ? 'Create Room' : 'Join the Academy'}
        </button>
      </div>
    </div>
  );
}
