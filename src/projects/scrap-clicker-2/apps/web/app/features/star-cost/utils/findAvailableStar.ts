import { calculateStarFragmentCost } from './calculateStarFragmentCost';
import { calculateGoldenScrapCost } from './calculateGoldenScrapCost';
import { calculateMagnetCost } from './calculateMagnetCost';
import { calculateScrapyardModifier } from './calculateScrapyardModifier';
import { isNumber } from 'radash';

const starCount = 10;
const REDUCED_STAR_COST_PERCENT_PER_LEVEL = 0.001;
const starThreshold = 20_000;

export function findAvailableStar(options: FindAvailableStarOptions): number {
  const currrentResources = {
    goldenScraps: Number(options.resources.goldenScraps),
    magnets: Number(options.resources.magnets),
    starFragments: Number(options.resources.starFragments),
  };

  if (
    !isNumber(currrentResources.goldenScraps) ||
    !isNumber(currrentResources.magnets) ||
    !isNumber(currrentResources.starFragments)
  ) {
    return options.currentStarLevel;
  }

  const reducedStarCost = options.achievements.reducedStarCost * REDUCED_STAR_COST_PERCENT_PER_LEVEL;
  const max = options.currentStarLevel + starThreshold;

  const scrapyardMul = calculateScrapyardModifier(options.scrapyardLevel);
  let goldenScrapCost = 0;
  let magnetCost = 0;
  let starFragmentCost = 0;

  for (let index = options.currentStarLevel; index < max; index++) {
    goldenScrapCost += calculateGoldenScrapCost(index, scrapyardMul) * starCount * (1 - reducedStarCost);
    magnetCost += calculateMagnetCost(index, scrapyardMul) * starCount * (1 - reducedStarCost);
    starFragmentCost += calculateStarFragmentCost(index, scrapyardMul) * starCount * (1 - reducedStarCost);

    if (
      currrentResources.goldenScraps < goldenScrapCost ||
      currrentResources.magnets < magnetCost ||
      currrentResources.starFragments < starFragmentCost
    ) {
      return index;
    }
  }

  return max;
}

export interface FindAvailableStarOptions {
  currentStarLevel: number;
  scrapyardLevel: number;
  targetStarLevel: number;
  resources: {
    goldenScraps: string;
    magnets: string;
    starFragments: string;
  };
  achievements: {
    reducedStarCost: number;
  };
}
