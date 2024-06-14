import type { ZodNumberDef, ZodNumberCheck } from 'zod';

import type { ZodDefMeta } from '../parseDef';

export const parseNumberDef = (def: ZodNumberDef): NumberZodDef => {
  return {
    type: 'number',
    checks: def.checks,
    coerce: def.coerce,
    description: def.description,
    nullable: false,
    optional: false,
  };
}

export interface NumberZodDef extends ZodDefMeta {
  type: 'number';
  checks: ZodNumberCheck[];
  coerce: boolean;
  default?: number | undefined;
}
