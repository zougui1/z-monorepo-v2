export const includesEvery = <T>(array: T[], searchElements: T[]): boolean => {
  if (!searchElements.length) {
    return false;
  }

  return searchElements.every(searchElement => array.includes(searchElement));
}
