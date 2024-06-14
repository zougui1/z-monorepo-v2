import type { ZodEnumDef } from 'zod';

import type { EnumValues } from '@zougui/common.type-utils';

import type { ZodDefMeta } from '../parseDef';

export const parseEnumDef = (def: ZodEnumDef): EnumZodDef => {
  const result: EnumZodDef = {
    type: 'enum',
    values: def.values,
    description: def.description,
    nullable: false,
    optional: false,
  };

  return result;
}

export interface EnumZodDef<T = string, Enum extends EnumValues<T> = EnumValues<T>> extends ZodDefMeta {
  type: 'enum';
  values: Enum;
  default?: T | undefined;
}
