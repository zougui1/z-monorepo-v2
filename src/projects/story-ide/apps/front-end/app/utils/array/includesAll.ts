export const includesAll = <T>(arr: T[], includes: T[]): boolean => {
  return includes.every(include => arr.includes(include));
}
