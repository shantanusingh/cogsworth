import React, { useEffect, useState } from 'react';
import audioManager, { AMBIENT_CONFIGS } from '../components/AudioManager.jsx';

export default function Cutscene({ content, onComplete }) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  // Initialize audio and speech
  useEffect(() => {
    // Play "Our Story Begins" for intro, fallback for other cutscenes
    const isIntro = content.speaker === 'HEADMISTRESS IRONCLAD';
    if (isIntro) {
      audioManager.playTrackForScene('introCutscene');
    } else {
      audioManager.playAmbient(AMBIENT_CONFIGS.cutscene);
    }

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
        backgroundColor: '#000000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px',
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
          top: '60px',
          color: '#d4a843',
          fontFamily: '"Cinzel", serif',
          fontSize: '1.2rem',
          letterSpacing: '2px',
          textShadow: '0 0 10px rgba(212, 168, 67, 0.3)'
        }}
      >
        {content.speaker}
      </div>

      {/* Story text */}
      <div
        style={{
          maxWidth: '800px',
          fontSize: '1.1rem',
          lineHeight: '1.8',
          textAlign: 'center',
          minHeight: '200px',
          fontFamily: '"Lora", serif',
          whiteSpace: 'pre-wrap'
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
            bottom: '60px',
            color: '#d4a843',
            fontSize: '0.9rem',
            animation: 'blink 1.5s infinite'
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
