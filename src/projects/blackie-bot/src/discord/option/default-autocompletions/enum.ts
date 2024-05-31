import type { EnumZodDef } from '@zougui/common.zod-def-parser';

import type { AutocompleteContext, AutocompletionOption } from '../../autocomplete'

export const createEnumAutocompletion = (def: EnumZodDef) => ({ value }: AutocompleteContext): AutocompletionOption[] => {
  console.log('autocomplete')
  const valueLower = value.toLowerCase();
  return def.values.filter(item => item.toLowerCase().includes(valueLower));
}
