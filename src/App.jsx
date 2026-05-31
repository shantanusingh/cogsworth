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

  const handleLevelComplete = (nextLevel) => {
    console.log('handleLevelComplete called with nextLevel:', nextLevel);
    // nextLevel is the level number we just advanced to
    if (nextLevel > 8) {
      // All 8 chambers complete!
      console.log('All levels complete, showing victory screen');
      setScreen('victory');
    } else {
      // Update room state with new level
      setRoom(prev => ({ ...prev, current_level: nextLevel }));
      // Get the cutscene for the level we just completed
      const completedLevel = getLevelByNumber(nextLevel - 1);
      console.log('Looking for cutscene after level', nextLevel - 1, 'found:', !!completedLevel?.cutsceneAfter);
      if (completedLevel && completedLevel.cutsceneAfter) {
        // Show cutscene between levels
        console.log('Setting cutscene content and screen to cutscene');
        setCutsceneContent(completedLevel.cutsceneAfter);
        setScreen('cutscene');
      } else {
        // No cutscene, go directly to next level
        console.log('No cutscene found, going directly to game');
        setScreen('game');
      }
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
