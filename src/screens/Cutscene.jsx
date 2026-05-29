import React, { useEffect, useState } from 'react';
import audioManager, { AMBIENT_CONFIGS } from '../components/AudioManager.jsx';

export default function Cutscene({ content, onComplete }) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  // Initialize audio and speech
  useEffect(() => {
    const playAudio = async () => {
      // Play "Our Story Begins" for intro, fallback for other cutscenes
      const isIntro = content.speaker === 'HEADMISTRESS IRONCLAD';
      if (isIntro) {
        try {
          await audioManager.playTrackForScene('introCutscene');
        } catch (error) {
          console.error('Failed to play intro audio:', error);
        }
      } else {
        audioManager.playAmbient(AMBIENT_CONFIGS.cutscene);
      }
    };
    playAudio();

    return () => audioManager.stop();
  }, [content.speaker]);


  useEffect(() => {
    if (displayedText.length < content.text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(content.text.substring(0, displayedText.length + 1));
      }, 28);
      return () => clearTimeout(timer);
    } else {
      setIsComplete(true);
      const promptTimer = setTimeout(() => setShowPrompt(true), 500);
      const autoTimer = setTimeout(() => {
        audioManager.stop();
        onComplete();
      }, 15000);
      return () => {
        clearTimeout(promptTimer);
        clearTimeout(autoTimer);
      };
    }
  }, [displayedText, content.text, onComplete]);

  const handleClick = () => {
    if (isComplete) {
      audioManager.stop();
      onComplete();
    }
  };

  const handleKeyPress = (e) => {
    if (isComplete && e.key === 'Enter') {
      audioManager.stop();
      onComplete();
    }
  };

  useEffect(() => {
    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [isComplete, onComplete]);

  return (
    <div
      onClick={handleClick}
      style={{
        width: '100%',
        height: '100%',
        backgroundImage: 'url(/assets/terminal.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: '#000000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#e0e0e0',
        fontFamily: '"JetBrains Mono", monospace',
        cursor: isComplete ? 'pointer' : 'wait',
        position: 'relative'
      }}
    >
      {/* Speaker label */}
      <div
        style={{
          position: 'absolute',
          top: '28%',
          left: '50%',
          transform: 'translateX(-50%)',
          color: '#d4a843',
          fontFamily: '"Cinzel", serif',
          fontSize: '1.1rem',
          letterSpacing: '2px',
          textShadow: '0 0 10px rgba(212, 168, 67, 0.3)',
          zIndex: 10
        }}
      >
        {content.speaker}
      </div>

      {/* Story text */}
      <div
        style={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          maxWidth: '600px',
          width: '90%',
          fontSize: '1rem',
          lineHeight: '1.7',
          textAlign: 'center',
          fontFamily: '"Lora", serif',
          whiteSpace: 'pre-wrap',
          color: '#d4a843',
          zIndex: 10
        }}
      >
        {displayedText}
        {!isComplete && <span style={{ animation: 'blink 1s infinite' }}>▌</span>}
      </div>

      {/* Prompt */}
      {showPrompt && (
        <div
          style={{
            position: 'absolute',
            top: '54%',
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#d4a843',
            fontSize: '0.85rem',
            animation: 'blink 1.5s infinite',
            zIndex: 10
          }}
        >
          [ PRESS ENTER OR CLICK TO CONTINUE ]
        </div>
      )}

      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
