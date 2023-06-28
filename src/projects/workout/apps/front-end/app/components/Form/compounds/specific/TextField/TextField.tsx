import { TextField, type TextFieldProps } from '@mui/material';

import { Field } from '../../common/Field';
import { getFieldType } from '../../../utils';

export const FormTextField = ({ name, label, ...fieldProps }: FormTextFieldProps) => {
  return (
    <Field
      name={name}
      label={label}
      render={field => (
        <TextField
          {...field.register()}
          required={field.required}
          error={Boolean(field.errorMessage)}
          helperText={field.errorMessage}
          type={getFieldType(field.def)}
          {...fieldProps}
          label={label}
        />
      )}
    />
  );
}

// name is required
export type FormTextFieldProps = TextFieldProps & { name: string; };
