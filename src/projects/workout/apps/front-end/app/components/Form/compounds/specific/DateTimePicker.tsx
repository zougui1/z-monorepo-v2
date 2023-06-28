import { DateTimePicker, type DateTimePickerProps } from '@mui/x-date-pickers';

import { DateField } from '../common';

export function FormDateTimePicker<TDate>({ name, label, ...fieldProps }: FormDateTimePickerProps<TDate>) {
  return (
    <DateField
      name={name}
      label={label}
      render={({ value, onChange, label, inputRef, renderField }) => (
        <DateTimePicker
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

export interface FormDateTimePickerProps<TDate> extends
  Omit<DateTimePickerProps<TDate>, 'onChange' | 'renderInput' | 'value'>,
  Partial<DateTimePickerProps<TDate>> {
  name: string;
};
