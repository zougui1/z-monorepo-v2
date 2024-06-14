import React, { useState, useRef } from 'react';
import { isNumber } from 'radash';
import { InputAdornment } from '@mui/material';

import { useForkRef } from '~/hooks';

import { TooltipTextField, type TooltipTextFieldProps } from '../TooltipTextField';
import { NumberInputArrows, type NumberInputArrowsProps } from '../NumberInputArrows';

const getErrorProps = (invalidNumberErrorAsTooltip?: boolean): TooltipTextFieldProps => {
  const errorMessage = 'Invalid number';

  if (invalidNumberErrorAsTooltip) {
    return { tooltipError: errorMessage };
  }

  return { error: errorMessage };
}

export const NumberInput = (props: NumberInputProps) => {
  const {
    defaultValue,
    invalidNumberErrorAsTooltip,
    onChange,
    inputRef,
    InputProps,
    onUpArrow,
    onDownArrow,
    disabledUpArrow,
    disabledDownArrow,
    ...rest
  } = props;
  const internalInputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const [value, setValue] = useState<string | null>(defaultValue ? String(defaultValue) : null);

  const actualInputRef = useForkRef(internalInputRef, inputRef);
  const isValueValidNumber = isNumber(Number(value));
  const errorProps = isValueValidNumber
    ? {}
    : getErrorProps(invalidNumberErrorAsTooltip);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValue(event.currentTarget.value);
    onChange?.(event);
  }

  const handleArrow = (getNewValue: (num: number) => number, upperHandler?: React.MouseEventHandler) => {
    return (event: React.MouseEvent) => {
      upperHandler?.(event);

      if (!event.defaultPrevented && internalInputRef.current) {
        const value = Number(internalInputRef.current.value);

        if (isNumber(value)) {
          internalInputRef.current.value = String(getNewValue(value));
          internalInputRef.current.form?.requestSubmit();
        }
      }
    }
  }

  return (
    <TooltipTextField
      {...rest}
      {...errorProps}
      defaultValue={defaultValue}
      onChange={handleChange}
      inputRef={actualInputRef}
      InputProps={{
        ...InputProps,
        endAdornment: (
          <InputAdornment position="end">
            <NumberInputArrows
              onUp={handleArrow(num => num + 1, onUpArrow)}
              onDown={handleArrow(num => num - 1, onDownArrow)}
              disabledUp={!isValueValidNumber || disabledUpArrow}
              disabledDown={!isValueValidNumber || disabledDownArrow}
            />
          </InputAdornment>
        ),
      }}
    />
  );
}

export type NumberInputProps = {
  invalidNumberErrorAsTooltip?: boolean;
  InputProps?: Omit<TooltipTextFieldProps['InputProps'], 'endAdornment'>;
  onUpArrow?: React.MouseEventHandler;
  onDownArrow?: React.MouseEventHandler;
  disabledUpArrow?: boolean;
  disabledDownArrow?: boolean;
} & Omit<TooltipTextFieldProps, 'number' | 'InputProps'>;
