import type { ZodCatchDef } from 'zod';

import type { Refs } from '../Refs';
import { parseDef, type ZodDef } from '../parseDef';

export const parseCatchDef = (def: ZodCatchDef<any>, refs: Refs): ZodDef | undefined => {
  if (!def.innerType?._def) {
    return;
  }

  return parseDef(def.innerType._def, refs);
}
