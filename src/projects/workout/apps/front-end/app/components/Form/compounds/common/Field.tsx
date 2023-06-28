import type { RegisterOptions, UseFormRegisterReturn } from 'react-hook-form';

import { useField, type UseFieldResult } from '../../useField';

export const Field = ({ name, label, render }: FieldProps) => {
  const field = useField({ name, label });

  if (!field) {
    return null;
  }

  const register = (options?: RegisterOptions<any, any>): UseFormRegisterReturn<any> => {
    return field.register(name, options);
  }

  return render({
    ...field,
    register,
  });
}

export interface FieldProps {
  name: string;
  label: React.ReactNode;
  render: (data: FieldRenderData) => JSX.Element;
}

export interface FieldRenderData extends Omit<UseFieldResult, 'register'> {
  register: (options?: RegisterOptions<any, any>) => UseFormRegisterReturn<any>;
}
