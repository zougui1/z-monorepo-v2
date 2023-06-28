import type zod from 'zod';

import type { ZodPathShape } from '@zougui/common.url-utils';

import type { Method, MethodWithBody, MethodWithoutBody } from '../Method';
import type { AnyZodObject, ZodHeaders } from '../types';

export interface BaseContractData<
  TQuery extends AnyZodObject,
  TResponse extends zod.ZodType,
  THeaders extends ZodHeaders,
> {
  query?: TQuery | undefined;
  response?: TResponse | undefined;
  headers?: THeaders | undefined;
}

export interface ContractDataWithoutBody<
  TQuery extends AnyZodObject,
  TResponse extends zod.ZodType,
  THeaders extends ZodHeaders,
> extends BaseContractData<TQuery, TResponse, THeaders> {

}

export interface ContractDataWithBody<
  TQuery extends AnyZodObject,
  TBody extends AnyZodObject,
  TResponse extends zod.ZodType,
  THeaders extends ZodHeaders,
> extends BaseContractData<TQuery, TResponse, THeaders> {
  body?: TBody | undefined;
}

export type RawContractData<
  TMethod extends Method,
  TQuery extends AnyZodObject,
  TBody extends AnyZodObject,
  TResponse extends zod.ZodType,
  THeaders extends ZodHeaders,
> = TMethod extends MethodWithoutBody
  ? ContractDataWithoutBody<TQuery, TResponse, THeaders>
  : TMethod extends MethodWithBody
    ? ContractDataWithBody<TQuery, TBody, TResponse, THeaders>
    : never;

export type ContractData<
  TMethod extends Method,
  TPath extends string,
  TParams extends ZodPathShape<TPath>,
  TQuery extends AnyZodObject,
  TBody extends AnyZodObject,
  TResponse extends zod.ZodType,
  THeaders extends ZodHeaders,
> = keyof TParams extends ''
  ? RawContractData<TMethod, TQuery, TBody, TResponse, THeaders>
  : (RawContractData<TMethod, TQuery, TBody, TResponse, THeaders> & { params: zod.ZodObject<TParams> });

export type AnyContract = ContractData<Method, string, ZodPathShape<string>, AnyZodObject, AnyZodObject, zod.ZodType, ZodHeaders> & { path: string; method: Method;  };
