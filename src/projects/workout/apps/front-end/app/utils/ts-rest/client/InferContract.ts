import type zod from 'zod';

import type { AnyObject, UnknownObject } from '@zougui/common.type-utils';

import type { AnyRouter } from '../router';
import type { AnyContract } from '../contract';
import type { ZodOptionalInfer } from '../types';

type InferOptionalZodProperty<T extends AnyObject, Key extends string = string> = T[Key] extends zod.ZodOptional<zod.ZodType>
  ? { [K in Key]?: zod.infer<T[K]>; }
  : T[Key] extends zod.ZodDefault<zod.ZodType>
    ? { [K in Key]?: zod.infer<T[K]>; }
    : T[Key] extends zod.ZodType
      ? { [K in Key]: zod.infer<T[K]>; }
      : {};

// removes unecessary options from the object
export type InferContractOptions<Contract extends AnyContract> = (
  & InferOptionalZodProperty<Contract, 'query'>
  & InferOptionalZodProperty<Contract, 'params'>
  & InferOptionalZodProperty<Contract, 'headers'>
  & InferOptionalZodProperty<Contract, 'body'>
);

// checks if the object 'options' is empty
export type InferContract<Contract extends AnyContract> = keyof InferContractOptions<Contract> extends ''
  ? () => Promise<ZodOptionalInfer<Contract['response']>>
    : InferContractOptions<Contract> extends Partial<Record<string, any>>
    ? (options?: InferContractOptions<Contract> | undefined) => Promise<ZodOptionalInfer<Contract['response']>>
  : (options: InferContractOptions<Contract>) => Promise<ZodOptionalInfer<Contract['response']>>;

export type InferContracts<Router extends AnyRouter> = {
  [Key in keyof Router['contracts']]: InferContract<Router['contracts'][Key]>;
};

export interface GenericContractOptions<T extends AnyObject> {
  query?: T | undefined;
  params?: T | undefined;
  headers?: T | undefined;
  body?: T | undefined;
}

export type AnyContractOptions = GenericContractOptions<AnyObject>;
export type UnknownContractOptions = GenericContractOptions<UnknownObject>;
