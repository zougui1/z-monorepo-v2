import { Checkbox, type CheckboxProps } from '@mui/material';

import { useCharacterCardContext } from '../../CharacterCardContext';

export const CharacterCardInclusionCheckbox = ({ disabled, onChange, ...rest }: CharacterCardInclusionCheckboxProps) => {
  const [state] = useCharacterCardContext();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    event.stopPropagation();
    onChange?.(event, checked);
  };

  return (
    <Checkbox
      {...rest}
      disabled={disabled || state.disabled}
      onChange={handleChange}
    />
  );
}

export interface CharacterCardInclusionCheckboxProps extends CheckboxProps {

}
