import type { ZodLiteralDef } from 'zod';

import { type ZodDefMeta } from '../parseDef';
import { getType, type Type } from '../../getType';

export const parseLiteralDef = (def: ZodLiteralDef): LiteralZodDef<unknown> => {
  const result: LiteralZodDef<unknown> = {
    type: 'literal',
    valueType: getType(def.value),
    value: def.value,
    description: def.description,
    nullable: false,
    optional: false,
  };

  return result;
}

export interface LiteralZodDef<T> extends ZodDefMeta {
  type: 'literal';
  valueType: Type;
  value: T;
  default?: T | undefined;
}
