import type { ZodBrandedDef } from 'zod';

import type { Refs } from '../Refs';
import { parseDef, type ZodDef } from '../parseDef';

export const parseBrandedDef = (def: ZodBrandedDef<any>, refs: Refs): ZodDef | undefined => {
  if (!def.type?._def) {
    return;
  }

  return parseDef(def.type._def, refs);
}
