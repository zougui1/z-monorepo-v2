import type { AnyObject } from '@zougui/common.type-utils';

export type MergeDifferences<T1 extends AnyObject, T2 extends AnyObject> = {
  [Key in keyof T1 | keyof T2]: T1 extends { [K in Key]: any }
  ? T2 extends { [K in Key]: any }
  ? (T1[Key] | T2[Key])
  : (T1[Key] | undefined)
  : T2 extends { [K in Key]: any }
  ? (T2[Key] | undefined)
  : never;
};
