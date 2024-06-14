import zod from 'zod';

import { MongoType, BaseMongoTypeDef } from './base';
import { MongoTypeName } from '../MongoTypeName';
import { BsonTypeName } from '../BsonTypeName';

export class MongoArray<T extends MongoType> extends MongoType<zod.ZodArray<T['_schema']>, MongoArrayDef<T>> {
  _bsonTypeName!: `${BsonTypeName.Array}`;

  static create<T extends MongoType>(items: T): MongoArray<T> {
    return new MongoArray({
      typeName: MongoTypeName.MongoArray,
      coerce: false,
      items,
    });
  }

  toZod(): zod.ZodArray<T['_schema']> {
    return zod.array(this._def.items.toZod());
  }
}

export interface MongoArrayDef<T extends MongoType> extends BaseMongoTypeDef<zod.ZodArray<T['_schema']>['_output']> {
  typeName: MongoTypeName.MongoArray;
  items: T;
}
