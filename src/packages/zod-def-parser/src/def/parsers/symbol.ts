import type { ZodSymbolDef } from 'zod';

import type { ZodDefMeta } from '../parseDef';

export const parseSymbolDef = (def: ZodSymbolDef): SymbolZodDef => {
  return {
    type: 'symbol',
    description: def.description,
    nullable: false,
    optional: false,
  };
}

export interface SymbolZodDef extends ZodDefMeta {
  type: 'symbol';
}
