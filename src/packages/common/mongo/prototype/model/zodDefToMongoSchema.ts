import type mongoose from 'mongoose';

import type {
  ZodDef,
  StringZodDef,
  EnumZodDef,
  NumberZodDef,
  BigIntZodDef,
  BooleanZodDef,
  DateZodDef,
  ArrayZodDef,
  ObjectZodDef,
} from '@zougui/common.zod-def-parser';
import type { AnyObject, EnumValues } from '@zougui/common.type-utils';

import type { MongoRawShape, MongoObject } from '../prototype/schema-v2';
import type { ArrayItem } from '../types';

export const zodDefToMongoSchema = <T extends ZodDef>(def: T): MongoObjectSchema<T extends ObjectZodDef ? T['fields'] : never> => {
  if (def.type !== 'object') {
    throw new Error(`Schema must be an object. Got ${def.type}`);
  }

  return Object.entries(def.fields).reduce((acc, [name, fieldDef]) => {
    (acc as any)[name] = defToMongoSchema(fieldDef);
    return acc;
  }, {} as MongoObjectSchema<T extends ObjectZodDef ? T['fields'] : never>);
}

const defToMongoSchema = <T extends ZodDef>(def: T): AnyMongoSchemaType => {
  if (isDefType<ObjectZodDef>(def, 'object')) {
    return Object.entries(def.fields).reduce((acc, [name, fieldDef]) => {
      acc[name] = defToMongoSchema(fieldDef);
      return acc;
    }, {} as MongoObjectSchema<AnyObject>);
  }

  if (isDefType<ArrayZodDef>(def, 'array')) {
    return {
      type: [defToMongoSchema(def.items)],
      required: !def.optional && !def.nullable,
      default: def.defaultValue as any[] | undefined,
    };
  }

  if (isDefType<StringZodDef>(def, 'string')) {
    return {
      type: String,
      required: !def.optional && !def.nullable,
      default: def.defaultValue as string | undefined,
      minLength: findCheckValue(def.checks, 'min') as number | undefined,
      maxLength: findCheckValue(def.checks, 'max') as number | undefined,
    };
  }

  if (isDefType<EnumZodDef>(def, 'enum')) {
    return {
      type: String,
      required: !def.optional && !def.nullable,
      default: def.defaultValue as string | undefined,
      enum: def.values,
    };
  }

  if (isDefType<NumberZodDef | BigIntZodDef>(def, 'number')) {
    const format = 'format' in def && def.format;
    const common = {
      required: !def.optional && !def.nullable,
      default: def.defaultValue as number | undefined,
      min: findCheckValue(def.checks, 'min') as number | undefined,
      max: findCheckValue(def.checks, 'max') as number | undefined,
    };

    if (format === 'int64') {
      return {
        ...common,
        type: BigInt,
      };
    }

    return {
      ...common,
      type: Number,
    };
  }

  if (isDefType<DateZodDef>(def, 'date')) {
    return {
      type: Date,
      required: !def.optional && !def.nullable,
      default: def.defaultValue as Date | undefined,
      min: findCheckValue(def.checks, 'min') as Date | undefined,
      max: findCheckValue(def.checks, 'max') as Date | undefined,
    };
  }

  if (isDefType<BooleanZodDef>(def, 'boolean')) {
    return {
      type: Boolean,
      required: !def.optional && !def.nullable,
      default: def.defaultValue as boolean | undefined,
    };
  }

  throw new Error(`Unsupported schema type "${def.type}"`);
}

const findCheckValue = (checks: ZodAnyCheck[], kind: ZodAnyCheck['kind']): unknown => {
  const check = checks.find(check => check.kind === kind);

  if (check && 'value' in check) {
    return check.value;
  }
}

type ZodAnyCheck = (
  | Zod.ZodDateCheck
  | Zod.ZodBigIntCheck
  | Zod.ZodNumberCheck
  | Zod.ZodStringCheck
);

const isDefType = <Expected extends ZodDef>(def: ZodDef, expectedType: ZodDef['type']): def is Expected => {
  return def.type === expectedType;
}

export type MongoSchema = mongoose.SchemaDefinition<mongoose.SchemaDefinitionType<any>>;

export type ZodDefToMongoSchema<T extends ZodDef> = (
  T extends StringZodDef
  ? MongoStringSchema
  : T extends EnumZodDef
  ? MongoEnumSchema<T['values']>
  : T extends BigIntZodDef
  ? MongoBigIntSchema
  : T extends NumberZodDef
  ? MongoNumberSchema
  : T extends BooleanZodDef
  ? MongoBooleanSchema
  : T extends DateZodDef
  ? MongoDateSchema
  : T extends ArrayZodDef
  ? MongoArraySchema<T['items'][]>
  : T extends ObjectZodDef
  ? MongoObjectSchema<T['fields']>
  : never
);

export type AnyMongoSchemaType = (
  | MongoStringSchema
  | MongoEnumSchema<EnumValues<string>>
  | MongoBigIntSchema
  | MongoNumberSchema
  | MongoBooleanSchema
  | MongoDateSchema
  | MongoArraySchema<any[]>
  | MongoObjectSchema<AnyObject>
);

export type MongoStringSchema = {
  type: typeof String;
  required?: boolean | undefined;
  default?: string | (() => string) | undefined;
  minLength?: number | undefined;
  maxLength?: number | undefined;
};

export type MongoEnumSchema<Enum extends EnumValues<string>> = {
  type: typeof String;
  required?: boolean | undefined;
  default?: ArrayItem<Enum> | (() => ArrayItem<Enum>) | undefined;
  enum: Enum;
};

export type MongoNumberSchema = {
  type: typeof Number;
  required?: boolean | undefined;
  default?: number | (() => number) | undefined;
  min?: number | undefined;
  max?: number | undefined;
};

export type MongoBigIntSchema = {
  type: typeof BigInt;
  required?: boolean | undefined;
  default?: number | (() => number) | undefined;
  min?: number | undefined;
  max?: number | undefined;
};

export type MongoDateSchema = {
  type: typeof Date;
  required?: boolean | undefined;
  default?: Date | (() => Date) | undefined;
  min?: Date | undefined;
  max?: Date | undefined;
};

export type MongoBooleanSchema = {
  type: typeof Boolean;
  required?: boolean | undefined;
  default?: boolean | (() => boolean) | undefined;
};

export type MongoArraySchema<T extends any[]> = {
  type: T;
  required?: boolean | undefined;
  default?: T | (() => T) | undefined;
};

export type MongoObjectSchema<T extends AnyObject> = {
  [Key in keyof T]: ZodDefToMongoSchema<T[Key]>;
};
