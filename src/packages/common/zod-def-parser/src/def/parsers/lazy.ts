import type { ZodLazyDef } from 'zod';

import { parseDef, type ZodDef, type ZodDefMeta } from '../parseDef';
import type { Refs } from '../Refs';

export const parseLazyDef = (def: ZodLazyDef, refs: Refs): LazyZodDef => {
  return {
    type: 'lazy',
    value: parseDef(def.getter()._def, refs),
    description: def.description,
    nullable: false,
    optional: false,
  };
}

export interface LazyZodDef extends ZodDefMeta {
  type: 'lazy';
  value: ZodDef;
}
