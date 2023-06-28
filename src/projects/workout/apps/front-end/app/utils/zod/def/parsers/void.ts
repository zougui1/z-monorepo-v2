import type { ZodVoidDef } from 'zod';

import type { ZodDefMeta } from '../parseDef';

export const parseVoidDef = (def: ZodVoidDef): VoidZodDef => {
  return {
    type: 'void',
    description: def.description,
    nullable: false,
    optional: false,
  };
}

export interface VoidZodDef extends ZodDefMeta {
  type: 'void';
}
