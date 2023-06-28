import { isNullish } from '../type';

export const compact = <T>(array: T[]): Exclude<T, undefined | null>[] => {
  return array.filter(value => !isNullish(value)) as Exclude<T, undefined | null>[];
}
