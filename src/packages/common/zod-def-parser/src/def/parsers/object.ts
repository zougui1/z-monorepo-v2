import type { ZodObjectDef } from 'zod';

import { parseDef, type ZodDefMeta, type ZodDef } from '../parseDef';
import type { Refs } from '../Refs';

export const parseObjectDef = (def: ZodObjectDef, refs: Refs): ObjectZodDef => {
  const result: ObjectZodDef = {
    type: 'object',
    fields: {},
    description: def.description,
    nullable: false,
    optional: false,
  };

  for (const [propName, propDef] of Object.entries(def.shape())) {
    if (propDef?._def === undefined) {
      continue;
    }

    const parsedDef = parseDef(propDef._def, {
      ...refs,
      currentPath: [...refs.currentPath, 'properties', propName],
      propertyPath: [...refs.currentPath, 'properties', propName],
    });

    if (parsedDef === undefined) {
      continue;
    }

    result.fields[propName] = parsedDef;
  }

  return result;
}

export interface ObjectZodDef<T extends Record<string, ZodDef> = Record<string, ZodDef>> extends ZodDefMeta {
  type: 'object';
  fields: T;
}
