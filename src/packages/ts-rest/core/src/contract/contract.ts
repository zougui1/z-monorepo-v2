import type zod from 'zod';

import type { ZodPathShape } from '@zougui/common.url-utils';

import type { ContractData } from './ContractData';
import { Method } from '../Method';
import type { AnyZodObject, ZodHeaders } from '../types';

const contractCreator = <TMethod extends Method>(method: TMethod) => <
  TPath extends string,
  TParams extends ZodPathShape<TPath>,
  TQuery extends AnyZodObject,
  TBody extends AnyZodObject,
  TResponse extends zod.ZodType,
  THeaders extends ZodHeaders,
  Contract extends ContractData<TMethod, TPath, TParams, TQuery, TBody, TResponse, THeaders>
>(path: TPath, data: Contract): Contract & { path: TPath; method: TMethod; } => {
  return {
    ...data,
    path,
    method,
  };
}

export const contract = {
  get: contractCreator(Method.Get),
  post: contractCreator(Method.Post),
  put: contractCreator(Method.Put),
  patch: contractCreator(Method.Patch),
  delete: contractCreator(Method.Delete),
  head: contractCreator(Method.Head),
  options: contractCreator(Method.Options),
};
