import { QueryBuilder } from './QueryBuilder';
import type { MongoObject } from '../schema';
import type { Model } from '../model';

export abstract class BaseBranchBuilder<
  M extends Model<MongoObject>,
  OriginalSchema extends MongoObject,
  CurrentSchema extends MongoObject | void = void,
  IsDocument extends boolean = false,
  IsReverse extends boolean = false,
> {
  readonly model: M;
  readonly originalSchema: OriginalSchema;
  readonly currentSchema: CurrentSchema;

  constructor(model: M, originalSchema: OriginalSchema, currentSchema: CurrentSchema) {
    this.model = model;
    this.originalSchema = originalSchema;
    this.currentSchema = currentSchema;
  }

  /**
   * used for debugging purposes
   */
  peekSchema(peek: (schema: { original: OriginalSchema; current: CurrentSchema; }) => void): this {
    peek({ original: this.originalSchema, current: this.currentSchema });
    return this;
  }

  abstract branch<
    SubQuery extends QueryBuilder<M, MongoObject, boolean, boolean>,
  >(
    subQuery: (subQuery: QueryBuilder<M, OriginalSchema, IsDocument, IsReverse>) => SubQuery,
  ): BaseBranchBuilder<M, OriginalSchema, MongoObject, IsDocument, IsReverse>;
}

export type InferBranchSchema<T extends BaseBranchBuilder<any, any, any, boolean, boolean>> = T['currentSchema'] extends MongoObject<any> ? T['currentSchema'] : T['originalSchema'];
