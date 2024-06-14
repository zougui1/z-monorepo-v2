import {
  MongoArray,
  MongoBigInt,
  MongoBoolean,
  MongoNumber,
  MongoObject,
  MongoString,
  MongoEnum,
  MongoDate,
  MongoType,
  MongoOptional,
  MongoDefault,
  MongoRawShape,
  MongoUnion,
  MongoNull,
  MongoObjectId,
} from './types';

// TODO types:
  // TODO date: expires
  // TODO ObjectId

export const z = {
  array: MongoArray.create,
  object: MongoObject.create,
  string: MongoString.create,
  number: MongoNumber.create,
  boolean: MongoBoolean.create,
  bigInt: MongoBigInt.create,
  date: MongoDate.create,
  enum: MongoEnum.create,
  union: MongoUnion.create,
  null: MongoNull.create,
  objectId: MongoObjectId.create,

  coerce: {
    string: () => MongoString.create({ coerce: true }),
    number: () => MongoNumber.create({ coerce: true }),
    boolean: () => MongoBoolean.create({ coerce: true }),
    bigInt: () => MongoBigInt.create({ coerce: true }),
    date: () => MongoDate.create({ coerce: true }),
  },
};

export type MongoInfer<T extends MongoType> = T['_output'];

export type FindMongoObject<T extends MongoType = MongoType> = (
  T extends MongoOptional<MongoObject>
  ? T['_def']['type']
  : T extends MongoDefault<MongoObject>
  ? T['_def']['type']
  : T extends MongoObject
  ? T
  : T extends MongoOptional<MongoArray<MongoObject>>
  ? T['_def']['type']['_def']['items']
  : T extends MongoDefault<MongoArray<MongoObject>>
  ? T['_def']['type']['_def']['items']
  : T extends MongoArray<MongoObject>
  ? T['_def']['items']
  : never
);

export type AnyMongoObject = (
  | MongoObject<MongoRawShape>
  | MongoOptional<MongoObject<MongoRawShape>>
  | MongoDefault<MongoObject<MongoRawShape>>
);
