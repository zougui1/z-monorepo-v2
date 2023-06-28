import type { ZodOptionalDef } from 'zod';

import { parseDef, type ZodDef } from '../parseDef';
import type { Refs } from '../Refs';

export const parseOptionalDef = (def: ZodOptionalDef, refs: Refs): ZodDef | undefined => {
  const innerSchema = parseDef(def.innerType._def, refs);

  if (!innerSchema) {
    return;
  }

  return {
    ...innerSchema,
    optional: true,
  };
}
