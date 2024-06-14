export const compact = <T>(array: T[]): NonNullable<T>[] => {
  return array.filter(item => {
    return item !== null && item !== undefined;
  }) as NonNullable<T>[];
}
