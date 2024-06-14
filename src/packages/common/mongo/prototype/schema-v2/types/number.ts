import zod from 'zod';

import { MongoType, BaseMongoTypeDef } from './base';
import { MongoTypeName, BsonTypeName } from '../MongoTypeName';

export class MongoNumber extends MongoType<number, MongoNumberDef> {
  readonly _bsonTypeName: `${BsonTypeName.Number}` = BsonTypeName.Number;
  /*readonly _operator!: {
    comparison: {
      '==': number;
      '!=': number;
      '>': number;
      '>=': number;
      '<': number;
      '<=': number;
      in: number[];
      nin: number[];
    };
  };*/

  static create(params?: Partial<Omit<MongoNumberDef, 'typeName'>>): MongoNumber {
    return new MongoNumber({
      coerce: false,
      ...params,
      typeName: MongoTypeName.MongoNumber,
    });
  }

  toZod(): zod.ZodNumber {
    let schema = this._def.coerce ? zod.coerce.number() : zod.number();

    if (this._def.min !== undefined) {
      schema = schema.min(this._def.min);
    }

    if (this._def.max !== undefined) {
      schema = schema.max(this._def.max);
    }

    return schema;
  }

  min(min: number): MongoNumber {
    return new MongoNumber({
      ...this._def,
      min,
    });
  }

  max(max: number): MongoNumber {
    return new MongoNumber({
      ...this._def,
      max,
    });
  }
}

export interface MongoNumberDef extends BaseMongoTypeDef<number> {
  typeName: MongoTypeName.MongoNumber;
  min?: number;
  max?: number;
}
