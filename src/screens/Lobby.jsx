import React, { useEffect, useState } from 'react';
import { supabase, startGame, subscribeToRoom, getRoomPlayers } from '../lib/supabase.js';
import audioManager from '../components/AudioManager.jsx';

export default function Lobby({ room, player, onGameStart }) {
  const [isHost, setIsHost] = useState(player?.is_host || false);
  const [players, setPlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    audioManager.playTrackForScene('lobby');
    return () => audioManager.stop();
  }, []);

  // Load initial players and poll for updates
  useEffect(() => {
    const loadPlayers = async () => {
      try {
        const allPlayers = await getRoomPlayers(room.id);
        setPlayers(allPlayers);
      } catch (err) {
        console.error('Error loading players:', err);
      }
    };

    loadPlayers();

    // Poll for new players every 1 second (MVP fallback if realtime fails)
    const playerInterval = setInterval(loadPlayers, 1000);

    return () => clearInterval(playerInterval);
  }, [room.id]);

  // Subscribe to room changes (game start)
  useEffect(() => {
    try {
      const roomSubscription = subscribeToRoom(room.id, (payload) => {
        console.log('Room update:', payload);
        if (payload.new.status === 'playing') {
          onGameStart();
        }
      });

      return () => {
        roomSubscription.unsubscribe();
      };
    } catch (err) {
      console.error('Realtime subscription failed, using polling fallback');
      // Fallback: poll room status every 2 seconds
      const roomInterval = setInterval(async () => {
        try {
          const { data } = await supabase.from('rooms').select('status').eq('id', room.id).single();
          if (data?.status === 'playing') {
            onGameStart();
          }
        } catch (e) {
          // Ignore polling errors
        }
      }, 2000);

      return () => clearInterval(roomInterval);
    }
  }, [room.id, onGameStart]);

  const handleStartGame = async () => {
    setIsLoading(true);
    try {
      console.log('Starting game for room:', room.id);
      await startGame(room.id);
      console.log('Game start signal sent');
    } catch (err) {
      console.error('Error starting game:', err);
      alert(`Error starting game: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const playerSlots = Array(4).fill(null).map((_, idx) => {
    return players[idx] || null;
  });

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
        <h1 style={{ textAlign: 'center', marginBottom: '8px' }}>
          {room.team_name}
        </h1>
        <p style={{ textAlign: 'center', color: '#999', marginBottom: '32px' }}>
          Code: <span style={{ color: '#d4a843', fontWeight: 'bold', fontSize: '1.2rem' }}>
            {room.code}
          </span>
        </p>

        <div style={{ marginBottom: '32px' }}>
          <label style={{ display: 'block', marginBottom: '12px', color: '#d4a843' }}>
            Team Members
          </label>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px'
          }}>
            {playerSlots.map((p, idx) => (
              <div
                key={idx}
                style={{
                  padding: '16px',
                  border: '1px solid #d4a843',
                  textAlign: 'center',
                  color: p ? '#4aff91' : '#666'
                }}
              >
                {p ? p.username : '[ waiting... ]'}
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '32px', paddingBottom: '16px', borderBottom: '1px solid #d4a843' }}>
          <p style={{ color: '#999', fontSize: '14px' }}>
            <strong>Mode:</strong> {room.mode === 'normal' ? 'Normal' : 'Timed'}
          </p>
          <p style={{ color: '#999', fontSize: '14px', marginTop: '8px' }}>
            <strong>Players:</strong> {players.length}/4
          </p>
        </div>

        {isHost && (
          <button
            onClick={handleStartGame}
            disabled={isLoading || players.length === 0}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '1rem'
            }}
          >
            {isLoading ? 'Starting...' : 'Start Game'}
          </button>
        )}

        {!isHost && (
          <p style={{ textAlign: 'center', color: '#999' }}>
            Waiting for host to start the game...
          </p>
        )}
      </div>
    </div>
  );
}
