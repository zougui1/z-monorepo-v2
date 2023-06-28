import type { ZodDefaultDef } from 'zod';

import { parseDef, type ZodDef } from '../parseDef';
import type { Refs } from '../Refs';

export const parseDefaultDef = (def: ZodDefaultDef, refs: Refs): ZodDef | undefined => {
  const innerSchema = parseDef(def.innerType._def, refs);

  return {
    ...innerSchema,
    defaultValue: def.defaultValue(),
  };
}
