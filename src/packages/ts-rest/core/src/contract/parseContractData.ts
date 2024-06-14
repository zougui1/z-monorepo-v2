import type { UnknownObject } from '@zougui/common.type-utils';

import type { AnyContract, UnknownContractData } from './ContractData';
import type { AnyZodObject } from '../types';

export const parseContractParams = async (contract: AnyContract, data: UnknownContractData | undefined): Promise<ParsedContractParams> => {
  const paramsSchema = 'params' in contract
    ? contract.params as AnyZodObject
    : undefined;
  const bodySchema = 'body' in contract
    ? contract.body as AnyZodObject
    : undefined;

  const [
    query,
    params,
    body,
    headers,
  ] = await Promise.all([
    validateParam('query', contract.query, data?.query),
    validateParam('params', paramsSchema, data?.params),
    validateParam('body', bodySchema, data?.body),
    validateParam('headers', contract.headers, data?.headers),
  ]);

  return {
    query,
    params,
    body,
    headers,
  };
}

const validateParam = async (label: string, schema: AnyZodObject | undefined, value: unknown): Promise<UnknownObject | undefined> => {
  if (schema) {
    return await schema.parseAsync(value);
  }

  if (process.env.NODE_ENV !== 'development' && value !== undefined) {
    console.warn(`a parameter ${label} is given but there is no schema to validate it`);
  }
}

export interface ParsedContractParams {
  query: UnknownObject | undefined;
  params: UnknownObject | undefined;
  body: UnknownObject | undefined;
  headers: UnknownObject | undefined;
}
