import React, { useEffect } from 'react';
import type { UseFormRegister, FormState as ReactFormState, Control } from 'react-hook-form';
import type zod from 'zod';

import type { UnknownObject } from '@zougui/common.type-utils';

import { useFormActions } from '../context';

export const FormRoot = <TSchema extends zod.AnyZodObject = zod.AnyZodObject>(props: FormRootProps<TSchema>) => {
  const { register, formState, getControl, defaultValues, schema, children, ...formProps } = props;
  const actions = useFormActions();

  useEffect(() => {
    actions.updateForm?.({ register, formState, getControl, defaultValues });
  }, [register, formState, getControl, defaultValues, actions]);

  useEffect(() => {
    actions.updateSchema?.({ schema });
  }, [schema, actions]);

  return (
    <form {...formProps}>
      {children}
    </form>
  );
}

export type HtmlFormProps = React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>;

export interface FormRootProps<TSchema extends zod.AnyZodObject = zod.AnyZodObject> extends HtmlFormProps {
  register: UseFormRegister<zod.infer<TSchema>>;
  formState: ReactFormState<zod.infer<TSchema>>;
  getControl: () => Control<zod.infer<TSchema>>;
  onSubmit: (event: React.BaseSyntheticEvent<object, any, any> | undefined) => void;
  schema: TSchema;
  defaultValues: UnknownObject;
}
