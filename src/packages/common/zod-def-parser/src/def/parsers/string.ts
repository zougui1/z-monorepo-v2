import type { ZodStringDef, ZodStringCheck } from 'zod';

import type { ZodDefMeta } from '../parseDef';

export const parseStringDef = (def: ZodStringDef): StringZodDef => {
  return {
    type: 'string',
    checks: def.checks,
    coerce: def.coerce,
    description: def.description,
    nullable: false,
    optional: false,
  };
}

export interface StringZodDef extends ZodDefMeta {
  type: 'string';
  checks: ZodStringCheck[];
  coerce: boolean;
  default?: string | undefined;
}
