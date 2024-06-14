import React, { useState, useRef } from 'react';
import { isNumber } from 'radash';
import { InputAdornment } from '@mui/material';

import { useForkRef } from '~/hooks';
import { clamp } from '~/utils/number';

import { TooltipTextField, type TooltipTextFieldProps } from '../TooltipTextField';
import { NumberInputArrows } from '../NumberInputArrows';

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
    onBlur,
    onKeyDown,
    inputRef,
    InputProps,
    inputProps,
    onUpArrow,
    onDownArrow,
    disabled,
    disabledUpArrow,
    disabledDownArrow,
    min = -Infinity,
    max = Infinity,
    ...rest
  } = props;
  const internalInputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const [value, setValue] = useState<string | null>(defaultValue ? String(defaultValue) : null);

  const valueNumber = Number(value);
  const actualInputRef = useForkRef(internalInputRef, inputRef);
  const isValueValidNumber = isNumber(Number(value));
  const errorProps = isValueValidNumber
    ? {}
    : getErrorProps(invalidNumberErrorAsTooltip);
  const isValueAboveMin = valueNumber > min;
  const isValueBelowMax = valueNumber < max;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValue(event.currentTarget.value);
    onChange?.(event);
  }

  const handleBlur = (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = Number(event.currentTarget.value);

    if (isNumber(value) && internalInputRef.current) {
      internalInputRef.current.value = String(clamp(value, min, max));
    }

    onBlur?.(event);
  }

  const handleArrow = (getNewValue: (num: number) => number, upperHandler?: React.UIEventHandler) => {
    return (event: React.UIEvent) => {
      upperHandler?.(event);

      if (!event.defaultPrevented && internalInputRef.current) {
        const value = Number(internalInputRef.current.value);

        if (isNumber(value)) {
          internalInputRef.current.value = String(getNewValue(value));
          internalInputRef.current.form?.requestSubmit();
          setValue(internalInputRef.current.value);
        }
      }
    }
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowUp') {
      handleArrow(value => value + 1, onKeyDown)(event);
      event.preventDefault();
    } else if (event.key === 'ArrowDown') {
      handleArrow(value => value - 1, onKeyDown)(event);
      event.preventDefault();
    }
  }

  const handleInputClick = (event: React.MouseEvent<HTMLInputElement>) => {
    if (Number(event.currentTarget.value) === 0) {
      event.currentTarget.select();
    }

    inputProps?.onClick?.(event);
  }

  return (
    <TooltipTextField
      {...rest}
      {...errorProps}
      disabled={disabled}
      defaultValue={defaultValue}
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyDown={handleKeyPress}
      inputRef={actualInputRef}
      InputProps={{
        ...InputProps,
        endAdornment: (
          <InputAdornment position="end">
            <NumberInputArrows
              onUp={handleArrow(num => num + 1, onUpArrow)}
              onDown={handleArrow(num => num - 1, onDownArrow)}
              disabledUp={disabled || !isValueValidNumber || !isValueBelowMax || disabledUpArrow}
              disabledDown={disabled || !isValueValidNumber || !isValueAboveMin || disabledDownArrow}
            />
          </InputAdornment>
        ),
      }}
      inputProps={{
        ...inputProps,
        onClick: handleInputClick,
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
  min?: number;
  max?: number;
} & Omit<TooltipTextFieldProps, 'number' | 'InputProps'>;
