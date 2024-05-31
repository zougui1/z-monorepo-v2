export const compact = <T>(arr: T[]): Exclude<T, undefined | null>[] => {
  const compactArray = arr.filter(item => item !== undefined && item !== null);
  return compactArray as Exclude<T, undefined | null>[];
}
