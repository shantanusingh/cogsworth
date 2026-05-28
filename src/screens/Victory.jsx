import React, { useEffect, useState } from 'react';
import audioManager, { AMBIENT_CONFIGS } from '../components/AudioManager.jsx';
import Attribution from '../components/Attribution.jsx';

export default function Victory({ onPlayAgain }) {
  const [attributionOpen, setAttributionOpen] = useState(false);

  useEffect(() => {
    audioManager.transitionTo(AMBIENT_CONFIGS.victory);
    audioManager.playSfx('victory');

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
        padding: '40px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Radial glow background */}
      <div
        style={{
          position: 'absolute',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(212, 168, 67, 0.2) 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none'
        }}
      />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
        <h1
          style={{
            fontSize: '3.5rem',
            fontFamily: '"Cinzel", serif',
            color: '#d4a843',
            marginBottom: '24px',
            textShadow: '0 0 20px rgba(212, 168, 67, 0.4)',
            letterSpacing: '2px'
          }}
        >
          ACADEMY RESTORED
        </h1>

        <p
          style={{
            fontSize: '1.2rem',
            color: '#e0e0e0',
            fontFamily: '"Lora", serif',
            maxWidth: '600px',
            lineHeight: '1.8',
            marginBottom: '48px'
          }}
        >
          All eight Runic Fragments have been restored. The corruption dissolves.
          Nullbyte retreats into the static. The Academy breathes again — gears turning,
          steam flowing, spells working.
        </p>

        <p
          style={{
            fontSize: '1.3rem',
            color: '#f0c060',
            fontFamily: '"Cinzel", serif',
            marginBottom: '48px',
            fontStyle: 'italic'
          }}
        >
          You are true Arcane Engineers of Cogsworth Academy.
        </p>

        <button
          onClick={onPlayAgain}
          style={{
            padding: '16px 48px',
            fontSize: '1.1rem',
            fontFamily: '"JetBrains Mono", monospace',
            cursor: 'pointer',
            backgroundColor: '#d4a843',
            color: '#0a0a0f',
            border: 'none',
            fontWeight: 'bold',
            letterSpacing: '1px'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#f0c060';
            audioManager.playSfx('click');
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#d4a843';
          }}
        >
          ⚙ Play Again
        </button>
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
          color: '#666'
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
    </div>
  );
}
