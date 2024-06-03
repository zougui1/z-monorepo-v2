import { z } from 'zod';

import { ShowSource } from '../../../ShowSource';
import { Option } from '../../../../../discord';

const sources = [
  ShowSource.Netflix,
  ShowSource.AmazonVideo,
  ShowSource.Crunchyroll,
  ShowSource.Wcostream,
] as const;

export const sourceOption = new Option(
  'source',
  'Source of the show',
  z.enum(sources).default(ShowSource.Netflix),
)
  .autocomplete(({ value }) => {
    const valueLower = value.toLowerCase();
    return sources.filter(source => source.toLowerCase().includes(valueLower));
  });
