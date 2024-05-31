import type z from 'zod';

import { getDef } from '@zougui/common.zod-def-parser';

import { createEnumAutocompletion } from './enum';
import type { AutocompleteHandler } from '../../autocomplete';

export const createDefaultAutocompletion = (schema: z.Schema): AutocompleteHandler | undefined => {
  const def = getDef(schema);

  switch (def.type) {
    case 'enum': return createEnumAutocompletion(def);
  }
}
