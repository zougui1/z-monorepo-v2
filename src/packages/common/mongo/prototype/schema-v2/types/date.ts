import zod from 'zod';

import { MongoType, BaseMongoTypeDef } from './base';
import { MongoTypeName, BsonTypeName } from '../MongoTypeName';

export class MongoDate extends MongoType<Date, MongoDateDef> {
  readonly _bsonTypeName: `${BsonTypeName.Date}` = BsonTypeName.Date;
  /*readonly _operator!: {
    comparison: {
      '==': Date;
      '!=': Date;
      '>': Date;
      '>=': Date;
      '<': Date;
      '<=': Date;
      in: Date[];
      nin: Date[];
    };
  };*/

  static create(params?: Partial<Omit<MongoDateDef, 'typeName'>>): MongoDate {
    return new MongoDate({
      coerce: false,
      ...params,
      typeName: MongoTypeName.MongoDate,
    });
  }

  toZod(): zod.ZodDate {
    let schema = this._def.coerce ? zod.coerce.date() : zod.date();

    if (this._def.min !== undefined) {
      schema = schema.min(this._def.min);
    }

    if (this._def.max !== undefined) {
      schema = schema.max(this._def.max);
    }

    return schema;
  }

  min(min: Date): MongoDate {
    return new MongoDate({
      ...this._def,
      min,
    });
  }

  max(max: Date): MongoDate {
    return new MongoDate({
      ...this._def,
      max,
    });
  }
}

export interface MongoDateDef extends BaseMongoTypeDef<Date> {
  typeName: MongoTypeName.MongoDate;
  min?: Date;
  max?: Date;
}
