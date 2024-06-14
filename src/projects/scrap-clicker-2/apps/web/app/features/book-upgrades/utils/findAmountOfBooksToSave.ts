import { getBookUpgradeCost } from './getBookUpgradeCost';

export const findAmountOfBooksToSave = (options: FindAmountOfBooksToSaveOptions): number => {
  const { bookLevel, xpLevel, optimalXpRatio } = options;

  const nextBookLevel = bookLevel + 1;
  const optimalNextXpLevel = Math.round(nextBookLevel * optimalXpRatio);

  if (optimalNextXpLevel <= xpLevel) {
    return 0;
  }

  return Math.max(0, getBookUpgradeCost(xpLevel) - nextBookLevel);
}

export interface FindAmountOfBooksToSaveOptions {
  bookLevel: number;
  xpLevel: number;
  optimalXpRatio: number;
}
