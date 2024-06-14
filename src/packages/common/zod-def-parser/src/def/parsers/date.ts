import type { ZodDateDef, ZodDateCheck } from 'zod';

import type { ZodDefMeta } from '../parseDef';

export const parseDateDef = (def: ZodDateDef): DateZodDef => {
  return {
    type: 'date',
    checks: def.checks,
    coerce: def.coerce,
    description: def.description,
    nullable: false,
    optional: false,
  };
}

export interface DateZodDef extends ZodDefMeta {
  type: 'date';
  checks: ZodDateCheck[];
  coerce: boolean;
  description?: string | undefined;
  default?: Date | undefined;
}
