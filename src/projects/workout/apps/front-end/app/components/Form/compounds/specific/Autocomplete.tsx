import {
  Autocomplete,
  TextField,
  FormControl,
  type AutocompleteProps,
  type TextFieldProps,
  type FormControlProps,
} from '@mui/material';
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

export function FormAutocomplete<
  T extends string,
  Multiple extends boolean | undefined = false,
  DisableClearable extends boolean | undefined = false,
  FreeSolo extends boolean | undefined = false
  >(props: FormAutocompleteProps<T, Multiple, DisableClearable, FreeSolo>) {
  const {
    name,
    label,
    AutocompleteProps,
    TextFieldProps,
    ...formControlProps
  } = props;

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
      render={({ field: renderField, fieldState }) => (
        <FormControl {...formControlProps}>
          <Autocomplete
            {...renderField}
            onChange={(e, v) => renderField.onChange({
              ...e,
              target: {
                ...e.target,
                value: v
              }
            })}
            options={enumDef.values.map(v => String(v)) as any as readonly T[]}
            renderInput={params => (
              <TextField
                {...params}
                required={field.required}
                label={label}
                error={fieldState.invalid}
                helperText={fieldState.error?.message}
                {...TextFieldProps}
              />
            )}
            {...AutocompleteProps}
          />
        </FormControl>
      )}
    />
  );
}

// name is required
/*export type FormAutocompleteProps<
T,
Multiple extends boolean | undefined,
DisableClearable extends boolean | undefined,
FreeSolo extends boolean | undefined,
ChipComponent extends React.ElementType<any> = "div"
> = Partial<AutocompleteProps<T, Multiple, DisableClearable, FreeSolo, ChipComponent>> & {
  name: string;
  label: string;
  TextFieldProps?: Partial<TextFieldProps> | undefined;
};*/

export interface FormAutocompleteProps<
  T,
  Multiple extends boolean | undefined,
  DisableClearable extends boolean | undefined,
  FreeSolo extends boolean | undefined,
  ChipComponent extends React.ElementType<any> = "div"
> extends FormControlProps {
  name: string;
  label: string;
  options?: Partial<AutocompleteProps<T, Multiple, DisableClearable, FreeSolo, ChipComponent>>['options'] | undefined;
  AutocompleteProps?: Partial<AutocompleteProps<T, Multiple, DisableClearable, FreeSolo, ChipComponent>> | undefined;
  TextFieldProps?: Partial<TextFieldProps> | undefined;
};
