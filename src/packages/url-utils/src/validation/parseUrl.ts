import zod, { AnyZodObject } from 'zod';

import { validateProtocol } from './validateProtocol';
import { parsePathName, ParsePathParams } from './parsePathName';
import { parseQueryString } from './parseQueryString';

export const parseUrl = <
  ParamsScheme extends string | void = void,
  ParamsSchema extends AnyZodObject | void = void,
  QuerySchema extends AnyZodObject | void = void,
  >(
  url: string,
  options?: ParseUrlOptions<ParamsScheme, ParamsSchema, QuerySchema> | undefined,
): ParseUrlResult<ParamsScheme, ParamsSchema, QuerySchema> => {
  const urlObject = new URL(url);

  if (options?.protocols && !validateProtocol(url, options.protocols)) {
    throw new Error('Invalid protocol');
  }

  if (options?.hosts && !options.hosts.includes(urlObject.host)) {
    throw new Error('Invalid host');
  }

  const params = options?.params?.scheme
    // String() and undefined are for type safety
    ? parsePathName(url, String(options.params.scheme), options.params.schema || undefined)
    : {};

  const query = options?.query?.schema
    // because typescript doesn't guard against void for some reason
    ? parseQueryString(url, options.query.schema)
    : {};

  return {
    params: params as any,
    query: query as any,
  };
}

export interface ParseUrlOptions<
  ParamsScheme extends string | void,
  ParamsSchema extends AnyZodObject | void,
  QuerySchema extends AnyZodObject | void,
> {
  protocols?: string[] | undefined;
  hosts?: string[] | undefined;

  params?: {
    scheme: ParamsScheme;
    schema?: ParamsSchema;
  } | undefined;

  query?: {
    schema: QuerySchema;
  } | undefined;
}

export interface ParseUrlResult<
  ParamsScheme extends string | void,
  ParamsSchema extends AnyZodObject | void,
  QuerySchema extends AnyZodObject | void,
> {
  params: ParamsSchema extends AnyZodObject
    ? zod.infer<ParamsSchema>
    : ParamsScheme extends string
      ? ParsePathParams<ParamsScheme>
      : {};
  query: QuerySchema extends AnyZodObject
    ? zod.infer<QuerySchema>
    : {};
}
