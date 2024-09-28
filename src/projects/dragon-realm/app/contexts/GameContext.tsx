import { createContext, useContext, useMemo, useState, useEffect } from 'react';

import { Game } from '~/game/Game';
import type { GameDialogData, GameMenu, GameEventMap } from '~/game';
import type { SaveData, VectorArray } from '~/types';
import type { Fight, FightEventMap } from '~/game/fight';

const GameContext = createContext<Game | undefined>(undefined);

export const GameProvider = ({ save, children }: GameProviderProps) => {
  const game = useMemo(() => {
    return new Game(save);
  }, [save]);

  return (
    <GameContext.Provider value={game}>
      {children}
    </GameContext.Provider>
  );
}

export interface GameProviderProps {
  save: SaveData;
  children?: React.ReactNode;
}

export const useGame = (): Game => {
  const game = useContext(GameContext);

  if (!game) {
    throw new Error('Cannot use game outside of GameContext');
  }

  return game;
}

export const useGameEvent = <K extends keyof GameEventMap>(
  eventName: K,
  listener: (event: GameEventMap[K]) => void,
  dependencies: React.DependencyList = [],
): void => {
  const game = useGame();

  useEffect(() => {
    game.on(eventName, listener);

    return () => {
      game.off(eventName, listener);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventName, game, ...dependencies]);
}

export const useGameMenu = (): GameMenu | undefined => {
  const game = useGame();
  const [menu, setMenu] = useState(game.currentMenu);

  useGameEvent('menu', setMenu);

  return menu;
}

export const useGameDialog = (): GameDialogData | undefined => {
  const game = useGame();
  const [dialog, setDialog] = useState(game.currentDialog);

  useGameEvent('dialog', setDialog);

  return dialog;
}

export const useGameState = (): void => {
  const [, forceUpdate] = useState({});

  useGameEvent('stateChange', () => forceUpdate({}));
}

export const useGamePosition = (): [VectorArray, React.Dispatch<React.SetStateAction<VectorArray>>] => {
  const game = useGame();
  const [position, setPosition] = useState<VectorArray>([game.x, game.y, game.z]);

  useGameEvent('positionChange', setPosition);

  return [position, setPosition];
}

export const useGameFight = (): Fight => {
  const game = useGame();
  // makes sure the hooks gets updated when fight changes
  useGameState();

  if(!game.currentFight) {
    throw new Error('There is no fight');
  }

  return game.currentFight;
}

export const useGameFightEvent = <K extends keyof FightEventMap>(
  eventName: K,
  listener: (event: FightEventMap[K]) => void,
  dependencies: React.DependencyList = [],
): void => {
  const fight = useGameFight();

  useEffect(() => {
    fight.on(eventName, listener);

    return () => {
      fight.off(eventName, listener);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventName, fight, ...dependencies]);
}

export const useGameFightState = () => {
  const [, forceUpdate] = useState({});

  useGameFightEvent('stateChange', () => forceUpdate({}));
}
