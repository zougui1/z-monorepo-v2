import { type Multipliers } from '../types';

export const calculateGoldenScrapCost = (starLevel: number, multipliers: Multipliers): number => {
  // adjust for first 10 stars
  let cost = 100000 * (starLevel - 10) + 250000;

  if (starLevel >= 20) cost *= 1.3;
  if (starLevel >= 30) cost *= 1.3;
  if (starLevel >= 60) cost *= 1.3;
  if (starLevel >= 80) cost *= 1.3;
  if (starLevel >= 90) cost *= 1.3;
  if (starLevel >= 100) cost *= 1.3;
  if (starLevel >= 150) cost *= 1.1;
  if (starLevel >= 160) cost *= 1.1;
  if (starLevel >= 170) cost *= 1.1;
  if (starLevel >= 180) cost *= 1.1;
  if (starLevel >= 190) cost *= 1.1;
  if (starLevel >= 200) cost *= 1.1;
  if (starLevel >= 210) cost *= 1.1;
  if (starLevel >= 220) cost *= 1.1;
  if (starLevel >= 230) cost *= 1.1;
  if (starLevel >= 250) cost *= 1.1;
  if (starLevel >= 300) cost *= 1.1;
  if (starLevel >= 350) cost *= 1.1;
  if (starLevel >= 400) cost *= 1.1;
  if (starLevel >= 450) cost *= 1.1;
  if (starLevel >= 500) cost *= 1.1;
  if (starLevel >= 550) cost *= 1.1;

  return Math.floor((cost * 100) * multipliers.achievement * multipliers.masteryBoost / ((multipliers.scrapyard + 100) * 1000));
}
