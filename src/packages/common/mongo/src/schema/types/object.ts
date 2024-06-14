import zod from 'zod';

import { MongoType, BaseMongoTypeDef } from './base';
import { MongoTypeName } from '../MongoTypeName';
import { BsonTypeName } from '../BsonTypeName';
import type { MaskOmit, MaskPick } from '../../types';

export class MongoObject<T extends MongoRawShape = MongoRawShape> extends MongoType<zod.ZodObject<MongoToZodRawShape<T>>, MongoObjectDef<T>> {
  _shape!: T;
  _bsonTypeName!: `${BsonTypeName.Object}`;

  static create<T extends MongoRawShape>(shape: T): MongoObject<T> {
    return new MongoObject({
      typeName: MongoTypeName.MongoObject,
      coerce: false,
      shape,
    });
  }

  pick<Mask extends Partial<Record<keyof T, boolean>>>(mask: Mask): MongoObject<MaskPick<T, Mask>> {
    const shape = Object.entries(this._def.shape).reduce((acc, [key, value]) => {
      if (mask[key]) {
        (acc as any)[key] = value;
      }

      return acc;
    }, {} as MaskPick<T, Mask>);

    return MongoObject.create(shape);
  }

  omit<Mask extends Partial<Record<keyof T, boolean>>>(mask: Mask): MongoObject<MaskOmit<T, Mask>> {
    const shape = Object.entries(this._def.shape).reduce((acc, [key, value]) => {
      if (!mask[key]) {
        (acc as any)[key] = value;
      }

      return acc;
    }, {} as MaskOmit<T, Mask>);

    return MongoObject.create(shape);
  }

  select<Key extends keyof T>(keys: Key[]): MongoObject<Pick<T, Key>> {
    const shape = Object.entries(this._def.shape).reduce((acc, [key, value]) => {
      if (keys.includes(key as Key)) {
        (acc as any)[key] = value;
      }

      return acc;
    }, {} as Pick<T, Key>);

    return MongoObject.create(shape);
  }

  unselect<Key extends keyof T>(keys: Key[]): MongoObject<Pick<T, Key>> {
    const shape = Object.entries(this._def.shape).reduce((acc, [key, value]) => {
      if (!keys.includes(key as Key)) {
        (acc as any)[key] = value;
      }

      return acc;
    }, {} as Pick<T, Key>);

    return MongoObject.create(shape);
  }

  extend<Augmentation extends MongoRawShape>(augmentation: Augmentation): MongoObject<T & Augmentation> {
    return MongoObject.create({
      ...this._def.shape,
      ...augmentation,
    });
  }

  toZod(): zod.ZodObject<MongoToZodRawShape<T>> {
    const zodShape = Object.entries(this._def.shape).reduce((acc, [name, schema]) => {
      acc[name] = schema.toZod();
      return acc;
    }, {} as zod.ZodRawShape);

    return zod.object(zodShape as MongoToZodRawShape<T>);
  }
}

export interface MongoObjectDef<T extends MongoRawShape = MongoRawShape> extends BaseMongoTypeDef<zod.ZodObject<MongoToZodRawShape<T>>['_output']> {
  typeName: MongoTypeName.MongoObject;
  shape: T;
}

export type MongoRawShape = {
  [key: string | number | symbol]: MongoType;
};

export type MongoToZodRawShape<T extends MongoRawShape> = {
  [Key in keyof T]: T[Key]['_schema'];
};
