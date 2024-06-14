import type { ZodMapDef } from 'zod';

import { parseDef, type ZodDefMeta, type ZodDef } from '../parseDef';
import type { Refs } from '../Refs';

export const parseMapDef = (def: ZodMapDef, refs: Refs): MapZodDef => {
  const result: MapZodDef = {
    type: 'map',
    keyType: parseDef(def.keyType._def, refs),
    valueType: parseDef(def.valueType._def, refs),
    description: def.description,
    nullable: false,
    optional: false,
  };

  return result;
}

export interface MapZodDef<Key extends ZodDef = ZodDef, Value extends ZodDef = ZodDef> extends ZodDefMeta {
  type: 'map';
  keyType: Key;
  valueType: Value;
  default?: Map<Key, Value> | undefined;
}
