import type {
  MongoObject,
  MongoUndefined,
  MongoRawShape,
  MongoUnion,
  MongoUnionOptions,
  MongoOptional,
  MongoType,
  MongoNull,
} from '../../schema';

export type MergeMongoDifferences<T1 extends MongoObject<any>, T2 extends MongoObject<any>> = (
  MongoObject<MergeDifferences<T1['_shape'], T2['_shape']>>
) extends MongoObject<infer O> ? MongoObject<O> : never;

type MergeDifferences<T1 extends MongoRawShape, T2 extends MongoRawShape> = {
  [Key in keyof T1 | keyof T2]: MergeDifferencesProperty<T1, T2, Key>;
} extends infer O ? { [K in keyof O]: O[K] } : never;

type MergeDifferencesProperty<T1 extends MongoRawShape, T2 extends MongoRawShape, Key extends keyof T1 | keyof T2> = (
  T1 extends { [K in Key]: any }
  ? T2 extends { [K in Key]: any }
  ? MongoExtract<T1[Key], T2[Key]>
  : (T1[Key] | MongoUndefined)
  : T2 extends { [K in Key]: any }
  ? (T2[Key] | MongoUndefined)
  : never
);

type ExtractRequiredType<MaybeOptional extends MongoType, T2 extends MongoType> = (
  // if both types are optional then the wanted type has to stay optional
  // if the wanted type is optional but not the other type
  // then the wanted type is required
  // otherwise the wanted type stay as is
  MaybeOptional extends MongoOptional<MongoType>
  ? T2 extends MongoOptional<MongoType>
  ? MaybeOptional
  : MaybeOptional['_def']['type']
  : MaybeOptional
);

type MongoExtract<
  T1 extends MongoType,
  T2 extends MongoType,
  Type1 extends MongoType = ExtractRequiredType<T1, T2>,
  Type2 extends MongoType = ExtractRequiredType<T2, T1>,
> = (
  Type1 extends MongoNull
  ? Type1
  : Type2 extends MongoNull
  ? Type2
  : Type1 extends MongoUnion
  ? MongoUnion<[ExtractMongoUnionOptions<Type1, InferOptionalUnionOptionsOrType<Type2>>]>
  : Type1 extends MongoOptional<MongoUnion>
  ? MongoOptional<MongoUnion<[ExtractMongoUnionOptions<Type1, InferOptionalUnionOptionsOrType<Type2>>]>>
  : Type2 extends MongoUnion
  ? MongoUnion<[ExtractMongoUnionOptions<Type2, InferOptionalUnionOptionsOrType<Type1>>]>
  : Type2 extends MongoOptional<MongoUnion>
  ? MongoOptional<MongoUnion<[ExtractMongoUnionOptions<Type2, InferOptionalUnionOptionsOrType<Type1>>]>>
  : MergeMongoTypes<Type1, Type2>
);

type MergeObjects<T1 extends object, T2 extends object> = {
  [K in keyof T1 | keyof T2]: MergeObjectsProperty<T1, T2, K>;
} extends infer O ? { [K in keyof O]: O[K] } : never;

type MergeObjectsProperty<T1 extends object, T2 extends object, K extends keyof T1 | keyof T2> = (
  K extends keyof T2 ? T2[K] : K extends keyof T1 ? T1[K] : never
);

type MergeMongoTypes<T1 extends MongoType, T2 extends MongoType> = (
  T1 extends MongoObject<any>
  ? T2 extends MongoObject<any>
  ? MongoObject<MergeObjects<T1['_shape'], T2['_shape']>>
  : T1 | T2
  : T1 | T2
);

type ExtractMongoUnionOptions<U extends OptionableUnion, T extends MongoType> = (
  Extract<InferOptionalUnionOptionsOrType<U>, T>
);

type OptionableUnion<T extends MongoUnionOptions = MongoUnionOptions> = MongoUnion<T> | MongoOptional<MongoUnion<T>>;

type InferUnionOptionsOrType<T extends MongoType> = T extends MongoUnion<MongoUnionOptions> ? T['_def']['options'][number] : T;
type InferOptionalUnionOptionsOrType<T extends MongoType> = T extends MongoUnion<MongoUnionOptions>
  ? InferUnionOptionsOrType<T>
  : T extends MongoOptional<MongoUnion<MongoUnionOptions>>
  ? InferUnionOptionsOrType<T['_def']['type']>
  : T;
