export const isNullish = (value: unknown): value is undefined | null => {
  return value === undefined || value === null;
}
