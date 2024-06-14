import { MongoArray, MongoDefault, MongoNumber, MongoOptional, MongoString, MongoType } from './prototype/schema-v2';

/*namespace Before {
  export type ResolveType<Value extends MongoType, OriginalType extends MongoType> = (
    ResolveDeepType<Value, OriginalType>
  );

  export type ResolveShallowType<Value extends MongoType, OriginalType extends MongoType> = (
    OriginalType extends MongoOptional<any>
    ? MongoOptional<Value>
    : OriginalType extends MongoDefault<any>
    ? MongoDefault<Value>
    : OriginalType extends MongoArray<any>
    ? MongoArray<Value>
    : Value
  );

  export type ResolveDeepType<Value extends MongoType, OriginalType extends MongoType> = (
    OriginalType extends MongoOptional<MongoDefault<MongoArray<any>>>
    ? MongoOptional<MongoDefault<MongoArray<Value>>>
    : OriginalType extends MongoDefault<MongoOptional<MongoArray<any>>>
    ? MongoDefault<MongoOptional<MongoArray<Value>>>
    : OriginalType extends MongoDefault<MongoOptional<any>>
    ? MongoDefault<MongoOptional<Value>>
    : OriginalType extends MongoOptional<MongoDefault<any>>
    ? MongoOptional<MongoDefault<Value>>
    : OriginalType extends MongoDefault<MongoArray<any>>
    ? MongoDefault<MongoArray<Value>>
    : OriginalType extends MongoOptional<MongoArray<any>>
    ? MongoOptional<MongoArray<Value>>
    : ResolveShallowType<Value, OriginalType>
  );

  type Test = ResolveType<
    MongoString,
    MongoOptional<MongoDefault<MongoArray<MongoNumber>>>
  >;
}*/

namespace After {
  export type ResolveType<Value extends MongoType, OriginalType extends MongoType> = (
    OriginalType extends MongoOptional<any>
    ? MongoOptional<ResolveType<Value, OriginalType['_def']['type']>>
    : OriginalType extends MongoDefault<any>
    ? MongoDefault<ResolveType<Value, OriginalType['_def']['type']>>
    : OriginalType extends MongoArray<any>
    ? MongoArray<ResolveType<Value, OriginalType['_def']['items']>>
    : Value
  );

  /*export type ResolveDeepType<Value extends MongoType, OriginalType extends MongoType> = (
    OriginalType extends MongoOptional<any>
    ? MongoOptional<ResolveDeepType<Value, OriginalType['_def']['type']>>
    : OriginalType extends MongoDefault<any>
    ? MongoDefault<ResolveDeepType<Value, OriginalType['_def']['type']>>
    : OriginalType extends MongoArray<any>
    ? MongoArray<ResolveDeepType<Value, OriginalType['_def']['items']>>
    : Value
  );*/

  /*type Test = ResolveType<
    MongoString,
    MongoOptional<MongoDefault<MongoArray<MongoNumber>>>
  >;*/
}
