import zod from 'zod';

import { FapContentType } from './FapContentType';
import { AutocompleteHandler, Option } from '../../discord';

const contents = [
  FapContentType.Art,
  FapContentType.Story,
  FapContentType.Imagination,
  FapContentType.RP,
  FapContentType.AI_RP,
  FapContentType.Game,
] as const;

const name = 'content';
const description = 'The content type you fap to';
const schema = zod.enum(contents);
const autocomplete: AutocompleteHandler = ({ value }) => {
  const valueLower = value.toLowerCase();
  return contents.filter(content => content.toLowerCase().includes(valueLower));
}

export const createContentOption = () => {
  return new Option(name, description, schema.optional()).autocomplete(autocomplete);
}

export const createContentOptionWithDefaultValue = ({ defaultValue }: CreateContentOptionWithDefaultValueOptions) => {
  return new Option(name, description, schema.default(defaultValue))
    .autocomplete(autocomplete);
}

export interface CreateContentOptionWithDefaultValueOptions {
  defaultValue: FapContentType;
}
