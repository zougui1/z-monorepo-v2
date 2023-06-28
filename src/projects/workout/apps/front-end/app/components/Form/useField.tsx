import React from 'react';
import type { UseFormRegister, Control, FieldError, Merge, FieldErrorsImpl  } from 'react-hook-form';

import type { ZodDef } from '~/utils';

import { useFormSelector } from './context';

export const useField = ({ name, label }: UseFieldOptions): UseFieldResult | undefined => {
  const register = useFormSelector(state => state.register);
  const getControl = useFormSelector(state => state.getControl);
  const error = useFormSelector(state => state.formState.errors[name]);
  const fieldDef = useFormSelector(state => state.schemaDef.fields[name]) as ZodDef | undefined;

  if (!fieldDef) {
    console.error(`Field "${name}" does not exist in the form schema`);
    return;
  }

  const isRequired = 'nullable' in fieldDef && !fieldDef.nullable && !fieldDef.optional;

  const actualLabel = label && isRequired
    ? <>{label}{' '}<span>*</span></>
    : label;

  const errorMessage = typeof error?.message === 'string'
    ? error.message
    : undefined;

  return {
    register,
    error,
    control: getControl(),
    errorMessage,
    label: actualLabel,
    def: fieldDef,
    required: isRequired,
  }
}

export interface UseFieldOptions {
  name: string;
  label?: React.ReactNode | undefined;
}

export interface UseFieldResult {
  register: UseFormRegister<any>;
  control: Control<any>;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
  /**
   * alias of `error.message` ensuring that the message is a string
   */
  errorMessage?: string | undefined;
  label?: React.ReactNode | undefined;
  def: ZodDef;
  required: boolean;
}
