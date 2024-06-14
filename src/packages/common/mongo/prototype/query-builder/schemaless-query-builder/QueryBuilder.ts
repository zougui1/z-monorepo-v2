import type { AnyObject, EnumValues } from '@zougui/common.type-utils';

import { AndBranchBuilder } from './AndBranchBuilder';
import { OrBranchBuilder } from './OrBranchBuilder';
import type { InferBranchSchema } from './BaseBranchBuilder';
import type {
  MongoObject,
  MongoRawShape,
  MongoInfer,
  FindMongoObject,
  MongoOptional,
  MongoType,
  MongoString,
  MongoNumber,
  MongoBoolean,
  MongoBigInt,
  MongoDate,
  MongoArray,
  MongoUnion,
  MongoNull,
  MongoUndefined,
  MongoDefault,
  MongoEnum,
  MongoObjectId,
} from '../schema-v2';
import type { MaskPick, ArrayItem, MaskOmit, MergeMongoDifferences } from '../types';
import { mandatoryDocumentSchema, type MandatoryDocumentSchema, type Model } from '../model';

export class QueryBuilder<
  M extends Model<MongoObject<MongoRawShape>> = Model<MongoObject<MongoRawShape>>,
  Schema extends MongoObject<MongoRawShape> = MongoObject<MongoRawShape>,
  IsDocument extends boolean = false,
  Reverse extends boolean = false,
  Shape extends Schema['_shape'] = Schema['_shape'],
> {
  readonly model: M;
  readonly schema: Schema;
  readonly isDocument: IsDocument;
  readonly reverse: Reverse;

  constructor(model: M, schema: Schema, isDocument: IsDocument, reverse: Reverse) {
    this.model = model;
    this.schema = schema;
    this.isDocument = isDocument;
    this.reverse = reverse;
  }

  private getPreservedMandatoryDocumentProperties(): (keyof MandatoryDocumentSchema['_shape'])[] {
    if (!this.isDocument) {
      return [];
    }

    const mandatoryProperties = Object.keys(mandatoryDocumentSchema._def.shape) as (keyof MandatoryDocumentSchema['_shape'])[];
    return mandatoryProperties.filter(property => property in this.schema._def.shape);
  }

  /**
   * used for debugging purposes
   */
  peekSchema(peek: (schema: Schema) => void): this {
    peek(this.schema);
    return this;
  }

  select<T extends keyof Shape>(keys: T[]): QueryBuilder<M, MongoObject<Select<Shape, T, IsDocument>>, IsDocument, Reverse> {
    const newSchema = this.schema.select([...keys, ...this.getPreservedMandatoryDocumentProperties()] as string[]);
    return new QueryBuilder(this.model, newSchema as any, this.isDocument, this.reverse);
  }

  unselect<T extends keyof Shape>(keys: T[]): QueryBuilder<M, MongoObject<Omit<Shape, T>>, IsDocument> {
    const newSchema = this.schema.unselect(keys as string[]);
    return new QueryBuilder(this.model, newSchema as any, this.isDocument, this.reverse) as any;
  }

  pick<Mask extends Partial<Record<keyof Shape, boolean>>>(mask: Mask): QueryBuilder<M, MongoObject<ProcessMask<Shape, Mask, IsDocument>>, IsDocument, Reverse> {
    const presedMandatoryMask = this
      .getPreservedMandatoryDocumentProperties()
      .reduce((acc, key) => ({ ...acc, [key]: true }), {});

    const newSchema = this.schema.pick({
      ...presedMandatoryMask,
      ...mask,
    });
    return new QueryBuilder(this.model, newSchema as any, this.isDocument, this.reverse);
  }

  omit<Mask extends Partial<Record<keyof Shape, boolean>>>(mask: Mask): QueryBuilder<M, MongoObject<MaskOmit<Shape, Mask>>, IsDocument, Reverse> {
    const newSchema = this.schema.omit(mask);
    return new QueryBuilder(this.model, newSchema as any, this.isDocument, this.reverse);
  }

  //where<Key extends keyof Shape>(key: Key, operator: TypedComparisonOperator<MongoInfer<Shape[Key]>>, value: MongoInfer<Shape[Key]>): QueryBuilder<M, Schema, IsDocument> {
  where<Key extends keyof Shape, Operator extends TypedComparisonOperator<MongoInfer<Shape[Key]>>>(
    key: Key,
    operator: Operator,
    value: ExpectedOperationType<Shape[Key], Operator>,
  ): QueryBuilder<M, Schema, IsDocument, Reverse> {
    return new QueryBuilder(this.model, this.schema, this.isDocument, this.reverse);
  }

  whereNotNull<Key extends keyof Shape>(key: Key): QueryBuilder<M, MongoSetRequiredKey<Shape, Key & string, Reverse>, IsDocument, Reverse> {
    return new QueryBuilder(this.model, this.schema as any, this.isDocument, this.reverse);
  }

  sub<
    Key extends SubObjectKeys<MongoInfer<Schema>>,
    SubQuery extends QueryBuilder<M, MongoObject<MongoRawShape>>,
    >(
      key: Key,
      subQuery: (subQuery: QueryBuilder<M, FindMongoObject<Shape[Key]>>) => SubQuery,
    ): QueryBuilder<M, MongoObject<MergeMongoTypeIntoShape<Shape, Key & string, SubQuery['schema'], Shape[Key & string]>>, IsDocument, Reverse> {
    return new QueryBuilder(this.model, this.schema, this.isDocument, this.reverse) as any;
  }

  whereType<
    Key extends keyof Shape,
    Type extends keyof MongoTypeMap,
  >(
    key: Key,
    type: Type,
  ): QueryBuilder<M, MongoSetKeyType<Shape, Key & string, Type, Reverse>, IsDocument, Reverse> {
    return new QueryBuilder(this.model, this.schema, this.isDocument, this.reverse) as any;
  }

  not<
    SubQuery extends QueryBuilder<M, MongoObject<MongoRawShape>, IsDocument, Reverse extends true ? false : true>,
  >(
    subQuery: (subQuery: QueryBuilder<M, FindMongoObject<Schema>, IsDocument, Reverse extends true ? false : true>) => SubQuery,
  ): QueryBuilder<M, SubQuery['schema'], IsDocument, Reverse> {
    return new QueryBuilder(this.model, this.schema, this.isDocument, !this.reverse) as any;
  }

  whereOr<SubQueries extends ((subQuery: QueryBuilder<M, Schema>) => QueryBuilder<M, MongoObject<MongoRawShape>>)[]>(
    ...subQueries: SubQueries
  ): QueryBuilder<M, ReturnType<SubQueries[number]>['schema'], IsDocument, Reverse> {
    return new QueryBuilder(this.model, this.schema, this.isDocument, this.reverse);
  }

  whereOr2<Branch extends OrBranchBuilder<M, MongoObject<MongoRawShape>, any>>(
    buildBranch: (builder: AndBranchBuilder<M, Schema>) => Branch
  ): QueryBuilder<M, InferBranchSchema<Branch>, IsDocument, Reverse> {
    return new QueryBuilder(this.model, this.schema, this.isDocument, this.reverse);
  }

  whereAnd<
    Branch extends AndBranchBuilder<M, MongoObject<MongoRawShape>, any>
  >(buildBranch: (builder: AndBranchBuilder<M, Schema>) => Branch): QueryBuilder<M, InferBranchSchema<Branch>, IsDocument, Reverse> {
    return new QueryBuilder(this.model, this.schema, this.isDocument, this.reverse) as any;
  }

  async find(): Promise<MongoInfer<Schema>[]> {
    const shape = 'shape' in this.schema._def
      ? this.schema._def.shape
      : {};

    const projection = Object.keys(shape).reduce((acc, key) => {
      acc[key] = 1;
      return acc;
    }, {} as Record<string, 1>);

    return await this.model.model.find(
      {},
      projection,
    );
  }
}

type ComparisonOperator = ArithmeticComparisonOperator | ArrayComparisonOperator;
type ArithmeticComparisonOperator = CommonComparisonOperator | '>' | '<' | '>=' | '<=';
type CommonComparisonOperator = '==' | '!=' | 'in' | 'nin';
type ArrayComparisonOperator = 'in' | 'nin' | 'all' | 'size';
type StringComparisonOperator = CommonComparisonOperator | 'regex';
type AnyComparisonOperator = ArithmeticComparisonOperator | ArrayComparisonOperator | StringComparisonOperator;

type TypedComparisonOperator<T> = (
  T extends number
  ? ArithmeticComparisonOperator
  : T extends BigInt
  ? ArithmeticComparisonOperator
  : T extends Date
  ? ArithmeticComparisonOperator
  : T extends any[]
  ? ArrayComparisonOperator
  : T extends string
  ? StringComparisonOperator
  : CommonComparisonOperator
);

export type ExpectedOperationType<
  T extends MongoType,
  Operator extends AnyComparisonOperator,
> = (
  // fixes type 'never' for unions including string types
  Operator extends 'regex'
  ? RegExp
  : OperationTypeMap<MongoInfer<T>> extends { [K in InferTypeName<T>]: any }
  ? OperationTypeMap<MongoInfer<T>>[InferTypeName<T>] extends { [K in Operator]: any }
  ? OperationTypeMap<MongoInfer<T>>[InferTypeName<T>][Operator]
  : never
  : never
);

export type OperationTypeMap<T extends MongoType> = {
  string: {
    '==': T;
    '!=': T;
    in: T[];
    nin: T[];
    regex: RegExp;
  };
  number: {
    '==': T;
    '!=': T;
    '>': number;
    '>=': number;
    '<': number;
    '<=': number;
    in: T[];
    nin: T[];
  };
  bigInt: {
    '==': T;
    '!=': T;
    '>': BigInt;
    '>=': BigInt;
    '<': BigInt;
    '<=': BigInt;
    in: T[];
    nin: T[];
  };
  date: {
    '==': T;
    '!=': T;
    '>': Date;
    '>=': Date;
    '<': Date;
    '<=': Date;
    in: T[];
    nin: T[];
  };
  array: {
    in: T;
    nin: T;
    all: T;
    size: number;
  };
  boolean: {
    '==': T;
    '!=': T;
    in: T[];
    nin: T[];
  };
  object: {
    '==': T;
    '!=': T;
    in: T[];
    nin: T[];
  };
  null: {
    '==': T;
    '!=': T;
    in: T[];
    nin: T[];
  };
};

//type PrimitiveType = string | number |

// NonNullable because for some reason `undefined` is added to the resulting type
export type SubObjectKeys<T extends object> = NonNullable<{
  [Key in keyof T]: IsObject<T[Key]> extends true ? Key : never;
}[keyof T]>;

type IsObject<T> = (
  NonNullable<T> extends AnyObject[]
  ? true
  : Extract<Exclude<NonNullable<T>, Date | any[]>, AnyObject> extends never
  ? false
  : Extract<Exclude<NonNullable<T>, Date | any[]>, AnyObject> extends AnyObject
  ? true
  : false
);

export type MergeMongoTypeIntoShape<T extends MongoRawShape, Key extends string, Value extends MongoType, OriginalValue extends MongoType> = {
  [K in keyof T & string | Key]: K extends Key ? ResolveType<Value, OriginalValue> : T[K];
};

export type _MergeValueIntoObject<T extends AnyObject, Key extends string, Value> = {
  [K in keyof T & string | Key]: MergedProperty<T[K], K, Key, Value>;
} extends infer O ? { [K in keyof O]: O[K] } : never;

export type ResolveType<Value extends MongoType, OriginalType extends MongoType> = (
  OriginalType extends MongoOptional<any>
  ? MongoOptional<ResolveType<Value, OriginalType['_def']['type']>>
  : OriginalType extends MongoDefault<any>
  ? MongoDefault<ResolveType<Value, OriginalType['_def']['type']>>
  : OriginalType extends MongoArray<any>
  ? MongoArray<ResolveType<Value, OriginalType['_def']['items']>>
  : Value
);

export type MergeValueIntoObject<T extends AnyObject, Key extends string, Value> = {
  [K in keyof T & string | Key]: MergedProperty<T[K], K, Key, Value>;
} extends infer O ? { [K in keyof O]: O[K] } : never;

type MergedProperty<P extends object, TK extends string, Key extends string, Value> = TK extends Key ? Value : P;

export type MongoNoOptional<T extends MongoType> = (
  T extends MongoOptional<any>
  ? T['_def']['type']
  : T
);

export type MongoTypeMap = {
  string: MongoString;
  number: MongoNumber;
  boolean: MongoBoolean;
  bigint: MongoBigInt;
  date: MongoDate;
  object: MongoObject<MongoRawShape>;
  array: MongoArray<MongoType>;
  null: MongoNull;
};

type InferTypeName<T extends MongoType> = (
  T['_bsonTypeName']
);

type ExtractMongoType<T extends MongoType, TypeName extends keyof MongoTypeMap> = (
  ReapplyExpectedNull<ExtractInnerMongoType<T, TypeName>, TypeName>
);

type ExtractInnerMongoType<T extends MongoType, TypeName extends keyof MongoTypeMap> = (
  MongoNoOptional<T> extends MongoUnion
  ? (MongoNoOptional<T>['_def']['options'][number] & MongoTypeMap[TypeName])
  : (MongoNoOptional<T> & MongoTypeMap[TypeName])
);

type ExcludeMongoType<T extends MongoType, TypeName extends keyof MongoTypeMap> = (
  ReapplyExpectedNull<
    ExcludeInnerMongoType<T, TypeName> extends never
      ? T extends MongoOptional<any>
      ? MongoUnion<[MongoNull, MongoUndefined]>
      : ExcludeInnerMongoType<T, TypeName>
      : ExcludeInnerMongoType<T, TypeName>,
    TypeName
  >
);

type ExcludeInnerMongoType<
  T extends MongoType,
  TypeName extends keyof MongoTypeMap,
  RequiredT extends MongoNoOptional<T> = MongoNoOptional<T>,
> = (
  RequiredT extends MongoUnion
  ? Exclude<RequiredT['_def']['options'][number], MongoTypeMap[TypeName]>
  : Exclude<RequiredT, MongoTypeMap[TypeName]>
);

export type ReapplyExpectedNull<T extends MongoType, TypeName extends keyof MongoTypeMap> = (
  TypeName extends 'null'
  ? MongoNull
  : T
);

export type PreserveMandatoryDocumentProperties<T extends MongoRawShape, IsDocument extends boolean> = (
  IsDocument extends true
  ? T extends MandatoryDocumentSchema['_shape']
  ? keyof MandatoryDocumentSchema['_shape']
  : never
  : never
);

export type PickToMask<T extends string> = {
  [K in T]: true;
} extends infer O ? { [K in keyof O]: O[K] } : never;

export type ProcessMask<
  Shape extends MongoRawShape,
  Mask extends Partial<Record<keyof Shape, boolean>>,
  IsDocument extends boolean,
> = (
  MaskPick<
    Shape,
    (
      Mask &
      PickToMask<Exclude<PreserveMandatoryDocumentProperties<Shape, IsDocument>, keyof Mask>>
    )
  >
);

type MongoSetRequiredKey<
  Shape extends MongoRawShape,
  Key extends string,
  Reverse extends boolean,
> = MongoObject<MergeValueIntoObject<Shape, Key & string, Reverse extends true ? MongoOptional<MongoNull> : MongoNoOptional<Shape[Key]>>>;

type MongoSetKeyType<
  Shape extends MongoRawShape,
  Key extends string,
  Type extends keyof MongoTypeMap,
  Reverse extends boolean,
> = MongoObject<MergeValueIntoObject<Shape, Key & string, Reverse extends true ? ExcludeMongoType<Shape[Key], Type> : ExtractMongoType<Shape[Key], Type>>>;

type Select<
  Shape extends MongoRawShape,
  Key extends keyof Shape,
  IsDocument extends boolean,
  PreservedKey = PreserveMandatoryDocumentProperties<Shape, IsDocument>,
> = {
  [K in (Key & string) | (PreservedKey & string)]: Shape[K];
} extends infer O ? { [K in keyof O]: O[K] } : never;
