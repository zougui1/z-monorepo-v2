import type { Exaltation } from '~/api/classes';

import { getMaxExaltationPoints } from './getMaxExaltationPoints';
import { getNewLevel } from './getNewLevel';
import { getNewPoints } from './getNewPoints';

export const getNewExaltation = (currentExaltation: Exaltation, points: number): Exaltation => {
  const maxAttackPoints = getMaxExaltationPoints(currentExaltation.level);
  const newLevel = getNewLevel(currentExaltation.level, points, maxAttackPoints);
  const newPoints = getNewPoints(currentExaltation.level, newLevel, points);

  return {
    level: newLevel,
    points: newPoints,
  };
}
