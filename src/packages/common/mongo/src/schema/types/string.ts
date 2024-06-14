import zod from 'zod';

import { MongoType, BaseMongoTypeDef } from './base';
import { MongoTypeName } from '../MongoTypeName';
import { BsonTypeName } from '../BsonTypeName';

export class MongoString extends MongoType<zod.ZodString, MongoStringDef> {
  _bsonTypeName!: `${BsonTypeName.String}`;

  static create(params?: Partial<Omit<MongoStringDef, 'typeName'>>): MongoString {
    return new MongoString({
      coerce: false,
      ...params,
      typeName: MongoTypeName.MongoString,
    });
  }

  toZod(): zod.ZodString {
    let schema = this._def.coerce ? zod.coerce.string() : zod.string();

    if (this._def.minLength !== undefined) {
      schema = schema.min(this._def.minLength);
    }

    if (this._def.maxLength !== undefined) {
      schema = schema.max(this._def.maxLength);
    }

    if (this._def.regex !== undefined) {
      schema = schema.regex(this._def.regex);
    }

    if (this._def.toLowerCase) {
      schema = schema.toLowerCase();
    }

    if (this._def.toUpperCase) {
      schema = schema.toUpperCase();
    }

    if (this._def.trim) {
      schema = schema.trim();
    }

    return schema;
  }

  toLowerCase(): MongoString {
    return new MongoString({
      ...this._def,
      toLowerCase: true,
    });
  }

  toUpperCase(): MongoString {
    return new MongoString({
      ...this._def,
      toUpperCase: true,
    });
  }

  trim(): MongoString {
    return new MongoString({
      ...this._def,
      trim: true,
    });
  }

  regex(regex: RegExp): MongoString {
    return new MongoString({
      ...this._def,
      regex,
    });
  }

  minLength(minLength: number): MongoString {
    return new MongoString({
      ...this._def,
      minLength,
    });
  }

  maxLength(maxLength: number): MongoString {
    return new MongoString({
      ...this._def,
      maxLength,
    });
  }
}

export interface MongoStringDef extends BaseMongoTypeDef<string> {
  typeName: MongoTypeName.MongoString;
  toLowerCase?: boolean;
  toUpperCase?: boolean;
  trim?: boolean;
  regex?: RegExp;
  minLength?: number;
  maxLength?: number;
  objectId?: boolean;
}
