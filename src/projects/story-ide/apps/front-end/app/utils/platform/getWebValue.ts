import { isWeb } from '.'

/**
 * return a the returned value from the function get when in a web environment otherwise return the default value
 * @param get
 * @param defaultValue
 * @returns
 */
export const getWebValue = <T>(get: () => T, defaultValue: T): T => {
  if (isWeb) {
    return get();
  }

  return defaultValue;
}
