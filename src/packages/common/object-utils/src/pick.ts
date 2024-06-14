export const pick = <T extends Record<string, any>, Key extends keyof T>(obj: T, keys: Key[]): Pick<T, Key> => {
  const acc = {} as Partial<T>;

  for (const key in obj) {
    if (Object.hasOwn(obj, key) && keys.map(String).includes(key)) {
      acc[key] = obj[key];
    }
  }

  return acc as Pick<T, Key>;
}
