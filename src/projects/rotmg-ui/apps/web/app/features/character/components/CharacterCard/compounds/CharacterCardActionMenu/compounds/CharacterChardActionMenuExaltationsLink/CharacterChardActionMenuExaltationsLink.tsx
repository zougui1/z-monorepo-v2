import { CharacterActionMenu, type ExaltationsLinkProps } from '~/features/character/components/CharacterActionMenu';

import { useCharacterCardContext } from '../../../../CharacterCardContext';

export const CharacterChardActionMenuExaltationsLink = (props: CharacterChardActionMenuExaltationsLinkProps) => {
  const [state] = useCharacterCardContext();

  return (
    <CharacterActionMenu.ExaltationsLink
      {...props}
      class={state.character.className}
    />
  );
}

export interface CharacterChardActionMenuExaltationsLinkProps extends Omit<ExaltationsLinkProps, 'class'> {

}
