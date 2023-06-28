export const toggle = <T>(array: T[], value: T, options?: ToggleOptions | undefined): T[] => {
  if (array.includes(value)) {
    if (options?.ensure === 'present') {
      return array;
    }

    return array.filter(item => item !== value);
  }

  if (options?.ensure === 'not-present') {
    return array;
  }

  return [...array, value];
}

export interface ToggleOptions {
  /**
   * if ensure = 'present' then ensure that the value is present in the array
   * if ensure = 'not-present' then ensure that the value is not present in the array
   * if ensure = undefined then toggle the presence of the value in the array
   */
  ensure: 'present' | 'not-present' | undefined;
}
