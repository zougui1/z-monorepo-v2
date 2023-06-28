import type { ZodFunctionDef } from 'zod';

import { parseTupleDef, type TupleZodDef } from './tuple';
import { parseDef, type ZodDef, type ZodDefMeta } from '../parseDef';
import type { Refs } from '../Refs';

export const parseFunctionDef = (def: ZodFunctionDef, refs: Refs): FunctionZodDef => {
  return {
    type: 'function',
    args: parseTupleDef(def.args._def, refs),
    returns: parseDef(def.returns._def, refs),
    description: def.description,
    nullable: false,
    optional: false,
  };
}

export interface FunctionZodDef extends ZodDefMeta {
  type: 'function';
  args: TupleZodDef;
  returns: ZodDef;
}
