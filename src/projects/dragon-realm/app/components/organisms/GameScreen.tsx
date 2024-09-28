import { useEffect } from 'react';

import { useGame, useGameState } from '~/contexts';

import { GameCivilizationScreen } from './GameCivilizationScreen';
import { GameWildernessScreen } from './GameWildernessScreen';
import { GameFightScreen } from './GameFightScreen';

export const GameScreen = () => {
  const game = useGame();
  // make sure the component is re-rendered when the state of the game changes
  useGameState();

  useEffect(() => {
    game.play();
  }, [game]);

  if (game.currentFight) {
    return <GameFightScreen />;
  }

  if (game.currentBuilding) {
    return <GameCivilizationScreen />;
  }

  if (game.currentLocation) {
    return <GameCivilizationScreen />;
  }

  return <GameWildernessScreen />;
}
