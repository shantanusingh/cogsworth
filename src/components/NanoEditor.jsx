import React, { useEffect, useRef } from 'react';

export default function NanoEditor({ filename, content, onSave, onClose }) {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.value = content;
    }
  }, [content]);

  const handleSave = () => {
    const newContent = textareaRef.current.value;
    onSave(newContent);
  };

  const handleKeyDown = (e) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 's') {
        e.preventDefault();
        handleSave();
      } else if (e.key === 'x') {
        e.preventDefault();
        onClose();
      }
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(5, 15, 5, 0.95)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000,
        fontFamily: '"JetBrains Mono", monospace'
      }}
    >
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid #d4a843',
          color: '#d4a843',
          fontSize: '14px'
        }}
      >
        <div>GNU nano — {filename}</div>
        <div style={{ fontSize: '12px', marginTop: '4px', color: '#999' }}>
          Ctrl+S to save, Ctrl+X to exit
        </div>
      </div>

      <textarea
        ref={textareaRef}
        onKeyDown={handleKeyDown}
        style={{
          flex: 1,
          padding: '12px',
          border: 'none',
          backgroundColor: '#050508',
          color: '#e0e0e0',
          fontFamily: 'inherit',
          fontSize: '14px',
          resize: 'none',
          outline: 'none'
        }}
      />

      <div
        style={{
          padding: '12px 16px',
          borderTop: '1px solid #d4a843',
          display: 'flex',
          gap: '8px',
          justifyContent: 'flex-end'
        }}
      >
        <button onClick={handleSave} style={{ padding: '8px 16px' }}>
          Save (Ctrl+S)
        </button>
        <button onClick={onClose} style={{ padding: '8px 16px' }}>
          Close (Ctrl+X)
        </button>
      </div>
    </div>
  );
}
