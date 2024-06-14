import { useCharacterCardContext } from '../../CharacterCardContext';
import { EditablePotions, type EditablePotionsProps } from '../../../EditablePotions';

export const CharacterCardPotions = ({ disabled, ...rest }: CharacterCardPotionsProps) => {
  const [state] = useCharacterCardContext();

  return (
    <EditablePotions
      {...rest}
      potions={state.character.potionsRemaining}
      disabled={disabled || state.disabled}
    />
  );
}

type PublicEditablePotionsProps = Omit<
  EditablePotionsProps,
  'potions'
>;

export interface CharacterCardPotionsProps extends PublicEditablePotionsProps {

}
