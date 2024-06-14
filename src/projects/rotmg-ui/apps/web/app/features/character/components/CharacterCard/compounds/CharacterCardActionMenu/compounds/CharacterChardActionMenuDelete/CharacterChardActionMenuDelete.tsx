import { CharacterActionMenu, type DeleteProps } from '~/features/character/components/CharacterActionMenu';

import { useCharacterCardContext } from '../../../../CharacterCardContext';

export const CharacterChardActionMenuDelete = ({ disabled, ...rest }: CharacterChardActionMenuDeleteProps) => {
  const [state] = useCharacterCardContext();

  return (
    <CharacterActionMenu.Delete
      {...rest}
      disabled={disabled || state.disabled}
    />
  );
}

export interface CharacterChardActionMenuDeleteProps extends DeleteProps {

}
