import type { ZodArrayDef } from 'zod';

import { parseDef, type ZodDefMeta, type ZodDef } from '../parseDef';
import type { Refs } from '../Refs';

export const parseArrayDef = (def: ZodArrayDef, refs: Refs): ArrayZodDef => {
  const result: ArrayZodDef = {
    type: 'array',
    items: parseDef(def.type._def, refs),
    minLength: def.minLength,
    maxLength: def.maxLength,
    exactLength: def.exactLength,
    description: def.description,
    nullable: false,
    optional: false,
  };

  return result;
}

export interface ArrayZodDef<T extends ZodDef = ZodDef> extends ZodDefMeta {
  type: 'array';
  items: T;
  minLength: ZodArrayDef['minLength'];
  maxLength: ZodArrayDef['maxLength'];
  exactLength: ZodArrayDef['exactLength'];
  default?: T | undefined;
}
