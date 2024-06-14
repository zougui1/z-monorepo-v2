import zod from 'zod';

import { MongoType, BaseMongoTypeDef } from './base';
import { MongoTypeName, BsonTypeName } from '../MongoTypeName';
import type { MaskOmit, MaskPick, RequiredKeys } from '../../../types';

export class MongoObject<T extends MongoRawShape = MongoRawShape, Output extends ObjectOutputType<T> = ObjectOutputType<T>> extends MongoType<Output, MongoObjectDef<T, Output>> {
  _shape!: T;
  readonly _bsonTypeName: `${BsonTypeName.Object}` = BsonTypeName.Object;
  /*readonly _operator!: {
    comparison: {
      '==': T;
      '!=': T;
      in: T[];
      nin: T[];
    };
  };*/

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

export type ObjectOutputType<Shape extends MongoRawShape> = Flatten<AddQuestionMarks<BaseObjectOutputType<Shape>>>;
export type BaseObjectOutputType<Shape extends MongoRawShape> = { [K in keyof Shape]: Shape[K]["_output"]; } extends infer O ? { [K in keyof O]: O[K] } : never;
export type AddQuestionMarks<T extends object, R extends keyof T = RequiredKeys<T>> = Pick<Required<T>, R> & Partial<T>;
export type Flatten<T> = {
    [K in keyof T]: T[K];
} extends infer O ? { [K in keyof O]: O[K] } : never;

export interface MongoObjectDef<T extends MongoRawShape = MongoRawShape, Output extends ObjectOutputType<T> = ObjectOutputType<T>> extends BaseMongoTypeDef<Output> {
  typeName: MongoTypeName.MongoObject;
  shape: T;
}

export type MongoRawShape = {
  [key: string]: MongoType;
};

export type MongoToZodRawShape<T extends MongoRawShape> = {
  [Key in keyof T]: T[Key]['_schema'];
};
