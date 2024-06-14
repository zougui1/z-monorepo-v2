import { createContext, useState, useContext, useMemo } from 'react';

import type { Character } from '~/api/characters';

export interface CharacterCardContextStateValue {
  isFooterVisible: boolean;
  disabled: boolean;
  character: Character;
  stars: number;
}

export interface CharacterCardContextInternalState {
  isFooterVisible: boolean;
}

export type CharacterCardContextState = [
  state: CharacterCardContextStateValue,
  setState: React.Dispatch<React.SetStateAction<CharacterCardContextInternalState>>,
];

export const CharacterCardContext = createContext<CharacterCardContextState | undefined>(undefined);

export const useCharacterCardContext = (): CharacterCardContextState => {
  const context = useContext(CharacterCardContext);

  if (!context) {
    throw new Error('Cannot use a CharacterCard sub-component outside of <CharacterChard>');
  }

  return context;
}

export const CharacterCardContextProvider = (props: CharacterCardContextProps) => {
  const { children, character, stars, disabled } = props;

  const [internalState, setInternalState] = useState<CharacterCardContextInternalState>({
    isFooterVisible: false,
  });

  const state = useMemo(() => {
    const publicState: CharacterCardContextStateValue = {
      ...internalState,
      character,
      stars,
      disabled,
    };

    return [publicState, setInternalState] satisfies CharacterCardContextState;
  }, [internalState, character, stars, disabled]);

  return (
    <CharacterCardContext.Provider value={state}>
      {children}
    </CharacterCardContext.Provider>
  );
}

export interface CharacterCardContextProps {
  character: Character;
  disabled: boolean;
  stars: number;
  children?: React.ReactNode;
}
