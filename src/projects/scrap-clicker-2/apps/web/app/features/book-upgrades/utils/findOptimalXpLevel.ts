import { range, sum } from 'radash';

import { getBookUpgradeCost } from './getBookUpgradeCost';

const bookLevelThreshold = 100;

export const findOptimalXpLevel = (options: FindOptimalXpLevelOptions): FindOptimalXpLevelResults | undefined => {
  return internalFindOptimalXpLevel({
    ...options,
    currentBookLevel: options.bookLevel,
  });
}

const internalFindOptimalXpLevel = (options: InternalFindOptimalXpLevelOptions): FindOptimalXpLevelResults | undefined => {
  const { bookLevel, currentBookLevel, xpLevel, optimalXpRatio, books } = options;

  const optimalXpLevel = Math.round(bookLevel * optimalXpRatio);

  if (xpLevel >= optimalXpLevel) {
    return { xpLevel: optimalXpLevel, bookLevel: bookLevel, remainingBooks: books };
  }

  const upgradeLevels = [...range(xpLevel, optimalXpLevel - 1)];
  const upgradeCosts = upgradeLevels.map(xpLevel => getBookUpgradeCost(xpLevel));
  const totalUpgradeCost = sum(upgradeCosts);

  if (totalUpgradeCost <= books) {
    return { xpLevel: optimalXpLevel, bookLevel: bookLevel, remainingBooks: books - totalUpgradeCost };
  }

  // safe guard to prevent infinite recursion
  if (bookLevel >= (currentBookLevel + bookLevelThreshold)) {
    return;
  }

  const nextBookLevel = bookLevel + 1;
  const nextBooks = books + nextBookLevel;
  const nextXpLevel = xpLevel + 1;
  const affordableNextXpLevel = totalUpgradeCost <= nextBooks ? nextXpLevel : xpLevel;
  const remainingNextBooks = nextBooks - totalUpgradeCost;
  const actualNextBooks = affordableNextXpLevel === xpLevel ? nextBooks : remainingNextBooks;

  return internalFindOptimalXpLevel({
    bookLevel: nextBookLevel,
    xpLevel: affordableNextXpLevel,
    books: actualNextBooks,
    optimalXpRatio,
    currentBookLevel,
  });
}

export interface FindOptimalXpLevelOptions {
  bookLevel: number;
  xpLevel: number;
  optimalXpRatio: number;
  books: number;
}

interface InternalFindOptimalXpLevelOptions extends FindOptimalXpLevelOptions {
  currentBookLevel: number;
}

export interface FindOptimalXpLevelResults {
  xpLevel: number;
  bookLevel: number;
  remainingBooks: number;
}
