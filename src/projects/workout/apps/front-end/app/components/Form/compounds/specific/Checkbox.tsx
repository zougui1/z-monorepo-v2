import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  type CheckboxProps,
  type FormControlProps,
  type FormControlLabelProps,
  type FormHelperTextProps,
} from '@mui/material';

import { Field } from '../common';

export const FormCheckbox = (props: FormCheckboxProps) => {
  const {
    name,
    label,
    FormControlLabelProps,
    CheckboxProps,
    FormHelperTextProps,
    ...formControlProps
  } = props;

  return (
    <Field
      name={name}
      label={label}
      render={field => (
        <FormControl
          error={Boolean(field.errorMessage)}
          required={field.required}
          {...formControlProps}
        >
          <FormControlLabel
            {...field.register()}
            control={<Checkbox {...CheckboxProps} />}
            label={label || ''}
            {...FormControlLabelProps}
          />
          {field.errorMessage && (
            <FormHelperText {...FormHelperTextProps}>
              {FormHelperTextProps?.children ?? field.errorMessage}
            </FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
}

export interface FormCheckboxProps extends FormControlProps {
  name: string;
  label: string;
  CheckboxProps?: Partial<CheckboxProps> | undefined;
  FormHelperTextProps?: FormHelperTextProps | undefined;
  FormControlLabelProps?: Partial<FormControlLabelProps> | undefined;
}
