import { DatePicker, type DatePickerProps } from '@mui/x-date-pickers';

import { DateField } from '../common';

export function FormDatePicker<TDate>({ name, label, ...fieldProps }: FormDatePickerProps<TDate>) {
  return (
    <DateField
      name={name}
      label={label}
      render={({ value, onChange, label, inputRef, renderField }) => (
        <DatePicker
          {...renderField}
          value={value as TDate | null}
          onChange={onChange}
          {...fieldProps}
          label={label}
          inputRef={inputRef}
        />
      )}
    />
  );
}

export interface FormDatePickerProps<TDate> extends
  Omit<DatePickerProps<TDate>, 'onChange' | 'renderInput' | 'value'>,
  Partial<DatePickerProps<TDate>> {
  name: string;
};
