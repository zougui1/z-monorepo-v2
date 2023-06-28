import type { ZodTupleDef } from 'zod';

import { parseDef, type ZodDefMeta, type ZodDef } from '../parseDef';
import type { Refs } from '../Refs';

export const parseTupleDef = (def: ZodTupleDef, refs: Refs): TupleZodDef => {
  const result: TupleZodDef = {
    type: 'tuple',
    items: def.items.map(item => parseDef(item._def, refs)),
    length: def.items.length,
    description: def.description,
    nullable: false,
    optional: false,
  };

  return result;
}

export interface TupleZodDef extends ZodDefMeta {
  type: 'tuple';
  items: ZodDef[];
  length: number;
  default?: unknown;
}
