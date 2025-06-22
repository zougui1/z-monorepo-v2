import { TextField, InputAdornment, type BaseTextFieldProps } from '@mui/material';
import { isNumber } from 'radash';
import clsx from 'clsx'

import { getIsScientificNumber } from '~/utils/number';

import './ResourceInput.css';

export function ResourceInput({ defaultValue, helperText, value, icon, endAdornment, onChange, error, className, readOnly, ...rest }: ResourceInputProps) {
  const valueToValidate = value ?? defaultValue;
  const valueIsNumber = isNumber(Number(valueToValidate)) || getIsScientificNumber(String(valueToValidate));

  return (
    <TextField
      {...rest}
      defaultValue={defaultValue}
      value={value}
      onChange={onChange}
      className={clsx('resource-input', className)}
      error={Boolean(error) || !valueIsNumber}
      helperText={helperText || error || (!valueIsNumber && 'Invalid number')}
      FormHelperTextProps={{ className: '!mx-1 !text-center' }}
      InputProps={{
        readOnly,
        startAdornment: icon && (
          <InputAdornment position="start" className="w-16">
            {icon}
          </InputAdornment>
        ),
        endAdornment: endAdornment && (
          <InputAdornment position="end">
            {endAdornment}
          </InputAdornment>
        ),
      }}
    />
  );
}

export interface ResourceInputProps {
  inputRef?: React.Ref<HTMLInputElement>;
  label?: string;
  defaultValue?: number | string;
  value?: number | string;
  icon?: React.ReactNode;
  endAdornment?: React.ReactNode;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  name?: string;
  error?: string;
  className?: string;
  type?: BaseTextFieldProps['type'];
  disabled?: boolean;
  readOnly?: boolean;
  helperText?: React.ReactNode;
}
