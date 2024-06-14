import type { ZodPipelineDef, ZodTypeAny } from 'zod';

import { parseDef, type ZodDefMeta } from '../parseDef';
import type { Refs } from '../Refs';

export const parsePipelineDef = (def: ZodPipelineDef<ZodTypeAny, ZodTypeAny>, refs: Refs): PipelineZodDef<unknown, unknown> => {
  const result: PipelineZodDef<unknown, unknown> = {
    type: 'pipeline',
    in: parseDef(def.in._def, refs),
    out: parseDef(def.out._def, refs),
    description: def.description,
    nullable: false,
    optional: false,
  };

  return result;
}

export interface PipelineZodDef<TIn, TOut> extends ZodDefMeta {
  type: 'pipeline';
  in: TIn;
  out: TOut;
  default?: (TIn & TOut) | undefined;
}
