import React, { useMemo } from 'react';
import { useForm, type DeepPartial } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type zod from 'zod';

// TODO import `getDef` from @zougui/common.zod-def-parser
import { getDef, getFieldsDefaultValue } from '~/utils';

import { FormRoot, type HtmlFormProps } from './FormRoot';
import {
  FormTextField,
  FormCheckbox,
  FormSelect,
  FormAutocomplete,
  FormDatePicker,
  FormTimePicker,
  FormDateTimePicker,
  Field,
  DateField,
} from './compounds';
import { FormProvider, type FormState } from './context';
import { defaultGetErrorMap } from './utils';

export const Form = <TSchema extends zod.AnyZodObject = zod.AnyZodObject>(props: FormProps<TSchema>) => {
  const { onSubmit, schema, schemaOptions, defaultValues, ...formProps } = props;

  const schemaDef = useMemo(() => {
    const def = getDef(schema);

    if (def.type !== 'object') {
      throw new Error('Non-object schemas are not supported');
    }

    return def;
  }, [schema]);

  const generatedDefaultValues = useMemo(() => {
    return getFieldsDefaultValue(schemaDef);
  }, [schemaDef]);

  const actualDefaultValues = {
    ...generatedDefaultValues,
    ...defaultValues,
    // type-cast necessary as the the inferenced type is incorrect due to `generatedDefaultValues`'s type
  } as DeepPartial<zod.TypeOf<TSchema>>;

  const { handleSubmit, register, formState, control } = useForm<zod.TypeOf<TSchema>>({
    resolver: zodResolver(
      schema,
      {
        errorMap: defaultGetErrorMap,
        ...schemaOptions,
      },
    ),
    defaultValues: actualDefaultValues,
  });

  const getControl = () => control;
  const defaultState: FormState<TSchema> = {
    register,
    formState,
    schema,
    schemaDef,
    getControl,
    defaultValues: actualDefaultValues,
  };

  return (
    // type-cast necessary as the type of FormProvider isn't inferrenced to `FormProvider<TSchema>`
    <FormProvider defaultState={defaultState as FormState}>
      <FormRoot
        {...formProps}
        register={register}
        getControl={getControl}
        formState={formState}
        onSubmit={handleSubmit(onSubmit)}
        schema={schema}
        defaultValues={actualDefaultValues}
      />
    </FormProvider>
  );
}

Form.TextField = FormTextField;
Form.Checkbox = FormCheckbox;
Form.Select = FormSelect;
Form.Autocomplete = FormAutocomplete;
Form.DatePicker = FormDatePicker;
Form.TimePicker = FormTimePicker;
Form.DateTimePicker = FormDateTimePicker;
Form.Field = Field;
Form.DateField = DateField;

export interface FormProps<TSchema extends zod.AnyZodObject = zod.AnyZodObject> extends Omit<HtmlFormProps, 'onSubmit'> {
  schema: TSchema;
  onSubmit: (data: zod.infer<TSchema>, event: React.BaseSyntheticEvent<object, any, any> | undefined) => void;
  defaultValues?: DeepPartial<zod.TypeOf<TSchema>> | undefined;
  schemaOptions?: Partial<zod.ParseParams> | undefined;
}
