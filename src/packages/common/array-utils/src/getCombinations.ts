const getCombinationsOfLength = <T>(array: T[], length: number): T[][] => {
  const combinations: T[][] = [];

  for (let i = 0; i < array.length; i++) {
    if (length === 1) {
      combinations.push([array[i]])
    } else {
      const remaining = getCombinationsOfLength(array.slice(i + 1, array.length), length - 1);

      for (const next of remaining) {
        combinations.push([array[i], ...next])
      }
    }
  }

  return combinations;
}

export const getCombinations = <T>(array: T[], options?: GetCombinationsOptions | undefined): T[][] => {
  // should never reach 0, but for type safety
  const maxLength = Math.min(options?.length ?? options?.maxLength ?? array.length, array.length);
  const minLength = Math.max(options?.length ?? options?.minLength ?? 1, 1);
  const combinations: T[][] = [];

  for (let length = minLength; length <= maxLength; length++) {
    combinations.push(...getCombinationsOfLength(array, length));
  }

  return combinations;
}

export interface GetCombinationsOptions {
  length?: number | undefined;
  minLength?: number | undefined;
  maxLength?: number | undefined;
}
