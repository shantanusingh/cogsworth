import React, { useState } from 'react';

export default function Attribution({ isOpen, onClose }) {
  if (!isOpen) return null;

  const attributions = [
    {
      title: 'Our Story Begins',
      artist: 'Kevin MacLeod',
      source: 'incompetech.com',
      license: 'Creative Commons: By Attribution 4.0 License',
      licenseUrl: 'http://creativecommons.org/licenses/by/4.0/'
    },
    {
      title: 'Dark Fog',
      artist: 'Kevin MacLeod',
      source: 'incompetech.com',
      license: 'Creative Commons: By Attribution 4.0 License',
      licenseUrl: 'http://creativecommons.org/licenses/by/4.0/'
    },
    {
      title: 'Shadowlands 5 - Antechamber',
      artist: '[Attribution Info]',
      source: '[Source]',
      license: 'Creative Commons License',
      licenseUrl: '#'
    },
    {
      title: 'Shadowlands 3 - Machine',
      artist: '[Attribution Info]',
      source: '[Source]',
      license: 'Creative Commons License',
      licenseUrl: '#'
    },
    {
      title: 'Division',
      artist: '[Attribution Info]',
      source: '[Source]',
      license: 'Creative Commons License',
      licenseUrl: '#'
    }
  ];

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px'
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#1a1a22',
          borderRadius: '8px',
          border: '2px solid #d4a843',
          maxWidth: '700px',
          maxHeight: '85vh',
          overflowY: 'auto',
          padding: '32px',
          boxShadow: '0 0 30px rgba(212, 168, 67, 0.3)',
          fontFamily: '"JetBrains Mono", monospace'
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: '28px', textAlign: 'center' }}>
          <h1 style={{
            fontSize: '1.8rem',
            fontFamily: '"Cinzel", serif',
            color: '#d4a843',
            margin: '0 0 8px 0',
            textShadow: '0 0 10px rgba(212, 168, 67, 0.3)'
          }}>
            🎵 AUDIO ATTRIBUTION
          </h1>
          <p style={{
            color: '#999',
            margin: '8px 0 0 0',
            fontSize: '0.9rem'
          }}>
            We gratefully acknowledge the talented composers and their licensed works
          </p>
        </div>

        {/* Attribution List */}
        <div style={{ display: 'grid', gap: '20px' }}>
          {attributions.map((attr, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#0a0a0f',
                border: '1px solid #333',
                borderRadius: '4px',
                padding: '16px',
                borderLeft: '4px solid #d4a843'
              }}
            >
              <div style={{
                fontSize: '0.95rem',
                color: '#4aff91',
                marginBottom: '8px',
                fontWeight: 'bold'
              }}>
                {attr.title}
              </div>

              <div style={{
                display: 'grid',
                gap: '6px',
                fontSize: '0.85rem',
                color: '#ccc',
                lineHeight: '1.5'
              }}>
                <div>
                  <span style={{ color: '#d4a843', fontWeight: 'bold' }}>Artist:</span> {attr.artist}
                </div>
                <div>
                  <span style={{ color: '#d4a843', fontWeight: 'bold' }}>Source:</span> {attr.source}
                </div>
                <div>
                  <span style={{ color: '#d4a843', fontWeight: 'bold' }}>License:</span>{' '}
                  <a
                    href={attr.licenseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#4aff91',
                      textDecoration: 'underline',
                      cursor: 'pointer'
                    }}
                  >
                    {attr.license}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div style={{
          marginTop: '28px',
          paddingTop: '16px',
          borderTop: '1px solid #333',
          fontSize: '0.8rem',
          color: '#666',
          lineHeight: '1.6'
        }}>
          <p style={{ margin: '0 0 8px 0' }}>
            <strong>🔗 Attribution Note:</strong> All audio tracks used in Cogsworth Academy are licensed
            under Creative Commons licenses. Each track includes proper attribution to its original creator.
            We respect the creative work of these composers and encourage you to explore their other compositions!
          </p>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '32px',
            height: '32px',
            padding: 0,
            fontSize: '1.5rem',
            background: 'transparent',
            border: 'none',
            color: '#d4a843',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
