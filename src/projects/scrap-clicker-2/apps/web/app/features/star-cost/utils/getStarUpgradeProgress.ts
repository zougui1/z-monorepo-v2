import { isNumber } from 'radash';

import { formatNumber, toPercent, formatPercent } from '~/utils/number';

import { calculateStarCost } from './calculateStarCost';

const maxPercent = 100;
const REDUCED_STAR_COST_PERCENT_PER_LEVEL = 0.001;

export const getStarUpgradeProgress = (data: StarUpgradeData): StarUpgradeProgressResult | undefined => {
  const currrentResources = {
    goldenScraps: Number(data.resources.goldenScraps),
    magnets: Number(data.resources.magnets),
    starFragments: Number(data.resources.starFragments),
  };

  const reducedStarCost = data.achievements.reducedStarCost * REDUCED_STAR_COST_PERCENT_PER_LEVEL;

  if (
    !isNumber(currrentResources.goldenScraps) ||
    !isNumber(currrentResources.magnets) ||
    !isNumber(currrentResources.starFragments)
  ) {
    return;
  }

  const targetResources = calculateStarCost({
    currentStarLevel: data.currentStarLevel,
    scrapyardLevel: data.scrapyardLevel,
    targetStarLevel: data.targetStarLevel,
    reducedStarCost,
  });

  const remainingResources = {
    goldenScraps: Math.max(0, targetResources.goldenScraps - currrentResources.goldenScraps),
    magnets: Math.max(0, targetResources.magnets - currrentResources.magnets),
    starFragments: Math.max(0, targetResources.starFragments - currrentResources.starFragments),
  };

  const percentResources = {
    goldenScraps: toPercent(currrentResources.goldenScraps, targetResources.goldenScraps),
    magnets: toPercent(currrentResources.magnets, targetResources.magnets),
    starFragments: toPercent(currrentResources.starFragments, targetResources.starFragments),
  };

  return {
    goldenScraps: {
      goal: formatNumber(targetResources.goldenScraps),
      remaining: formatNumber(remainingResources.goldenScraps),
      progress: formatPercent(percentResources.goldenScraps, { max: maxPercent }),
    },

    magnets: {
      goal: formatNumber(targetResources.magnets),
      remaining: formatNumber(remainingResources.magnets),
      progress: formatPercent(percentResources.magnets, { max: maxPercent }),
    },

    starFragments: {
      goal: formatNumber(targetResources.starFragments),
      remaining: formatNumber(remainingResources.starFragments),
      progress: formatPercent(percentResources.starFragments, { max: maxPercent }),
    },
  };
}

export interface StarUpgradeData {
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

export interface StarUpgradeProgressResult {
  goldenScraps: StarUpgradeResourceProgressResult;
  magnets: StarUpgradeResourceProgressResult;
  starFragments: StarUpgradeResourceProgressResult;
}

export interface StarUpgradeResourceProgressResult {
  goal: string;
  remaining: string;
  progress: string;
}
