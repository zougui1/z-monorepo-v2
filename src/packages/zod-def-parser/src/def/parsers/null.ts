import type { ZodNullDef } from 'zod';

import type { ZodDefMeta } from '../parseDef';

export const parseNullDef = (def: ZodNullDef): NullZodDef => {
  return {
    type: 'null',
    description: def.description,
    nullable: true,
    optional: false,
  };
}

export interface NullZodDef extends ZodDefMeta {
  type: 'null';
}
