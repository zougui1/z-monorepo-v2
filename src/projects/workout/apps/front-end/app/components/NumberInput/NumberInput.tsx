import { TextField, type TextFieldProps } from '@mui/material';

import { clamp } from '@zougui/common.math-utils';

export const NumberInput = ({ min, max, onChange, inputProps, ...rest }: NumberInputProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const value = clamp(
      Number(event.currentTarget.value),
      min ?? Number.MIN_SAFE_INTEGER,
      max ?? Number.MAX_SAFE_INTEGER,
    );

    onChange?.(event, value);
  }

  return (
    <TextField
      type="number"
      {...rest}
      onChange={handleChange}
      inputProps={{ ...inputProps, min, max }}
    />
  );
}

export type NumberInputProps = Omit<TextFieldProps, 'onChange'> & {
  min?: number | undefined;
  max?: number | undefined;
  onChange?: ((event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, value: number) => void) | undefined;
}
