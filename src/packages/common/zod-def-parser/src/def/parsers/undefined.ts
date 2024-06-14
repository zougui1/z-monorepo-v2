import type { ZodUndefinedDef } from 'zod';

import type { ZodDefMeta } from '../parseDef';

export const parseUndefinedDef = (def: ZodUndefinedDef): UndefinedZodDef => {
  return {
    type: 'undefined',
    description: def.description,
    nullable: false,
    optional: true,
  };
}

export interface UndefinedZodDef extends ZodDefMeta {
  type: 'undefined';
}
