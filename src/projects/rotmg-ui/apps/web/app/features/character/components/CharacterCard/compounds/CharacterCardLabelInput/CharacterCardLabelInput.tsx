import { useRef } from 'react';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

import { useCharacterCardContext } from '../../CharacterCardContext';

export const CharacterCardLabelInput = ({ disabled, withClearIcon }: CharacterCardLabelInputProps) => {
  const labelInputRef = useRef<HTMLInputElement | null>(null);
  const [state, setState] = useCharacterCardContext();

  const handleDeleteLabel = () => {
    if (labelInputRef.current) {
      labelInputRef.current.value = '';
      labelInputRef.current?.form?.requestSubmit();
      setState(currentState => ({
        ...currentState,
        isFooterVisible: false,
      }));
    }
  }

  return (
    <TextField
      inputRef={labelInputRef}
      name="label"
      label="Label"
      defaultValue={state.character.label}
      disabled={disabled}
      className="text-lg"
      InputProps={{
        endAdornment: withClearIcon && (
          <InputAdornment position="end">
            <IconButton onClick={handleDeleteLabel} disabled={disabled}>
              <CloseIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}

export interface CharacterCardLabelInputProps {
  disabled?: boolean;
  withClearIcon?: boolean;
}
