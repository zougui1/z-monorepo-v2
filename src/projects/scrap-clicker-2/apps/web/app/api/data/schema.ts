import zod from 'zod';
import { isNumber } from 'radash';

import { getIsScientificNumber } from '~/utils/number';

const checkResourceValue = (value: string): boolean => {
  return isNumber(Number(value)) || getIsScientificNumber(value);
}

export const dataSchema = zod.object({
  stars: zod.number().min(0).int(),
  scrapyardV2: zod.number().min(0).int(),
  targetStar: zod.number().positive().int(),
  masteryBoostLevel: zod.number().min(0).int().default(0),
  resources: zod.object({
    goldenScraps: zod.string().refine(checkResourceValue),
    magnets: zod.string().refine(checkResourceValue),
    starFragments: zod.string().refine(checkResourceValue),
  }),
  achievements: zod.object({
    reducedStarCost: zod.number().min(0).int().default(0),
  }).default({}),
}).refine(data => {
  return data.targetStar > data.stars;
}, {
  message: 'The target star must be greater than the current stars',
  path: ['targetStar'],
});

export type Data = zod.infer<typeof dataSchema>;

export * from 'zod';
