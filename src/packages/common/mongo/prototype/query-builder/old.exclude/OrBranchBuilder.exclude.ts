import { BaseBranchBuilder } from './BaseBranchBuilder';
import { QueryBuilder } from './QueryBuilder';
import type { MongoObject } from '../schema-v2';
import type { Model } from '../model';

export class OrBranchBuilder<
  M extends Model<MongoObject>,
  OriginalSchema extends MongoObject,
  CurrentSchema extends MongoObject | void = void,
> extends BaseBranchBuilder<M, OriginalSchema, CurrentSchema> {
  branch<
    SubQuery extends QueryBuilder<M, MongoObject>,
  >(
    subQuery: (subQuery: QueryBuilder<M, OriginalSchema>) => SubQuery,
  ): OrBranchBuilder<M, OriginalSchema, CurrentSchema extends MongoObject<any> ? (CurrentSchema | SubQuery['schema']) : SubQuery['schema']> {
    return new OrBranchBuilder(this.model, this.originalSchema, this.currentSchema) as any;
  }
}
