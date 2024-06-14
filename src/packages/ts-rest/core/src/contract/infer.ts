import type zod from 'zod';

import type { AnyObject } from '@zougui/common.type-utils';

import type { AnyContract } from './ContractData';
import type { ZodOptionalInfer } from '../types';

export type InferZodPropertyAsObject<T extends AnyObject, Key extends string = string> = T[Key] extends zod.ZodRawShape
  ? { [K in Key]: zod.ZodObject<T[Key]> }
  : T[Key] extends zod.ZodType
    ? { [K in Key]: T[Key] }
    : {};

// removes unecessary options from the object
export type InferContractData<Contract extends AnyContract> = zod.infer<zod.ZodObject<(
  & InferZodPropertyAsObject<Contract, 'query'>
  & InferZodPropertyAsObject<Contract, 'params'>
  & InferZodPropertyAsObject<Contract, 'headers'>
  & InferZodPropertyAsObject<Contract, 'body'>
)>>;

export type InferContractResponse<Contract extends AnyContract> = ZodOptionalInfer<Contract['response']>;
