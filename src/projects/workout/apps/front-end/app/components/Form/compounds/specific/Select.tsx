import { TextField, MenuItem, type TextFieldProps } from '@mui/material';
import { Controller } from 'react-hook-form';

import type { ZodDef } from '~/utils';
import type { EnumZodDef, NativeEnumZodDef } from '~/utils/zod/def/parsers';

import { useField } from '../../useField';

const enumLikeTypes = ['enum', 'nativeEnum'];

const isEnumLikeDef = (def: ZodDef): def is EnumZodDef | NativeEnumZodDef => {
  return enumLikeTypes.includes(def.type);
}

const getEnumDef = (def: ZodDef): EnumZodDef | NativeEnumZodDef | undefined => {
  if (isEnumLikeDef(def)) {
    return def;
  }

  if (def.type === 'array' && isEnumLikeDef(def.items)) {
    return def.items;
  }
}

export const FormSelect = ({ name, label, children, ...fieldProps }: FormSelectProps) => {
  const field = useField({ name, label });

  if (!field) {
    return null;
  }

  const enumDef = getEnumDef(field.def);

  if (!enumDef) {
    return null;
  }

  return (
    <Controller
      name={name}
      control={field.control}
      render={({ field: renderField }) => (
        <TextField
          {...renderField}
          error={Boolean(field.errorMessage)}
          helperText={field.errorMessage}
          select
          {...fieldProps}
          SelectProps={{
            multiple: field.def.type === 'array',
            ...fieldProps.SelectProps,
          }}
          label={field.label}
        >
          {children || enumDef.values.map(value => (
            <MenuItem key={value} value={value}>{value}</MenuItem>
          ))}
        </TextField>
      )}
    />
  );
}

// name is required
export type FormSelectProps = TextFieldProps & { name: string; };
