export const includesSome = <T>(array: T[], searchElements: T[]): boolean => {
  return searchElements.some(searchElement => array.includes(searchElement));
}
