import qs from 'qs';

import { parsePathPattern } from '@zougui/common.url-utils';
import type { UnknownObject } from '@zougui/common.type-utils';

import type { UnknownContractOptions } from './InferContract';
import type { AnyContract } from '../contract';
import type { AnyZodObject } from '../types';

export const contractToRequest = (contract: AnyContract) => {
  return async (options?: UnknownContractOptions | undefined) => {
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
      validateParam('query', contract.query, options?.query),
      validateParam('params', paramsSchema, options?.params),
      validateParam('body', bodySchema, options?.body),
      validateParam('headers', contract.headers, options?.headers),
    ]);

    // TODO need baseURL (for the host)
    const pathParts = parsePathPattern(contract.path).map(pathComponent => {
      if (!pathComponent.isDynamic) {
        return pathComponent.name;
      }

      const param = params?.[pathComponent.name];

      if (param) {
        return param;
      }
    }).join('/');
    const queryString = query ? qs.stringify(query) : undefined;
    const path = queryString ? `${pathParts}?${queryString}` : pathParts;

    console.log({
      method: contract.method,
      path,
      body,
      headers,
    });
    /*const response = await fetch(path, {
      method: contract.method,
      body: body === undefined ? undefined : JSON.stringify(body),
      headers: headers as Record<string, string>,
    });*/

    const response = {};

    return response;
  }
}

const validateParam = async (label: string, schema: AnyZodObject | undefined, value: unknown): Promise<UnknownObject | undefined> => {
  if (schema) {
    return await schema.parseAsync(value);
  }

  if (process.env.NODE_ENV !== 'development' && value !== undefined) {
    console.warn(`a parameter ${label} is given but there is no schema to validate it`);
  }
}
