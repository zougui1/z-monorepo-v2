import { calculateStarFragmentCost } from './calculateStarFragmentCost';
import { calculateGoldenScrapCost } from './calculateGoldenScrapCost';
import { calculateMagnetCost } from './calculateMagnetCost';
import { calculateScrapyardModifier } from './calculateScrapyardModifier';

const starCount = 10;

export function calculateStarCost(options: CalculateStarCostOptions): CalculationResults {
  const { currentStarLevel, targetStarLevel, scrapyardLevel, reducedStarCost } = options;

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
    goldenScraps: goldenScrapCost * starCount * (1 - reducedStarCost),
    magnets: magnetCost * starCount * (1 - reducedStarCost),
    starFragments: starFragmentCost * starCount * (1 - reducedStarCost),
  };
}

export interface CalculateStarCostOptions {
  currentStarLevel: number;
  targetStarLevel: number;
  scrapyardLevel: number;
  reducedStarCost: number;
}

export interface CalculationResults {
  goldenScraps: number;
  magnets: number;
  starFragments: number;
}
