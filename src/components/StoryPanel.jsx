import React from 'react';

export default function StoryPanel({ level }) {
  return (
    <div
      style={{
        width: '100%',
        padding: '12px 16px',
        borderBottom: '1px solid #d4a843',
        backgroundColor: '#0a0a0f',
        overflowY: 'auto',
        maxHeight: '140px',
        fontSize: '13px',
        lineHeight: '1.6',
        borderRadius: 0
      }}
    >
      <div style={{ color: '#d4a843', marginBottom: '8px', fontWeight: 'bold' }}>
        📜 Chamber Briefing
      </div>
      <div
        style={{
          color: '#e0e0e0',
          fontFamily: '"Lora", serif',
          whiteSpace: 'pre-wrap'
        }}
      >
        {level.story}
      </div>
    </div>
  );
}
