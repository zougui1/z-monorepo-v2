import type { ZodEffectsDef } from 'zod';

import { parseDef, type ZodDef } from '../parseDef';
import type { Refs } from '../Refs';

export const parseEffectsDef = (def: ZodEffectsDef, refs: Refs): ZodDef | undefined => {
  return parseDef(def.schema._def, refs);
}
