import { CharacterActionMenu, type CopyPotionsProps } from '~/features/character/components/CharacterActionMenu';

import { useCharacterCardContext } from '../../../../CharacterCardContext';

export const CharacterChardActionMenuCopyPotions = (props: CharacterChardActionMenuCopyPotionsProps) => {
  const [state] = useCharacterCardContext();

  return (
    <CharacterActionMenu.CopyPotions
      {...props}
      potions={state.character.potionsRemaining}
    />
  );
}

export interface CharacterChardActionMenuCopyPotionsProps extends Omit<CopyPotionsProps, 'potions'> {

}
