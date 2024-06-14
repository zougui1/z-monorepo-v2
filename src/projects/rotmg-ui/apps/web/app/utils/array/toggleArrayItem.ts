const defaultPredicate = Object.is;

export const toggleArrayItem = <T>(
  array: T[],
  value: T,
  predicate: ToggleArrayItemPredicate<T> = defaultPredicate,
): T[] => {
  if (array.some(item => predicate(item, value))) {
    return array.filter(item => !predicate(item, value));
  }

  return [...array, value];
}

export type ToggleArrayItemPredicate<T> = (item: T, value: T) => unknown;
