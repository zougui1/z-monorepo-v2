import { CharacterActionMenu, type AddLabelProps } from '~/features/character/components/CharacterActionMenu';
import { forkEventHandler } from '~/utils/dom';

import { useCharacterCardContext } from '../../../../CharacterCardContext';

export const CharacterChardActionMenuAddLabel = (props: CharacterChardActionMenuAddLabelProps) => {
  const { onClick, disabled, ...rest } = props;

  const [state, setState] = useCharacterCardContext();

  const handleClick = forkEventHandler(onClick, () => {
    setState(currentState => ({
      ...currentState,
      isFooterVisible: true,
    }));
  });

  return (
    <CharacterActionMenu.AddLabel
      {...rest}
      onClick={handleClick}
      disabled={disabled || state.disabled || state.isFooterVisible}
    />
  );
}

export interface CharacterChardActionMenuAddLabelProps extends AddLabelProps {

}
