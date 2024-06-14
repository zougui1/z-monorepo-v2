import type { ZodBigIntDef, ZodBigIntCheck } from 'zod';

import type { ZodDefMeta } from '../parseDef';

export const parseBigIntDef = (def: ZodBigIntDef): BigIntZodDef => {
  return {
    type: 'number',
    format: 'int64',
    checks: def.checks,
    coerce: def.coerce,
    description: def.description,
    nullable: false,
    optional: false,
  };
}

export interface BigIntZodDef extends ZodDefMeta {
  type: 'number';
  format: 'int64';
  checks: ZodBigIntCheck[];
  coerce: boolean;
  description?: string | undefined;
  default?: bigint | undefined;
}
