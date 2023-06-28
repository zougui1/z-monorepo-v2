import type { ZodAnyDef } from 'zod';

import type { ZodDefMeta } from '../parseDef';

export const parseAnyDef = (def: ZodAnyDef): AnyZodDef => {
  return {
    type: 'any',
    description: def.description,
    nullable: false,
    optional: false,
  };
}

export interface AnyZodDef extends ZodDefMeta {
  type: 'any';
  default?: any;
}
