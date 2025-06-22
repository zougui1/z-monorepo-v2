import { calculateStarFragmentCost } from './calculateStarFragmentCost';
import { calculateGoldenScrapCost } from './calculateGoldenScrapCost';
import { calculateMagnetCost } from './calculateMagnetCost';
import { calculateScrapyardModifier } from './calculateScrapyardModifier';

const starCount = 10;

export function calculateStarCost(options: CalculateStarCostOptions): CalculationResults {
  const { currentStarLevel, targetStarLevel, scrapyardLevel, achievementLevel, masteryBoostLevel } = options;

  const multipliers = {
    scrapyard: calculateScrapyardModifier(scrapyardLevel),
    achievement: Math.max(0, 1000 - Math.max(0, achievementLevel * 2)),
    masteryBoost: Math.pow(0.99, Math.floor(masteryBoostLevel / 10)),
  };

  let goldenScrapCost = 0;
  let magnetCost = 0;
  let starFragmentCost = 0;

  for (let index = currentStarLevel; index < targetStarLevel; index++) {
    goldenScrapCost += calculateGoldenScrapCost(index, multipliers);
    magnetCost += calculateMagnetCost(index, multipliers);
    starFragmentCost += calculateStarFragmentCost(index, multipliers);
  }

  return {
    goldenScraps: goldenScrapCost * starCount,
    magnets: magnetCost * starCount,
    starFragments: starFragmentCost * starCount,
  };
}

export interface CalculateStarCostOptions {
  currentStarLevel: number;
  targetStarLevel: number;
  scrapyardLevel: number;
  achievementLevel: number;
  masteryBoostLevel: number;
}

export interface CalculationResults {
  goldenScraps: number;
  magnets: number;
  starFragments: number;
}
