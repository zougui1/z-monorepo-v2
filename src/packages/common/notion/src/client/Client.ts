import { Client as NotionClient } from '@notionhq/client';

import { Database } from '../database';
import type { PageSchema } from '../page/model';
import type { NotionClientOptions } from '../notion-types';

export class Client {
  readonly notion: NotionClient;

  constructor(options: ClientOptions) {
    this.notion = new NotionClient(options);
  }

  database<Schema extends PageSchema>(id: string, schema: Schema): Database<Schema['properties']> {
    return new Database(this.notion, id, schema);
  }
}

export interface ClientOptions extends NotionClientOptions {
  auth: NonNullable<NotionClientOptions['auth']>;
}
