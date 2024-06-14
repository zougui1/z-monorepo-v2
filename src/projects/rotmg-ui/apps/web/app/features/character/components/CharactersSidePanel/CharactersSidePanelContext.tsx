import { createContext, useContext, useMemo } from 'react';

import type { Character } from '~/api/characters';

export interface CharactersSidePanelContextState {
  characters: Character[];
}

export const CharactersSidePanelContext = createContext<CharactersSidePanelContextState | undefined>(undefined);

export const useCharactersSidePanelContext = (): CharactersSidePanelContextState => {
  const context = useContext(CharactersSidePanelContext);

  if (!context) {
    throw new Error('Cannot use a CharactersSidePanel sub-component outside of <CharactersSidePanel>');
  }

  return context;
}

export const CharactersSidePanelContextProvider = (props: CharactersSidePanelContextProps) => {
  const { children, characters } = props;

  const state = useMemo(() => {
    const state: CharactersSidePanelContextState = {
      characters,
    };

    return state;
  }, [characters]);

  return (
    <CharactersSidePanelContext.Provider value={state}>
      {children}
    </CharactersSidePanelContext.Provider>
  );
}

export interface CharactersSidePanelContextProps {
  characters: Character[];
  children?: React.ReactNode;
}
