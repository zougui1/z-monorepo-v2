import type { Merge } from 'type-fest';

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
  M extends Model<MongoObject<MongoRawShape>>,
  Schema extends MongoObject<MongoRawShape>,
  IsDocument extends boolean = false,
  Reverse extends boolean = false,
  Shape extends Schema['_shape'] = Schema['_shape'],
> {
  readonly model: M;
  readonly schema: Schema;
  readonly isDocument: IsDocument;

  constructor(model: M, schema: Schema, isDocument: IsDocument) {
    this.model = model;
    this.schema = schema;
    this.isDocument = isDocument;
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

  select<T extends keyof Shape>(keys: T[]): QueryBuilder<M, MongoObject<Pick<Shape, T | PreserveMandatoryDocumentProperties<Shape, IsDocument>>>, IsDocument, Reverse> {
    const newSchema = this.schema.select([...keys, ...this.getPreservedMandatoryDocumentProperties()]);
    return new QueryBuilder(this.model, newSchema as any, this.isDocument);
  }

  unselect<T extends keyof Shape>(keys: T[]): QueryBuilder<M, MongoObject<Omit<Shape, T>>, IsDocument> {
    const newSchema = this.schema.unselect(keys);
    return new QueryBuilder(this.model, newSchema as any, this.isDocument);
  }

  pick<Mask extends Partial<Record<keyof Shape, boolean>>>(mask: Mask): QueryBuilder<M, MongoObject<ProcessMask<Shape, Mask, IsDocument>>, IsDocument, Reverse> {
    const presedMandatoryMask = this
      .getPreservedMandatoryDocumentProperties()
      .reduce((acc, key) => ({ ...acc, [key]: true }), {});

    const newSchema = this.schema.pick({
      ...presedMandatoryMask,
      ...mask,
    });
    return new QueryBuilder(this.model, newSchema as any, this.isDocument);
  }

  omit<Mask extends Partial<Record<keyof Shape, boolean>>>(mask: Mask): QueryBuilder<M, MongoObject<MaskOmit<Shape, Mask>>, IsDocument, Reverse> {
    const newSchema = this.schema.omit(mask);
    return new QueryBuilder(this.model, newSchema as any, this.isDocument);
  }

  //where<Key extends keyof Shape>(key: Key, operator: TypedComparisonOperator<MongoInfer<Shape[Key]>>, value: MongoInfer<Shape[Key]>): QueryBuilder<M, Schema, IsDocument> {
  where<Key extends keyof Shape, Operator extends TypedComparisonOperator<MongoInfer<Shape[Key]>>>(
    key: Key,
    operator: Operator,
    value: ExpectedOperationType<Shape[Key], Operator>,
  ): QueryBuilder<M, Schema, IsDocument, Reverse> {
    return new QueryBuilder(this.model, this.schema, this.isDocument);
  }

  whereNotNull<Key extends keyof Shape>(key: Key): QueryBuilder<M, MongoObject<MergeValueIntoObject<Shape, Key & string, Reverse extends true ? MongoOptional<Shape[Key]> : MongoNoOptional<Shape[Key]>>>, IsDocument, Reverse> {
    return new QueryBuilder(this.model, this.schema as any, this.isDocument);
  }

  sub<
    Key extends SubObjectKeys<MongoInfer<Schema>>,
    SubQuery extends QueryBuilder<M, MongoObject<MongoRawShape>>,
    >(
      key: Key,
      subQuery: (subQuery: QueryBuilder<M, FindMongoObject<Shape[Key]>>) => SubQuery,
    ): QueryBuilder<M, MongoObject<MergeMongoTypeIntoShape<Shape, Key & string, SubQuery['schema'], Shape[Key & string]>>, IsDocument, Reverse> {
    return new QueryBuilder(this.model, this.schema, this.isDocument) as any;
  }

  whereType<
    Key extends keyof Shape,
    Type extends keyof MongoTypeMap,
  >(
    key: Key,
    type: Type,
  ): QueryBuilder<M, MongoObject<MergeValueIntoObject<Shape, Key & string, Reverse extends true ? ExcludeMongoType<Shape[Key], Type> : ExtractMongoType<Shape[Key], Type>>>, IsDocument, Reverse> {
    return new QueryBuilder(this.model, this.schema, this.isDocument) as any;
  }

  not<
    SubQuery extends QueryBuilder<M, MongoObject<MongoRawShape>, IsDocument, Reverse extends true ? false : true>,
  >(
    subQuery: (subQuery: QueryBuilder<M, FindMongoObject<Schema>, IsDocument, Reverse extends true ? false : true>) => SubQuery,
  ): QueryBuilder<M, SubQuery['schema'], IsDocument, Reverse> {
    return new QueryBuilder(this.model, this.schema, this.isDocument) as any;
  }

  whereOr<SubQueries extends ((subQuery: QueryBuilder<M, Schema>) => QueryBuilder<M, MongoObject<MongoRawShape>>)[]>(
    ...subQueries: SubQueries
  ): QueryBuilder<M, ReturnType<SubQueries[number]>['schema'], IsDocument, Reverse> {
    return new QueryBuilder(this.model, this.schema, this.isDocument);
  }

  whereOr2<Branch extends OrBranchBuilder<M, MongoObject<MongoRawShape>, any>>(
    buildBranch: (builder: AndBranchBuilder<M, Schema>) => Branch
  ): QueryBuilder<M, InferBranchSchema<Branch>, IsDocument, Reverse> {
    return new QueryBuilder(this.model, this.schema, this.isDocument);
  }

  whereAnd<
    Branch extends AndBranchBuilder<M, MongoObject<MongoRawShape>, any>
  >(buildBranch: (builder: AndBranchBuilder<M, Schema>) => Branch): QueryBuilder<M, InferBranchSchema<Branch>, IsDocument, Reverse> {
    return new QueryBuilder(this.model, this.schema, this.isDocument) as any;
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

export type MergeMongoTypeIntoShape<T extends MongoRawShape, Key extends string, Value extends MongoType, OriginalValue extends MongoType> = Merge<
  Omit<T, Key>,
  { [K in Key]: ResolveType<Value, OriginalValue> }
> extends infer O ? { [K in keyof O]: O[K] } : never;

export type ResolveType<Value extends MongoType, OriginalType extends MongoType> = (
  ResolveDeepType<Value, OriginalType>
);

export type ResolveShallowType<Value extends MongoType, OriginalType extends MongoType> = (
  OriginalType extends MongoOptional<any>
  ? MongoOptional<Value>
  : OriginalType extends MongoDefault<any>
  ? MongoDefault<Value>
  : OriginalType extends MongoArray<any>
  ? MongoArray<Value>
  : Value
);

export type ResolveDeepType<Value extends MongoType, OriginalType extends MongoType> = (
  OriginalType extends MongoOptional<MongoDefault<MongoArray<any>>>
  ? MongoOptional<MongoDefault<MongoArray<Value>>>
  : OriginalType extends MongoDefault<MongoOptional<MongoArray<any>>>
  ? MongoDefault<MongoOptional<MongoArray<Value>>>
  : OriginalType extends MongoDefault<MongoOptional<any>>
  ? MongoDefault<MongoOptional<Value>>
  : OriginalType extends MongoOptional<MongoDefault<any>>
  ? MongoOptional<MongoDefault<Value>>
  : OriginalType extends MongoDefault<MongoArray<any>>
  ? MongoDefault<MongoArray<Value>>
  : OriginalType extends MongoOptional<MongoArray<any>>
  ? MongoOptional<MongoArray<Value>>
  : ResolveShallowType<Value, OriginalType>
);

export type MergeValueIntoObject<T extends AnyObject, Key extends string, Value> = {
  [K in keyof T & string | Key]: MergedProperty<T[K], K, Key, Value>;
};

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

type InferTypeName<
  T extends MongoType,
  OptionalShallow extends boolean = true,
  UnionShallow extends boolean = true,
  DefaultShallow extends boolean = true,
> = (
  T extends MongoOptional<any>
  // allow only shallow unions otherwise it may cause typescript errors
  // for excessive stack depth
  ? OptionalShallow extends true
  ? InferTypeName<T['_def']['type'], false, UnionShallow, DefaultShallow>
  : never
  : T extends MongoDefault<any>
  // allow only shallow unions otherwise it may cause typescript errors
  // for excessive stack depth
  ? DefaultShallow extends true
  ? InferTypeName<T['_def']['type'], OptionalShallow, UnionShallow, false>
  : never
  : T extends MongoString
  ? 'string'
  : T extends MongoObjectId
  ? 'string'
  : T extends MongoEnum<EnumValues>
  ? 'string'
  : T extends MongoNumber
  ? 'number'
  : T extends MongoBigInt
  ? 'bigInt'
  : T extends MongoBoolean
  ? 'boolean'
  : T extends MongoDate
  ? 'date'
  : T extends MongoObject
  ? 'object'
  : T extends MongoArray<any>
  ? 'array'
  : T extends MongoNull
  ? 'null'
  : T extends MongoUnion
  // allow only shallow unions otherwise it may cause typescript errors
  // for excessive stack depth
  ? UnionShallow extends true
  ? InferTypeName<T['_def']['options'][number], OptionalShallow, false, DefaultShallow>
  : never
  : never
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

type ExcludeInnerMongoType<T extends MongoType, TypeName extends keyof MongoTypeMap> = (
  MongoNoOptional<T> extends MongoUnion
  ? Exclude<MongoNoOptional<T>['_def']['options'][number], MongoTypeMap[TypeName]>
  : Exclude<MongoNoOptional<T>, MongoTypeMap[TypeName]>
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
};

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
)
