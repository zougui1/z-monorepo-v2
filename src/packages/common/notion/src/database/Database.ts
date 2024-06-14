import type { Client as NotionClient } from '@notionhq/client';
import type { Constructor } from 'type-fest';

import { ModelDatabasePage, createDatabaseModel } from './page';
import type {
  RawQueryDatabaseParameters,
  RawQueryDatabaseResponse,
  RawCreatePageParameters,
  RawCreatePageResponse,
  RawUpdatePageParameters,
  RawGetDatabaseParameters,
  RawGetDatabaseResponse,
  WithAuth,
} from '../notion-types';
import { getFullPageList } from '../utils';
import { ModelPage, PageSchema, PropsSchema, createPageModel } from '../page/model';

export class Database<Props extends PropsSchema> {
  #notion: NotionClient;
  readonly id: string;
  readonly pageModel: Constructor<ModelPage<Props>>;
  readonly databaseModel: Constructor<ModelDatabasePage<Props>>;
  readonly schema: PageSchema<Props>;
  defaultPageSize: number = 50;

  constructor(notion: NotionClient, id: string, schema: PageSchema<Props>) {
    this.#notion = notion;
    this.id = id;
    this.schema = schema;
    this.pageModel = createPageModel(schema);
    this.databaseModel = createDatabaseModel(schema)
  }

  async rawQuery(options: WithAuth<QueryDatabaseParameters>): Promise<RawQueryDatabaseResponse> {
    return await this.#notion.databases.query({
      page_size: this.defaultPageSize,
      ...options,
      database_id: this.id,
    });
  }

  async query(options: WithAuth<QueryDatabaseParameters>): Promise<QueryQueryDatabaseResponse<ModelPage<Props>>> {
    const response = await this.rawQuery(options);

    return {
      ...response,
      results: getFullPageList(response.results, this.pageModel),
    };
  }

  async createEntry(options: WithAuth<CreatePageParameters>): Promise<RawCreatePageResponse> {
    return await this.#notion.pages.create({
      ...options,
      parent: { database_id: this.id },
      // for some reason, in some cases it requires the parent to be a page_id
      // but not sure for what cases it is required
    } as RawCreatePageParameters);
  }

  async updateEntry(options: WithAuth<RawUpdatePageParameters>): Promise<RawCreatePageResponse> {
    return await this.#notion.pages.update(options);
  }

  async rawRetrieve(options?: WithAuth<GetDatabaseParameters> | undefined): Promise<RawGetDatabaseResponse> {
    return await this.#notion.databases.retrieve({
      ...options,
      database_id: this.id,
    });
  }

  async retrieve(options?: WithAuth<GetDatabaseParameters> | undefined): Promise<ModelDatabasePage<Props>> {
    const database = await this.rawRetrieve(options);
    return new this.databaseModel(database);
  }
}

export interface QueryDatabaseParameters extends Omit<RawQueryDatabaseParameters, 'database_id'> {}
export interface GetDatabaseParameters extends Omit<RawGetDatabaseParameters, 'database_id'> {}
export type QueryQueryDatabaseResponse<T extends ModelPage> = Omit<RawQueryDatabaseResponse, 'results'> & {
  results: T[];
};

export type CreatePageParameters = Omit<RawCreatePageParameters, 'parent'>;
