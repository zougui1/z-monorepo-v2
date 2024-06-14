import { calculateStarFragmentCost } from './calculateStarFragmentCost';
import { calculateGoldenScrapCost } from './calculateGoldenScrapCost';
import { calculateMagnetCost } from './calculateMagnetCost';
import { calculateScrapyardModifier } from './calculateScrapyardModifier';

const starCount = 10;

export function calculateStarCost(options: CalculateStarCostOptions): CalculationResults {
  const { currentStarLevel, targetStarLevel, scrapyardLevel } = options;

  const scrapyardMul = calculateScrapyardModifier(scrapyardLevel);
  let goldenScrapCost = 0;
  let magnetCost = 0;
  let starFragmentCost = 0;

  for (let index = currentStarLevel; index < targetStarLevel; index++) {
    goldenScrapCost += calculateGoldenScrapCost(index, scrapyardMul);
    magnetCost += calculateMagnetCost(index, scrapyardMul);
    starFragmentCost += calculateStarFragmentCost(index, scrapyardMul);
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
}

export interface CalculationResults {
  goldenScraps: number;
  magnets: number;
  starFragments: number;
}
