import React, { useEffect } from 'react';
import audioManager, { AMBIENT_CONFIGS } from '../components/AudioManager.jsx';

export default function Landing({ onCreateRoom, onJoinRoom }) {
  useEffect(() => {
    audioManager.playAmbient(AMBIENT_CONFIGS.landing);
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
        color: '#e0e0e0',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
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
            marginBottom: '8px',
            textShadow: '0 0 20px rgba(212, 168, 67, 0.4)'
          }}
        >
          COGSWORTH ACADEMY
        </h1>
        <p
          style={{
            fontSize: '1.2rem',
            color: '#f0c060',
            marginBottom: '32px',
            fontStyle: 'italic'
          }}
        >
          of Arcane Engineering
        </p>

        <p
          style={{
            fontSize: '0.95rem',
            color: '#999',
            marginBottom: '48px',
            maxWidth: '400px',
            lineHeight: '1.6'
          }}
        >
          Welcome, young engineer. Professor Nullbyte has corrupted the Academy.
          Your skills in code and cryptography are our only hope.
          Can you restore the Runic Fragments and defeat him?
        </p>

        <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
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

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
