import type { ZodUnknownDef } from 'zod';

import type { ZodDefMeta } from '../parseDef';

export const parseUnknownDef = (def: ZodUnknownDef): UnknownZodDef => {
  return {
    type: 'unknown',
    description: def.description,
    nullable: false,
    optional: false,
  };
}

export interface UnknownZodDef extends ZodDefMeta {
  type: 'unknown';
}
