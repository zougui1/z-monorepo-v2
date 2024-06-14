import type {
  MongoObject,
  MongoUndefined,
  MongoRawShape,
  MongoUnion,
  MongoUnionOptions,
  MongoOptional,
  MongoType,
  MongoNull,
} from '../../prototype/schema-v2';

type RequiredKeys<T extends object> = NonNullable<{
  [Key in keyof T]: (undefined | null) extends T[Key] ? never : Key;
}[keyof T]>;
type OptionalKeys<T extends object> = NonNullable<{
  [Key in keyof T]: (undefined | null) extends T[Key] ? Key : never;
}[keyof T]>;

export type MergeMongoDifferences<T1 extends object, T2 extends object> = (
  MergeDifferences<T1, T2> extends infer O ? { [K in keyof O]: O[K] } : never
);

type MergeDifferences<T1 extends object, T2 extends object> = ({
  [Key in RequiredKeys<T1 | T2>]: MergeDifferencesProperty<T1, T2, Key>;
} & {
  [Key in OptionalKeys<T1 | T2>]?: MergeDifferencesProperty<T1, T2, Key>;
}) extends infer O ? { [K in keyof O]: O[K] } : never;

type MergeDifferencesProperty<T1 extends object, T2 extends object, Key extends keyof T1 | keyof T2> = (
  T1 extends { [K in Key]: any }
  ? T2 extends { [K in Key]: any }
  ? MongoExtract<T1[Key], T2[Key]>
  : (T1[Key] | undefined)
  : T2 extends { [K in Key]: any }
  ? (T2[Key] | undefined)
  : never
);

type ExtractRequiredType<MaybeOptional, T2> = (
  // if both types are optional then the wanted type has to stay optional
  // if the wanted type is optional but not the other type
  // then the wanted type is required
  // otherwise the wanted type stay as is
  Extract<MaybeOptional, null | undefined> extends (null | undefined)
  ? Extract<T2, null | undefined> extends (null | undefined)
  ? MaybeOptional
  : NonNullable<MaybeOptional>
  : MaybeOptional
);

type MongoExtract<
  T1,
  T2,
  Type1 = ExtractRequiredType<T1, T2>,
  Type2 = ExtractRequiredType<T2, T1>,
> = (
  Extract<Type1, null | undefined> extends (null | undefined)
  ? Type1
  : Extract<Type2, null | undefined> extends (null | undefined)
  ? Type2
  : MergeMongoTypes<Type1, Type2>
);

type MergeObjects<T1 extends object, T2 extends object> = {
  [K in keyof T1 | keyof T2]: MergeObjectsProperty<T1, T2, K>;
} extends infer O ? { [K in keyof O]: O[K] } : never;

type MergeObjectsProperty<T1 extends object, T2 extends object, K extends keyof T1 | keyof T2> = (
  K extends keyof T2 ? T2[K] : K extends keyof T1 ? T1[K] : never
);

type MergeMongoTypes<T1, T2> = (
  T1 extends object
  ? T2 extends object
  ? MongoObject<MergeObjects<T1, T2>>
  : T1 | T2
  : T1 | T2
);
