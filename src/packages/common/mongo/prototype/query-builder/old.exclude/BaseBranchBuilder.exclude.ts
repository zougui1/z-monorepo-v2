import { QueryBuilder } from './QueryBuilder';
import type { MongoObject } from '../schema-v2';
import type { Model } from '../model';

export abstract class BaseBranchBuilder<
  M extends Model<MongoObject>,
  OriginalSchema extends MongoObject,
  CurrentSchema extends MongoObject | void = void,
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
    SubQuery extends QueryBuilder<M, MongoObject>,
  >(
    subQuery: (subQuery: QueryBuilder<M, OriginalSchema>) => SubQuery,
  ): BaseBranchBuilder<M, OriginalSchema, MongoObject>;
}

export type InferBranchSchema<T extends BaseBranchBuilder<any, any>> = T['currentSchema'] extends MongoObject<any> ? T['currentSchema'] : T['originalSchema'];
