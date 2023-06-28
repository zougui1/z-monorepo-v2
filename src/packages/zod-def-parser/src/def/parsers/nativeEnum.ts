import type { ZodNativeEnumDef } from 'zod';

import { type ZodDefMeta } from '../parseDef';

const getEnumType = (parsedTypes: string[]): NativeEnumZodDef['enumType'] => {
  if (parsedTypes.length === 1) {
    return parsedTypes[0] === 'string'
      ? 'string'
      : 'number';
  }

  return ['string', 'number'];
}

export const parseNativeEnumDef = (def: ZodNativeEnumDef): NativeEnumZodDef => {
  const object = def.values;
  const actualKeys = Object.keys(def.values).filter(key => {
    return typeof object[object[key]] !== 'number';
  });

  const actualValues = actualKeys.map(key => object[key]);

  const parsedTypes = Array.from(
    new Set(actualValues.map(values => typeof values))
  );

  const result: NativeEnumZodDef = {
    type: 'nativeEnum',
    enumType: getEnumType(parsedTypes),
    values: actualValues,
    description: def.description,
    nullable: false,
    optional: false,
  };

  return result;
}

export type EnumType = string | number | [string, number];

export interface NativeEnumZodDef<T extends EnumType = EnumType, Enum extends (string | number)[] = (string | number)[]> extends ZodDefMeta {
  type: 'nativeEnum';
  enumType: 'string' | 'number' | ['string', 'number'];
  values: Enum;
  defaultValue?: (
    T extends any[]
      ? (string | number)
      : T
  ) | undefined;
}
