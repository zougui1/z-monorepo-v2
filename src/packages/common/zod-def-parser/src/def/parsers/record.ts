import type { ZodRecordDef } from 'zod';

import { parseDef, type ZodDefMeta, type ZodDef } from '../parseDef';
import type { Refs } from '../Refs';

export const parseRecordDef = (def: ZodRecordDef, refs: Refs): RecordZodDef => {
  const result: RecordZodDef = {
    type: 'record',
    keyType: parseDef(def.keyType._def, refs),
    valueType: parseDef(def.keyType._def, refs),
    description: def.description,
    nullable: false,
    optional: false,
  };

  return result;
}

export interface RecordZodDef extends ZodDefMeta {
  type: 'record';
  keyType: ZodDef;
  valueType: ZodDef;
}
