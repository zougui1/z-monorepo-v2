import { FormControl, FormHelperText } from '@mui/material';
import {
  Controller,
  type ControllerRenderProps,
  type FieldValues,
  type FieldPath,
  type ControllerFieldState,
  type UseFormStateReturn,
} from 'react-hook-form';

import { Field, type FieldProps, type FieldRenderData } from './Field';
import { useDateInput } from '../../hooks';

export const DateField = ({ name, label, render }: DateFieldProps) => {
  const dateInput = useDateInput();

  return (
    <Field
      name={name}
      label={label}
      render={field => (
        <FormControl error={Boolean(field.error)} required={field.required}>
          <Controller
            name={name}
            control={field.control}
            render={data => render({
              ...field,
              renderField: data.field,
              fieldState: data.fieldState,
              formState: data.formState,
              value: dateInput.getDate(data.field.value),
              onChange: dateInput.onChange(data.field.onChange),
              inputRef: dateInput.inputRef,
            })}
          />

          {field.errorMessage && <FormHelperText>{field.errorMessage}</FormHelperText>}
        </FormControl>
      )}
    />
  );
}

export interface DateFieldProps extends Omit<FieldProps, 'render'> {
  render: (data: DateFieldRenderData) => JSX.Element;
}

export interface DateFieldRenderData<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends Omit<FieldRenderData, 'value'> {
  value: unknown;
  onChange: (value: unknown) => void;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  renderField: ControllerRenderProps<TFieldValues, TName>;
  fieldState: ControllerFieldState;
  formState: UseFormStateReturn<TFieldValues>;
}
