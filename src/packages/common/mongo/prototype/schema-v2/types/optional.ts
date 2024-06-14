import zod from 'zod';
import type { SetOptional } from 'type-fest';

import { MongoType, BaseMongoTypeDef } from './base';
import { MongoTypeName } from '../MongoTypeName';

export class MongoOptional<T extends MongoType> extends MongoType<T['_output'] | undefined | null, MongoOptionalDef<T>> {
  readonly _bsonTypeName!: T['_bsonTypeName'];
  //readonly _operator!: T['_operator'];

  static create<T extends MongoType>(params: SetOptional<Omit<MongoOptionalDef<T>, 'typeName'>, 'coerce'>): MongoOptional<T> {
    return new MongoOptional({
      coerce: false,
      ...params,
      typeName: MongoTypeName.MongoOptional,
    });
  }

  toZod(): zod.ZodNullable<zod.ZodOptional<T['_schema']>> {
    return this._def.type.toZod().optional().nullable();
  }
}

export interface MongoOptionalDef<T extends MongoType> extends BaseMongoTypeDef<T['_output']> {
  typeName: MongoTypeName.MongoOptional;
  type: T;
}
