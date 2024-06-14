import type { ZodNaNDef } from 'zod';

import type { ZodDefMeta } from '../parseDef';

export const parseNaNDef = (def: ZodNaNDef): NaNZodDef => {
  return {
    type: 'NaN',
    description: def.description,
    nullable: false,
    optional: false,
  };
}

export interface NaNZodDef extends ZodDefMeta {
  type: 'NaN';
}
