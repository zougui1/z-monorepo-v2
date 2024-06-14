import type { ZodPromiseDef } from 'zod';

import type { Refs } from '../Refs';
import { parseDef, type ZodDef } from '../parseDef';

export const parsePromiseDef = (def: ZodPromiseDef<any>, refs: Refs): ZodDef | undefined => {
  return parseDef(def.type._def, refs);
}
