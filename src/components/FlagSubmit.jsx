import React, { useState, useEffect } from 'react';

export default function FlagSubmit({
  level,
  onSubmit,
  disabled = false,
  onClueClick = null
}) {
  const [flagInput, setFlagInput] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimeRemaining, setLockTimeRemaining] = useState(0);

  useEffect(() => {
    if (!isLocked) return;

    const timer = setInterval(() => {
      setLockTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsLocked(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isLocked]);

  const handleSubmit = async () => {
    if (isLocked || !flagInput.trim()) return;

    const normalized = flagInput.trim().toLowerCase().replace(/\s+/g, '_');
    const isCorrect = normalized === level.flag;

    if (isCorrect) {
      setFlagInput('');
      await onSubmit(true);
    } else {
      setIsLocked(true);
      setLockTimeRemaining(10);
      await onSubmit(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !isLocked) {
      handleSubmit();
    }
  };

  return (
    <div
      style={{
        borderTop: '1px solid #d4a843',
        padding: '12px 16px',
        backgroundColor: '#0a0a0f',
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}
    >
      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
        <span style={{ color: '#d4a843' }}>COGSWORTH{'{'}
        <input
          type="text"
          value={flagInput}
          onChange={(e) => setFlagInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLocked || disabled}
          placeholder="flag_here"
          style={{
            width: '180px',
            padding: '6px 8px',
            backgroundColor: '#050508',
            color: '#e0e0e0',
            border: '1px solid #d4a843',
            fontFamily: 'inherit',
            fontSize: '12px'
          }}
        />
        {'}'}
        </span>
      </div>

      <button
        onClick={handleSubmit}
        disabled={isLocked || disabled}
        style={{
          padding: '8px 16px',
          opacity: isLocked ? 0.5 : 1
        }}
      >
        {isLocked ? `Locked — ${lockTimeRemaining}s` : 'SUBMIT'}
      </button>

      <div style={{ flex: 1 }} />

      {level.clues && level.clues.map((clue, idx) => (
        <button
          key={idx}
          onClick={() => onClueClick?.(idx)}
          style={{
            padding: '6px 12px',
            fontSize: '12px'
          }}
        >
          {'💡 Clue ' + (idx + 1)}
        </button>
      ))}
    </div>
  );
}
