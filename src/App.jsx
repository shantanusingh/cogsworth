import React, { useState } from 'react';
import Landing from './screens/Landing.jsx';
import Setup from './screens/Setup.jsx';
import Lobby from './screens/Lobby.jsx';
import Game from './screens/Game.jsx';
import Cutscene from './screens/Cutscene.jsx';
import Victory from './screens/Victory.jsx';
import { INTRO_CUTSCENE, getLevelByNumber } from './engine/levels.js';

export default function App() {
  const [screen, setScreen] = useState('landing');
  const [isCreating, setIsCreating] = useState(false);
  const [room, setRoom] = useState(null);
  const [player, setPlayer] = useState(null);
  const [username, setUsername] = useState('');
  const [cutsceneContent, setCutsceneContent] = useState(null);

  const handleCreateRoom = () => {
    setIsCreating(true);
    setScreen('setup');
  };

  const handleJoinRoom = () => {
    setIsCreating(false);
    setScreen('setup');
  };

  const handleSetupComplete = ({ room: newRoom, player: newPlayer, username: uname }) => {
    setRoom(newRoom);
    setPlayer(newPlayer);
    setUsername(uname);
    setScreen('lobby');
  };

  const handleGameStart = () => {
    setCutsceneContent(INTRO_CUTSCENE);
    setScreen('cutscene');
  };

  const handleCutsceneComplete = () => {
    setScreen('game');
  };

  const handleLevelComplete = () => {
    // Check if there's a next level or if game is complete
    const currentLevel = getLevelByNumber(room.current_level);

    if (currentLevel && currentLevel.id === 3) {
      // Last level (MVP has 3 levels)
      setScreen('victory');
    } else if (currentLevel && currentLevel.cutsceneAfter) {
      // Show cutscene between levels
      setCutsceneContent(currentLevel.cutsceneAfter);
      setScreen('cutscene');
    } else {
      // Shouldn't reach here in MVP, but fallback to victory
      setScreen('victory');
    }
  };

  const handlePlayAgain = () => {
    setScreen('landing');
    setRoom(null);
    setPlayer(null);
    setUsername('');
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {screen === 'landing' && (
        <Landing
          onCreateRoom={handleCreateRoom}
          onJoinRoom={handleJoinRoom}
        />
      )}

      {screen === 'setup' && (
        <Setup
          isCreating={isCreating}
          onComplete={handleSetupComplete}
        />
      )}

      {screen === 'lobby' && room && player && (
        <Lobby
          room={room}
          player={player}
          onGameStart={handleGameStart}
        />
      )}

      {screen === 'cutscene' && cutsceneContent && (
        <Cutscene
          content={cutsceneContent}
          onComplete={handleCutsceneComplete}
        />
      )}

      {screen === 'game' && room && player && (
        <Game
          room={room}
          player={player}
          onLevelComplete={handleLevelComplete}
        />
      )}

      {screen === 'victory' && (
        <Victory onPlayAgain={handlePlayAgain} />
      )}
    </div>
  );
}
