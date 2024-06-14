import type { ZodUnionDef, ZodDiscriminatedUnionDef, ZodTypeAny } from 'zod';
import type { ValueOf } from 'type-fest';

import { parseDef, type ZodDefMeta, type ZodDef } from '../parseDef';
import type { Refs } from '../Refs';

export const primitiveMappings = {
  ZodString: 'string',
  ZodNumber: 'number',
  ZodBigInt: 'integer',
  ZodBoolean: 'boolean',
  ZodNull: 'null',
} as const;
export type PrimitiveUnionType = ValueOf<typeof primitiveMappings>;

export const parseUnionDef = (def: ZodUnionDef | ZodDiscriminatedUnionDef<any, any>, refs: Refs): UnionZodDef => {
  const options = getOptions(def.options);

  const result: UnionZodDef = {
    type: 'union',
    options: options.map(option => parseDef(option._def, refs)),
    description: def.description,
    nullable: false,
    optional: false,
  };

  return result;
}

const getOptions = (dirtyOptions: unknown): ZodTypeAny[] => {
  if (Array.isArray(dirtyOptions)) {
    return dirtyOptions;
  }

  if (dirtyOptions instanceof Map) {
    return Array.from(dirtyOptions.values());
  }

  return [];
}

export interface UnionZodDef<T extends readonly [ZodDef, ZodDef, ...ZodDef[]] = readonly [ZodDef, ZodDef, ...ZodDef[]]> extends ZodDefMeta {
  type: 'union';
  options: T[];
  default?: T | undefined;
}
