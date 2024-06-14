export const getNewLevel = (level: number, points: number, maxPoints: number): number => {
  if (points < 0) {
    return level - 1;
  }

  if (points >= maxPoints) {
    return level + 1;
  }

  return level;
}
