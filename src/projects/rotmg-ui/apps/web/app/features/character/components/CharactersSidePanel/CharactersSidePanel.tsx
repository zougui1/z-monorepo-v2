import type { Character } from '~/api/characters';

import { CharactersSidePanelContextProvider } from './CharactersSidePanelContext';

import { CharacterListSection } from './compounds/CharacterListSection';
import { PotionsSection } from './compounds/PotionsSection';
import { FiltersSection } from './compounds/FiltersSection';
import { SettingsSection } from './compounds/SettingsSection';

export const CharactersSidePanel = ({ children, characters }: CharactersSidePanelProps) => {
  return (
    <div
      className="bg-gray-700 px-4 flex flex-col gap-2 rounded-md *:py-2 divide-y divide-gray-600"
      style={{ minWidth: 350, maxWidth: 400 }}
    >
      <CharactersSidePanelContextProvider characters={characters}>
        {children}
      </CharactersSidePanelContextProvider>
    </div>
  );
}

export interface CharactersSidePanelProps {
  characters: Character[];
  children?: React.ReactNode;
}

CharactersSidePanel.CharacterListSection = CharacterListSection;
CharactersSidePanel.PotionsSection = PotionsSection;
CharactersSidePanel.FiltersSection = FiltersSection;
CharactersSidePanel.SettingsSection = SettingsSection;
