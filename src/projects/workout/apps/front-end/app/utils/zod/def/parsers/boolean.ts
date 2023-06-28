import type { ZodBooleanDef } from 'zod';

import type { ZodDefMeta } from '../parseDef';

export const parseBooleanDef = (def: ZodBooleanDef): BooleanZodDef => {
  return {
    type: 'boolean',
    coerce: def.coerce,
    description: def.description,
    nullable: false,
    optional: false,
  };
}

export interface BooleanZodDef extends ZodDefMeta {
  type: 'boolean';
  coerce: boolean;
  description?: string | undefined;
  default?: boolean | undefined;
}
