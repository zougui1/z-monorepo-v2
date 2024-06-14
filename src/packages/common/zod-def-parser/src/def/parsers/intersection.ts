import type { ZodIntersectionDef } from 'zod';

import { parseDef, type ZodDefMeta } from '../parseDef';
import type { Refs } from '../Refs';

export const parseIntersectionDef = (def: ZodIntersectionDef, refs: Refs): IntersectionZodDef<unknown, unknown> => {
  const result: IntersectionZodDef<unknown, unknown> = {
    type: 'intersection',
    left: parseDef(def.left._def, refs),
    right: parseDef(def.right._def, refs),
    description: def.description,
    nullable: false,
    optional: false,
  };

  return result;
}

export interface IntersectionZodDef<TLeft, TRight> extends ZodDefMeta {
  type: 'intersection';
  left: TLeft;
  right: TRight;
  default?: (TLeft & TRight) | undefined;
}
