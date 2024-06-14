import zod from 'zod';
import type { SetOptional } from 'type-fest';

import { MongoType, BaseMongoTypeDef } from './base';
import { MongoTypeName } from '../MongoTypeName';

export class MongoDefault<T extends MongoType> extends MongoType<zod.ZodDefault<T['_schema']>, MongoDefaultDef<T>> {
  _bsonTypeName!: T['_bsonTypeName'];

  static create<T extends MongoType>(params: SetOptional<Omit<MongoDefaultDef<T>, 'typeName'>, 'coerce'>): MongoDefault<T> {
    return new MongoDefault({
      coerce: false,
      ...params,
      typeName: MongoTypeName.MongoDefault,
    });
  }

  toZod(): zod.ZodDefault<T['_schema']> {
    return this._def.type.toZod().default(this._def.defaultValue);
  }
}

export interface MongoDefaultDef<T extends MongoType> extends BaseMongoTypeDef<T['_output']> {
  typeName: MongoTypeName.MongoDefault;
  type: T;
  defaultValue: T['_output'] | (() => T['_output']);
}
