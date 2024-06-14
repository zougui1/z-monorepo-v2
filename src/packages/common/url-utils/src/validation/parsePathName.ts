import zod, { AnyZodObject } from 'zod';

import { validatePathName } from './validatePathName';
import { parsePathComponent } from '../parsePathComponent';

export function parsePathName<T extends string>(
  url: string,
  pathNameScheme: T,
  schema?: undefined,
): ParsePathParams<T>;
export function parsePathName<Schema extends AnyZodObject, T extends string>(
  url: string,
  pathNameScheme: T,
  schema: Schema,
): zod.infer<Schema>;
export function parsePathName<Schema extends AnyZodObject, T extends string>(
  url: string,
  pathNameScheme: T,
  schema?: Schema | undefined,
): ParsePathParams<T> | zod.infer<Schema>;
export function parsePathName<Schema extends AnyZodObject, T extends string>(
  url: string,
  pathNameScheme: T,
  schema?: Schema | undefined,
): ParsePathParams<T> | zod.infer<Schema> {
  if (!validatePathName(url, pathNameScheme)) {
    throw new Error('Invalid pathname');
  }

  const urlObject = new URL(url);
  const urlPathNameParts = splitPathName(urlObject.pathname);
  const pathNameSchemeParts = splitPathName(pathNameScheme);

  const pathParams = urlPathNameParts.reduce((params, pathComponent, index) => {
    const pathSchemeComponent = parsePathComponent(pathNameSchemeParts[index]);

    if (pathSchemeComponent.isDynamic) {
      params[pathSchemeComponent.name] = pathComponent;
    }

    return params;
  }, {} as Record<string, string | undefined>);

  if (!schema) {
    return pathParams as ParsePathParams<T>;
  }

  return schema.parse(pathParams);
}

const splitPathName = (pathName: string): string[] => {
  return pathName.split('/').filter(Boolean);
}

export type ParsePathParams<T extends string, EnsureEmptyObject extends boolean = false> = T extends `${string}:${infer Param}/${infer Rest}`
  ? { [K in Param]: string } & ParsePathParams<Rest>
    : T extends `${string}:${infer Param}?`
      ? { [K in Param]?: string | undefined }
      : T extends `${string}:${infer Param}?/${infer Rest}`
        ? { [K in Param]?: string | undefined } & ParsePathParams<Rest>
          : T extends `${string}:${infer Param}`
            ? { [K in Param]: string }
  // makes sure it's an empty object instead of "any" object
: EnsureEmptyObject extends true
    ? { '': never }
    : {};
