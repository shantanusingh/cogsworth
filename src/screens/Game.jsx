import React, { useEffect, useRef, useState } from 'react';
import Terminal from '../components/Terminal.jsx';
import ChatPanel from '../components/ChatPanel.jsx';
import StoryPanel from '../components/StoryPanel.jsx';
import FlagSubmit from '../components/FlagSubmit.jsx';
import NanoEditor from '../components/NanoEditor.jsx';
import AudioControls from '../components/AudioControls.jsx';
import CheatSheet from '../components/CheatSheet.jsx';
import { getLevelByNumber } from '../engine/levels.js';
import { createFilesystem, listFiles, readFile, writeFile, isEditableFile } from '../engine/filesystem.js';
import { handleCommand } from '../engine/commands.js';
import { advanceLevel, sendChatMessage, subscribeToChat } from '../lib/supabase.js';
import audioManager, { AMBIENT_CONFIGS } from '../components/AudioManager.jsx';

export default function Game({ room, player, onLevelComplete }) {
  const level = getLevelByNumber(room.current_level || 1);
  const terminalRef = useRef(null);
  const fsRef = useRef(null);
  const envRef = useRef({});
  const [nanoOpen, setNanoOpen] = useState(false);
  const [nanoFilename, setNanoFilename] = useState('');
  const [messages, setMessages] = useState([]);
  const [flagSubmitLocked, setFlagSubmitLocked] = useState(false);
  const [cheatSheetOpen, setCheatSheetOpen] = useState(false);

  // Initialize filesystem and play ambient music
  useEffect(() => {
    if (!fsRef.current) {
      fsRef.current = createFilesystem(level);
    }

    // Play Shadowland track for the current level
    audioManager.playTrackForScene('level', room.current_level);

    return () => {
      // Optionally fade out on unmount
    };
  }, [level, room.current_level]);

  // Subscribe to chat
  useEffect(() => {
    const subscription = subscribeToChat(room.id, (payload) => {
      setMessages(prev => [...prev, payload.new]);
    });

    return () => subscription.unsubscribe();
  }, [room.id]);

  const handleCommand_ = async (line) => {
    const context = {
      fs: fsRef.current,
      env: envRef.current,
      username: player.username,
      unlockedCommands: level.unlockedCommands,
      level
    };

    const result = await handleCommand(line, context);

    // Process result
    if (Array.isArray(result)) {
      result.forEach(item => {
        if (item.type === 'clear') {
          terminalRef.current?.clear();
        } else if (item.type === 'nano') {
          setNanoFilename(item.filename);
          setNanoOpen(true);
        } else {
          terminalRef.current?.write(item.text, item.color);
        }
      });
    }
  };

  const handleNanoSave = (newContent) => {
    writeFile(fsRef.current, nanoFilename, newContent);
    setNanoOpen(false);
    terminalRef.current?.write(`[saved ${nanoFilename}]`, 'cyan');
    terminalRef.current?.writePrompt?.();
  };

  const handleFlagSubmit = async (isCorrect) => {
    if (isCorrect) {
      audioManager.playSfx('success');
      terminalRef.current?.write('🎉 Correct flag!', 'success');
      await sendChatMessage(room.id, player.username, `✅ Solved Level ${level.id}!`, 'success');
      await advanceLevel(room.id, level.id + 1);
      onLevelComplete();
    } else {
      audioManager.playSfx('error');
      terminalRef.current?.write('❌ Incorrect flag. Try again.', 'red');
      await sendChatMessage(room.id, player.username, `⚠ Submitted an incorrect flag`, 'system');
      setFlagSubmitLocked(true);
      setTimeout(() => setFlagSubmitLocked(false), 10000);
    }
  };

  const handleClueClick = async (clueIdx) => {
    const clue = level.clues[clueIdx];
    audioManager.playSfx('clue');
    terminalRef.current?.write(`💡 Clue ${clueIdx + 1}: ${clue}`, 'amber');
    await sendChatMessage(room.id, player.username, `💡 Revealed Clue ${clueIdx + 1}`, 'system');
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#0a0a0f'
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid #d4a843',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#1a1a22'
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>COGSWORTH ACADEMY</h2>
          <p style={{ margin: '4px 0', fontSize: '12px', color: '#999' }}>
            {level.name}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {Array(8).fill(null).map((_, i) => (
              <div
                key={i}
                title={`Level ${i + 1}`}
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: i < room.current_level ? '#4aff91' : i === room.current_level - 1 ? '#d4a843' : '#333'
                }}
              />
            ))}
          </div>

          <button
            onClick={() => setCheatSheetOpen(true)}
            title="Open Linux Command Cheat Sheet"
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              backgroundColor: 'transparent',
              border: '1px solid #d4a843',
              color: '#d4a843',
              cursor: 'pointer',
              borderRadius: '2px',
              fontFamily: '"JetBrains Mono", monospace',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#d4a84322';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            📖 Cheat Sheet
          </button>

          <AudioControls />
        </div>
      </div>

      {/* Main content */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left side: Story + Terminal */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <StoryPanel level={level} />

          <div style={{ flex: 1, overflow: 'hidden' }}>
            <Terminal ref={terminalRef} username={player.username} onCommand={handleCommand_} />
          </div>
        </div>

        {/* Right side: Chat */}
        <ChatPanel roomId={room.id} username={player.username} messages={messages} />
      </div>

      {/* Footer: Clues + Flag */}
      <FlagSubmit
        level={level}
        onSubmit={handleFlagSubmit}
        disabled={flagSubmitLocked}
        onClueClick={handleClueClick}
      />

      {/* Cheat Sheet Modal */}
      <CheatSheet isOpen={cheatSheetOpen} onClose={() => setCheatSheetOpen(false)} />

      {/* Nano editor overlay */}
      {nanoOpen && (
        <NanoEditor
          filename={nanoFilename}
          content={readFile(fsRef.current, nanoFilename) || ''}
          onSave={handleNanoSave}
          onClose={() => setNanoOpen(false)}
        />
      )}
    </div>
  );
}
