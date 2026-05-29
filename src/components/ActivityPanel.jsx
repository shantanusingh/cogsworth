import React, { useEffect, useRef } from 'react';

export default function ActivityPanel({ activities = [] }) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activities]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getOutputColor = (color) => {
    const colorMap = {
      'red': '#ff6b6b',
      'green': '#51cf66',
      'amber': '#d4a843',
      'cyan': '#4dd0e1',
      'success': '#51cf66',
      'error': '#ff6b6b',
      'yellow': '#ffd93d'
    };
    return colorMap[color] || '#e0e0e0';
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        borderBottom: '1px solid #d4a843'
      }}
    >
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid #d4a843',
          color: '#d4a843',
          fontWeight: 'bold',
          fontSize: '14px'
        }}
      >
        📺 team activity
      </div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px',
          fontSize: '12px',
          lineHeight: '1.4',
          fontFamily: '"JetBrains Mono", monospace'
        }}
      >
        {activities.length === 0 ? (
          <div style={{ color: '#666', fontStyle: 'italic', textAlign: 'center', marginTop: '20px' }}>
            Waiting for teammate activity...
          </div>
        ) : (
          activities.map((activity, idx) => (
            <div
              key={idx}
              style={{
                marginBottom: '12px',
                paddingBottom: '8px',
                borderBottom: '1px solid #222'
              }}
            >
              {/* Header: player $ command */}
              <div
                style={{
                  color: '#4dd0e1',
                  marginBottom: '4px',
                  wordBreak: 'break-word'
                }}
              >
                <span style={{ color: '#d4a843', fontWeight: 'bold' }}>
                  {activity.player_name}
                </span>
                <span style={{ color: '#888' }}> $ </span>
                <span>{activity.command}</span>
              </div>

              {/* Output lines */}
              {activity.outputs && activity.outputs.map((output, lineIdx) => (
                <div
                  key={lineIdx}
                  style={{
                    color: getOutputColor(output.color || 'default'),
                    marginLeft: '12px',
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  {output.text}
                </div>
              ))}

              {/* Timestamp */}
              <div
                style={{
                  color: '#666',
                  fontSize: '11px',
                  marginTop: '4px'
                }}
              >
                {formatTime(activity.ts)}
              </div>
            </div>
          ))
        )}
        <div ref={endRef} />
      </div>
    </div>
  );
}
