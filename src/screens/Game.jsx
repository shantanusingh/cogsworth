import React, { useEffect, useRef, useState, useCallback } from 'react';
import Terminal from '../components/Terminal.jsx';
import ChatPanel from '../components/ChatPanel.jsx';
import ActivityPanel from '../components/ActivityPanel.jsx';
import StoryPanel from '../components/StoryPanel.jsx';
import FlagSubmit from '../components/FlagSubmit.jsx';
import NanoEditor from '../components/NanoEditor.jsx';
import AudioControls from '../components/AudioControls.jsx';
import CheatSheet from '../components/CheatSheet.jsx';
import { getLevelByNumber } from '../engine/levels.js';
import { createFilesystem, listFiles, readFile, writeFile, isEditableFile } from '../engine/filesystem.js';
import { handleCommand } from '../engine/commands.js';
import { advanceLevel, sendChatMessage, subscribeToChat, subscribeToTerminalActivity, broadcastTerminalOutput, subscribeToRoom } from '../lib/supabase.js';
import audioManager, { AMBIENT_CONFIGS } from '../components/AudioManager.jsx';

export default function Game({ room: initialRoom, player, onLevelComplete }) {
  const [room, setRoom] = useState(initialRoom);
  const level = getLevelByNumber(room.current_level || 1);
  const terminalRef = useRef(null);
  const fsRef = useRef(null);
  const envRef = useRef({});
  const [nanoOpen, setNanoOpen] = useState(false);
  const [nanoFilename, setNanoFilename] = useState('');
  const [messages, setMessages] = useState([]);
  const [activities, setActivities] = useState([]);
  const [flagSubmitLocked, setFlagSubmitLocked] = useState(false);
  const [cheatSheetOpen, setCheatSheetOpen] = useState(false);

  // Initialize filesystem and play ambient music
  useEffect(() => {
    fsRef.current = createFilesystem(level);
    envRef.current = { ...level.env };

    // Play Shadowland track for the current level
    const playAudio = async () => {
      try {
        await audioManager.playTrackForScene('level', room.current_level);
      } catch (error) {
        console.error('Failed to play level audio:', error);
      }
    };
    playAudio();

    return () => {
      // Optionally fade out on unmount
    };
  }, [level, room.current_level]);

  // Subscribe to room changes (for level advancement)
  useEffect(() => {
    const subscription = subscribeToRoom(room.id, (payload) => {
      if (payload.new) {
        setRoom(payload.new);
      }
    });

    return () => subscription.unsubscribe();
  }, [room.id]);

  // Subscribe to chat
  useEffect(() => {
    const subscription = subscribeToChat(room.id, (payload) => {
      setMessages(prev => [...prev, payload.new]);
    });

    return () => subscription.unsubscribe();
  }, [room.id]);

  // Subscribe to terminal activity
  useEffect(() => {
    const subscription = subscribeToTerminalActivity(room.id, (payload) => {
      if (payload.player_name !== player.username) {
        setActivities(prev => [...prev.slice(-99), payload]);
      }
    });

    return () => subscription.unsubscribe();
  }, [room.id, player.username]);

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

      // Broadcast terminal output to other players
      const textOutputs = result.filter(r => r.text);
      if (textOutputs.length > 0) {
        broadcastTerminalOutput(room.id, player.username, line, textOutputs).catch(() => {});
      }
    }
  };

  const handleNanoSave = useCallback((newContent) => {
    writeFile(fsRef.current, nanoFilename, newContent);
    setNanoOpen(false);
    terminalRef.current?.write(`[saved ${nanoFilename}]`, 'cyan');
    terminalRef.current?.writePrompt?.();
  }, [nanoFilename]);

  const handleFlagSubmit = useCallback(async (isCorrect) => {
    if (isCorrect) {
      audioManager.playSfx('success');
      terminalRef.current?.write('🎉 Correct flag!', 'success');
      try {
        await sendChatMessage(room.id, player.username, `✅ Solved Level ${level.id}!`, 'success');
        const nextLevel = level.id + 1;
        await advanceLevel(room.id, nextLevel);
        console.log('Flag correct, calling onLevelComplete with', nextLevel);
        onLevelComplete(nextLevel);
      } catch (error) {
        console.error('Error in handleFlagSubmit:', error);
        terminalRef.current?.write('⚠️ Error advancing level. Try again.', 'red');
      }
    } else {
      audioManager.playSfx('error');
      terminalRef.current?.write('❌ Incorrect flag. Try again.', 'red');
      await sendChatMessage(room.id, player.username, `⚠ Submitted an incorrect flag`, 'system');
      setFlagSubmitLocked(true);
      setTimeout(() => setFlagSubmitLocked(false), 10000);
    }
  }, [room.id, player.username, level.id, onLevelComplete]);

  const handleClueClick = useCallback(async (clueIdx) => {
    const clue = level.clues[clueIdx];
    audioManager.playSfx('clue');
    terminalRef.current?.write(`💡 Clue ${clueIdx + 1}: ${clue}`, 'amber');
    await sendChatMessage(room.id, player.username, `💡 Revealed Clue ${clueIdx + 1}`, 'system');
  }, [level.clues, room.id, player.username]);

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

        {/* Right side: Activity + Chat */}
        <div style={{ display: 'flex', flexDirection: 'column', width: '260px', borderLeft: '1px solid #d4a843', backgroundColor: '#0a0a0f', maxHeight: '100%', overflow: 'hidden' }}>
          <ActivityPanel activities={activities} />
          <ChatPanel roomId={room.id} username={player.username} messages={messages} />
        </div>
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
