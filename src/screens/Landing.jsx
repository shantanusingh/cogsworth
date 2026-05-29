import React, { useEffect, useState } from 'react';
import audioManager from '../components/AudioManager.jsx';
import Attribution from '../components/Attribution.jsx';

export default function Landing({ onCreateRoom, onJoinRoom }) {
  const [attributionOpen, setAttributionOpen] = useState(false);

  useEffect(() => {
    const playAudio = async () => {
      try {
        await audioManager.playTrackForScene('landing');
      } catch (error) {
        console.error('Failed to play landing audio:', error);
      }
    };
    playAudio();
    return () => audioManager.stop();
  }, []);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0a0a0f',
        backgroundImage: 'url(/assets/backgropund.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#e0e0e0',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Dark overlay for readability */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          zIndex: 1
        }}
      />

      {/* Rotating gears background */}
      <div
        style={{
          position: 'absolute',
          top: '-50px',
          left: '-50px',
          width: '200px',
          height: '200px',
          border: '3px solid #d4a843',
          borderRadius: '50%',
          opacity: 0.1,
          animation: 'spin 20s linear infinite'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-80px',
          right: '-80px',
          width: '300px',
          height: '300px',
          border: '3px solid #f0c060',
          borderRadius: '50%',
          opacity: 0.08,
          animation: 'spin 30s linear reverse'
        }}
      />

      {/* Content */}
      <div style={{ textAlign: 'center', zIndex: 10 }}>
        <h1
          style={{
            fontSize: '3.5rem',
            fontFamily: '"Cinzel", serif',
            color: '#d4a843',
            marginTop: '80px',
            marginBottom: '8px',
            textShadow: '0 0 20px rgba(212, 168, 67, 0.4)'
          }}
        >
          COGSWORTH
        </h1>

        <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', marginTop: '240px' }}>
          <button
            onClick={onCreateRoom}
            style={{
              padding: '12px 32px',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            ⚙ Create Room
          </button>
          <button
            onClick={onJoinRoom}
            style={{
              padding: '12px 32px',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            ↯ Join Room
          </button>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          right: '16px',
          textAlign: 'center',
          fontSize: '0.75rem',
          color: '#666',
          zIndex: 10
        }}
      >
        <button
          onClick={() => setAttributionOpen(true)}
          style={{
            background: 'none',
            border: 'none',
            color: '#999',
            cursor: 'pointer',
            textDecoration: 'underline',
            fontSize: '0.75rem',
            padding: 0
          }}
        >
          🎵 Audio Attribution
        </button>
      </div>

      <Attribution isOpen={attributionOpen} onClose={() => setAttributionOpen(false)} />

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
