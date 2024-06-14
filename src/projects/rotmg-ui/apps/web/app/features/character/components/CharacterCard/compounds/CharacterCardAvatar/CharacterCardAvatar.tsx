import { useCharacterCardContext } from '../../CharacterCardContext';
import { CharacterAvatar, type CharacterAvatarProps } from '../../../CharacterAvatar';

export const CharacterCardAvatar = ({ disabled, ...rest }: CharacterCardAvatarProps) => {
  const [state] = useCharacterCardContext();

  return (
    <CharacterAvatar
      {...rest}
      class={state.character.className}
      isSeasonal={state.character.isSeasonal}
      title={state.character.title}
      stars={state.stars}
      disabled={disabled || state.disabled}
    />
  );
}

type PublicCharacterAvatarProps = Omit<
  CharacterAvatarProps,
  'class' | 'isSeasonal' | 'title' | 'stars'
>;

export interface CharacterCardAvatarProps extends PublicCharacterAvatarProps {

}
