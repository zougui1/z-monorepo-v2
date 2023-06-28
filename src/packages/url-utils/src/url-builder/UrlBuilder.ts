import zod, { AnyZodObject, ZodRawShape } from 'zod';
import QS from 'qs';

import { createPathParamsSchema } from './utils';
import { parseUrl, ParseUrlResult, ParsePathParams } from '../validation';
import { parsePathPattern } from '../parsePathPattern';

export class UrlBuilder<
  ParamsScheme extends string | void = void,
  ParamsSchema extends ZodPathShape<ParamsScheme> | void = void,
  QuerySchema extends ZodRawShape | void = void,
> {
  _allowedHosts: string[] | undefined;
  _allowedProtocols: string[] | undefined;
  _pathString: ParamsScheme | undefined;
  _pathSchema: ToZodObject<ParamsSchema> | undefined;
  _querySchema: ToZodObject<QuerySchema> | undefined;

  allowedHosts(hosts: string[]): this {
    this._allowedHosts = hosts;
    return this;
  }

  allowedProtocols(protocols: string[]): this {
    this._allowedProtocols = protocols;
    return this;
  }

  path<
    NewParamsScheme extends string,
    NewParamsSchema extends ZodPathShape<NewParamsScheme> | void = void
  >(path: NewParamsScheme, schema?: NewParamsSchema): UrlBuilder<NewParamsScheme, NewParamsSchema, QuerySchema> {
    //const newZurl = this as UrlBuilder<NewParamsScheme, ZodPathShape<NewParamsScheme>, QuerySchema>;
    const newZurl = this as any as UrlBuilder<NewParamsScheme, ZodPathShape<any>, QuerySchema>;
    newZurl._pathString = path;

    if (schema) {
      //newZurl._pathSchema = zod.object<ZodPathShape<NewParamsScheme>>(schema);
      newZurl._pathSchema = zod.object<ZodPathShape<any>>(schema);
    }

    return newZurl as UrlBuilder<NewParamsScheme, NewParamsSchema, QuerySchema>;
  }

  query<NewQuerySchema extends ZodRawShape>(schema: NewQuerySchema): UrlBuilder<ParamsScheme, ParamsSchema, NewQuerySchema> {
    const newZurl = this as any as UrlBuilder<ParamsScheme, ParamsSchema, ZodRawShape>;
    newZurl._querySchema = zod.object<ZodRawShape>(schema);

    return newZurl as UrlBuilder<ParamsScheme, ParamsSchema, NewQuerySchema>;
  }

  parse(url: string): ParseUrlResult<ParamsScheme, ToZodObject<ParamsSchema>, ToZodObject<QuerySchema>> {
    return parseUrl(url, {
      hosts: this._allowedHosts,
      protocols: this._allowedProtocols,
      params: {
        scheme: this._pathString || '',
        schema: this._pathSchema,
      },
      query: {
        schema: this._querySchema,
      },
    }) as ParseUrlResult<ParamsScheme, ToZodObject<ParamsSchema>, ToZodObject<QuerySchema>>;
  }

  validate(url: string): boolean {
    try {
      this.parse(url);
      return true;
    } catch {
      return false;
    }
  }

  create(options: CreateUrlOptions<ParamsScheme, ParamsSchema, QuerySchema>): string {
    const [protocol] = this._allowedProtocols || [];
    const [host] = this._allowedHosts || [];

    if (!protocol) {
      throw new Error('Cannot create a URL without a list of allowed protocols');
    }

    if (!host) {
      throw new Error('Cannot create a URL without a list of allowed hosts');
    }

    const pathSchema = createPathParamsSchema(this._pathString, this._pathSchema);
    const params = pathSchema.parse(options.params);

    const path = parsePathPattern(this._pathString || '').map(pathComponent => {
      if (!pathComponent.isDynamic) {
        return pathComponent.name;
      }

      const param = params[pathComponent.name];

      if (param) {
        return param;
      }
    }).filter(Boolean).join('/');
    const pathName = path ? `/${path}` : '';

    const queryParams = this._querySchema?.parse(options.query) || options.query;
    const query = QS.stringify(queryParams);
    const queryString = query ? `?${query}` : '';

    return `${protocol}://${host}${pathName}${queryString}`;
  }
}

export type ZodPathShape<Key extends string | void> = {
  [k in PathKey<Key>]: ZodPathParam;
}

type ToZodObject<Shape extends ZodPathShape<any> | ZodRawShape | void> = (
  Shape extends ZodPathShape<any>
    ? zod.ZodObject<Shape>
    : Shape extends ZodRawShape
      ? zod.ZodObject<Shape>
      : void
);

type PathKey<T extends string | void> = T extends string ? keyof ParsePathParams<T, true> : string;

export interface CreateUrlOptions<
  ParamsScheme extends string | void = void,
  ParamsSchema extends ZodPathShape<ParamsScheme> | void = void,
  QuerySchema extends ZodRawShape | void = void,
> {
  params: ParamsSchema extends ZodPathShape<any>
    ? zod.infer<zod.ZodObject<ParamsSchema>>
    : ParamsScheme extends string
      ? ParsePathParams<ParamsScheme>
      : {};
  query: QuerySchema extends ZodPathShape<any>
    ? zod.infer<zod.ZodObject<QuerySchema>>
    : {};
}

type ZodPathParam = (
  | zod.ZodString
  | zod.ZodNumber
  | zod.ZodEnum<[any, ...any[]]>
  | zod.ZodOptional<zod.ZodString>
  | zod.ZodOptional<zod.ZodNumber>
  | zod.ZodOptional<zod.ZodEnum<[any, ...any[]]>>
  | zod.ZodDefault<zod.ZodString>
  | zod.ZodDefault<zod.ZodNumber>
  | zod.ZodDefault<zod.ZodEnum<[any, ...any[]]>>
)
