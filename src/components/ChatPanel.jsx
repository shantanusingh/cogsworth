import React, { useEffect, useRef, useState } from 'react';
import { sendChatMessage } from '../lib/supabase.js';

export default function ChatPanel({ roomId, username, messages = [] }) {
  const [input, setInput] = useState('');
  const [localMessages, setLocalMessages] = useState(messages);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setLocalMessages(messages);
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      await sendChatMessage(roomId, username, input, 'player');
      setInput('');
    }
  };

  const getMessageColor = (type) => {
    switch (type) {
      case 'success':
        return '#51cf66';
      case 'system':
        return '#4dd0e1';
      case 'snippet':
        return '#d4a843';
      default:
        return '#e0e0e0';
    }
  };

  const getMessageStyle = (type) => {
    if (type === 'system') {
      return { fontStyle: 'italic' };
    }
    if (type === 'snippet') {
      return {
        backgroundColor: 'rgba(212, 168, 67, 0.1)',
        padding: '8px 12px',
        borderLeft: '2px solid #d4a843',
        fontFamily: 'monospace',
        fontSize: '12px'
      };
    }
    return {};
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '260px',
        borderLeft: '1px solid #d4a843',
        backgroundColor: '#0a0a0f'
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
        ⚡ team comms
      </div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px',
          fontSize: '13px',
          lineHeight: '1.5'
        }}
      >
        {localMessages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              marginBottom: '8px',
              color: getMessageColor(msg.type),
              ...getMessageStyle(msg.type)
            }}
          >
            {msg.type !== 'system' && msg.player_name && (
              <span style={{ fontWeight: 'bold' }}>{msg.player_name}: </span>
            )}
            {msg.message}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div
        style={{
          padding: '12px',
          borderTop: '1px solid #d4a843'
        }}
      >
        <input
          type="text"
          placeholder="Type message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleSendMessage}
          style={{
            width: '100%',
            padding: '8px 12px',
            backgroundColor: '#050508',
            color: '#e0e0e0',
            border: '1px solid #d4a843',
            fontFamily: 'inherit',
            fontSize: '13px',
            marginBottom: '8px'
          }}
        />
        <button
          onClick={async () => {
            if (input.trim()) {
              await sendChatMessage(roomId, username, input, 'player');
              setInput('');
            }
          }}
          style={{
            width: '100%',
            padding: '8px 12px'
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
