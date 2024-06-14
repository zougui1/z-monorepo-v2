import type { ZodNullableDef } from 'zod';

import { parseDef, type ZodDef } from '../parseDef';
import type { Refs } from '../Refs';

export const parseNullableDef = (def: ZodNullableDef, refs: Refs): ZodDef | undefined => {
  const innerSchema = parseDef(def.innerType._def, refs);

  if (!innerSchema) {
    return;
  }

  return {
    ...innerSchema,
    nullable: true,
  };
}
