import type { MongoObject } from '../../schema';

export type IntersectMongoDifferences<T1 extends MongoObject<any>, T2 extends MongoObject<any>> = (
  MongoObject<IntersectDifferences<T1['_shape'], T2['_shape']>>
);

type IntersectDifferences<T1 extends MongoObject<any>, T2 extends MongoObject<any>> = {
  [Key in keyof T1 | keyof T2]: T1 extends { [K in Key]: any }
  ? T2 extends { [K in Key]: any }
  ? (T1[Key] & T2[Key])
  : T1[Key]
  : T2 extends { [K in Key]: any }
  ? T2[Key]
  : never;
};
