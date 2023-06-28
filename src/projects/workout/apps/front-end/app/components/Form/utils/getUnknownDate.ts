export const getUnknownDate = (value: unknown, getDate: (value: unknown) => unknown): unknown => {
  if(value instanceof Date) {
    return value;
  }

  // return date or null (must not return undefined)
  return getDate(value) ?? null;
}
