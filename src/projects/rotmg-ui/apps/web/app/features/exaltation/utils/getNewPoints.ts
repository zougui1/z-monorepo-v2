import { getMaxExaltationPoints } from './getMaxExaltationPoints';

export const getNewPoints = (level: number, newLevel: number, points: number): number => {
  if (newLevel < level) {
    return getMaxExaltationPoints(newLevel) + points;
  }

  if (newLevel > level) {
    return points - getMaxExaltationPoints(level);
  }

  return points;
}
