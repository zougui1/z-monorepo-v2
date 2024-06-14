import type { ValueOf } from 'type-fest';

import type { AnyObject } from '@zougui/common.type-utils';

export const mapObject = <T extends AnyObject, TRet>(obj: T, iteratee: (value: ValueOf<T>, key: keyof T) => TRet): Record<keyof T, TRet> => {
  const entries = Object.entries(obj);
  const newEntries = entries.map(([key, value]) => [key, iteratee(value, key)]);
  return Object.fromEntries(newEntries);
}
