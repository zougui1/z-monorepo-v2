import { BaseBranchBuilder } from './BaseBranchBuilder';
import { QueryBuilder } from './QueryBuilder';
import type { MongoObject } from '../schema-v2';
import type { Model } from '../model';

export class OrBranchBuilder<
  M extends Model<MongoObject>,
  OriginalSchema extends object,
  CurrentSchema extends object | void = void,
> extends BaseBranchBuilder<M, OriginalSchema, CurrentSchema> {
  branch<
    SubQuery extends QueryBuilder<M, object>,
  >(
    subQuery: (subQuery: QueryBuilder<M, OriginalSchema>) => SubQuery,
  ): OrBranchBuilder<M, OriginalSchema, CurrentSchema extends object ? (CurrentSchema | SubQuery['_shape']) : SubQuery['_shape']> {
    return new OrBranchBuilder(this.model, this.originalSchema, this.currentSchema) as any;
  }
}
