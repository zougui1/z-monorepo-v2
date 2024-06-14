import zod from 'zod';

import { getIsScientificNumber } from '~/utils/number';

export const dataSchema = zod.object({
  stars: zod.number().positive().int(),
  scrapyardV2: zod.number().min(0).int(),
  targetStar: zod.number().positive().int(),
  bookLevel: zod.number().min(0).int(),
  xpBookLevelRatio: zod.number().min(0).max(100),
  resources: zod.object({
    goldenScraps: zod.string().refine(getIsScientificNumber),
    magnets: zod.string().refine(getIsScientificNumber),
    starFragments: zod.string().refine(getIsScientificNumber),
    books: zod.number().min(0).int(),
  }),
  bookUpgrades: zod.object({
    magnets: zod.number().min(0).int(),
    goldenScraps: zod.number().min(0).int(),
    starFragments: zod.number().min(0).int(),
    xp: zod.number().min(0).int(),
    wrenches: zod.number().min(0).int(),
    ironScraps: zod.number().min(0).int(),
  }),
}).refine(data => {
  return data.targetStar > data.stars;
}, {
  message: 'The target star must be greater than the current stars',
  path: ['targetStar'],
});

export type Data = zod.infer<typeof dataSchema>;

export * from 'zod';
