import { TimePicker, type TimePickerProps } from '@mui/x-date-pickers';

import { DateField } from '../common';

export function FormTimePicker<TDate>({ name, label, ...fieldProps }: FormTimePickerProps<TDate>) {
  return (
    <DateField
      name={name}
      label={label}
      render={({ value, onChange, label, inputRef, renderField }) => (
        <TimePicker
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

export interface FormTimePickerProps<TDate> extends
  Omit<TimePickerProps<TDate>, 'onChange' | 'renderInput' | 'value'>,
  Partial<TimePickerProps<TDate>> {
  name: string;
};
