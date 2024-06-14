import type { ZodNeverDef } from 'zod';

export const parseNeverDef = (def: ZodNeverDef): NeverZodDef => {
  return {
    type: 'never',
    description: def.description,
  };
}

export interface NeverZodDef {
  type: 'never';
  description?: string | undefined;
}
