import React from 'react';

export default function CheatSheet({ isOpen, onClose }) {
  if (!isOpen) return null;

  const sections = [
    {
      icon: '🗺️',
      title: 'Finding Your Way Around (Navigation)',
      commands: [
        { cmd: 'pwd', name: 'Print Working Directory', desc: 'Tells you exactly which folder you are in right now.' },
        { cmd: 'ls', name: 'List', desc: 'Shows you all the files and folders in your current location.' },
        { cmd: 'cd <folder>', name: 'Change Directory', desc: 'Moves you inside another folder so you can look around.' },
        { cmd: 'cd ..', name: 'Go Back', desc: 'Steps you backward out of your current folder.' }
      ]
    },
    {
      icon: '🛠️',
      title: 'Creating and Changing Things (File Magic)',
      commands: [
        { cmd: 'mkdir <name>', name: 'Make Directory', desc: 'Creates a brand new, empty folder with whatever name you choose.' },
        { cmd: 'touch <file>', name: 'Touch', desc: 'Magically creates a completely blank text file instantly.' },
        { cmd: 'nano <file>', name: 'Nano', desc: 'Opens a simple text editor right in your terminal.' },
        { cmd: 'cp <file> <dest>', name: 'Copy', desc: 'Makes an exact duplicate of a file somewhere else.' },
        { cmd: 'mv <file> <dest>', name: 'Move', desc: 'Picks up a file and moves it, or lets you rename it.' }
      ]
    },
    {
      icon: '🧹',
      title: 'Cleaning Up (The Delete Buttons)',
      commands: [
        { cmd: 'rm <file>', name: 'Remove File', desc: 'Permanently deletes a file. Be careful—no trash can here!' },
        { cmd: 'rmdir <folder>', name: 'Remove Directory', desc: 'Safely deletes a folder (only if empty).' },
        { cmd: 'clear', name: 'Clear Screen', desc: 'Erases all old text from your screen for a fresh workspace.' }
      ]
    },
    {
      icon: '🐧',
      title: 'Fun Commands to Try',
      commands: [
        { cmd: 'whoami', name: 'Who Am I', desc: 'Prints your computer username on the screen.' },
        { cmd: 'date', name: 'Date', desc: 'Displays the current day, time, and year instantly.' },
        { cmd: 'cowsay "hello"', name: 'Cowsay', desc: 'Makes a funny ASCII art cow repeat your message!' }
      ]
    },
    {
      icon: '⚡',
      title: 'Superpower Shortcuts',
      commands: [
        { cmd: 'Tab Key', name: 'Auto-Complete', desc: 'Type the first few letters and hit Tab—the terminal finishes for you!' },
        { cmd: 'Up Arrow', name: 'History', desc: 'Scroll backward through commands you previously typed.' },
        { cmd: 'Ctrl + C', name: 'Stop', desc: 'Instantly stops any program that gets stuck or runs too long.' }
      ]
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
          maxWidth: '900px',
          maxHeight: '85vh',
          overflowY: 'auto',
          padding: '32px',
          boxShadow: '0 0 30px rgba(212, 168, 67, 0.3)',
          fontFamily: '"JetBrains Mono", monospace'
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <h1 style={{
            fontSize: '2rem',
            fontFamily: '"Cinzel", serif',
            color: '#d4a843',
            margin: '0 0 8px 0',
            textShadow: '0 0 10px rgba(212, 168, 67, 0.3)'
          }}>
            🔧 LINUX TERMINAL CHEAT SHEET
          </h1>
          <p style={{
            color: '#999',
            margin: '8px 0 0 0',
            fontSize: '0.95rem'
          }}>
            Your guide to talking directly to your computer with text commands
          </p>
        </div>

        {/* Sections */}
        {sections.map((section, idx) => (
          <div key={idx} style={{ marginBottom: '32px' }}>
            <h2 style={{
              fontSize: '1.3rem',
              color: '#f0c060',
              margin: '0 0 16px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span>{section.icon}</span>
              {section.title}
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
              {section.commands.map((cmd, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: '#0a0a0f',
                    border: '1px solid #333',
                    borderRadius: '4px',
                    padding: '12px',
                    borderLeft: '4px solid #d4a843'
                  }}
                >
                  <div style={{
                    fontFamily: '"JetBrains Mono", monospace',
                    color: '#4aff91',
                    fontSize: '0.9rem',
                    marginBottom: '6px',
                    wordBreak: 'break-word'
                  }}>
                    $ {cmd.cmd}
                  </div>
                  <div style={{
                    color: '#d4a843',
                    fontSize: '0.85rem',
                    marginBottom: '4px',
                    fontWeight: 'bold'
                  }}>
                    {cmd.name}
                  </div>
                  <div style={{
                    color: '#ccc',
                    fontSize: '0.85rem',
                    lineHeight: '1.5'
                  }}>
                    {cmd.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Footer */}
        <div style={{
          marginTop: '32px',
          paddingTop: '16px',
          borderTop: '1px solid #333',
          textAlign: 'center',
          color: '#666',
          fontSize: '0.85rem'
        }}>
          <p style={{ margin: '0' }}>
            💡 Tip: Use these commands during the game levels to solve puzzles and unlock Runic Fragments!
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

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fadeInBg {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
