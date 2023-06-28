import type { ZodSetDef } from 'zod';

import { parseDef, type ZodDefMeta, type ZodDef } from '../parseDef';
import type { Refs } from '../Refs';

export const parseSetDef = (def: ZodSetDef, refs: Refs): SetZodDef => {
  const result: SetZodDef = {
    type: 'set',
    items: parseDef(def.valueType._def, refs),
    description: def.description,
    minSize: def.minSize,
    maxSize: def.maxSize,
    nullable: false,
    optional: false,
  };

  return result;
}

export interface SetZodDef<T extends ZodDef = ZodDef> extends ZodDefMeta {
  type: 'set';
  items: T;
  minSize: ZodSetDef['minSize'];
  maxSize: ZodSetDef['maxSize'];
  default?: Set<T> | undefined;
}
