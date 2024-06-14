import { DateTime } from 'luxon';
import { DatabaseObjectResponse, PartialUserObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { getModelProperties } from './getModelProperties';
import { PropsSchema, ModelProps } from './types';
import { DatabasePage } from '../DatabasePage';
import { Cover, Icon, Parent } from '../../../page';

export abstract class ModelDatabasePage<Props extends PropsSchema = PropsSchema> {
  archived: boolean;
  cover: Cover | null;
  createdBy: PartialUserObjectResponse;
  createdTime: DateTime;
  icon: Icon | null;
  id: string;
  lastEditedBy: PartialUserObjectResponse;
  lastEditedTime: DateTime;
  parent: Parent;
  properties: ModelProps<Props>;
  url: string;

  constructor(database: DatabaseObjectResponse, options: ModelPageOptions<Props>);
  constructor(database: DatabasePage, options: ModelPageOptions<Props>);
  constructor(databaseOrDatabaseObject: DatabasePage | DatabaseObjectResponse, options: ModelPageOptions<Props>) {
    const database = databaseOrDatabaseObject instanceof DatabasePage
      ? databaseOrDatabaseObject
      : new DatabasePage(databaseOrDatabaseObject);

    this.archived = database.archived;
    this.cover = database.cover;
    this.createdBy = database.createdBy;
    this.createdTime = database.createdTime;
    this.icon = database.icon;
    this.id = database.id;
    this.lastEditedBy = database.lastEditedBy;
    this.lastEditedTime = database.lastEditedTime;
    this.parent = database.parent;
    this.properties = getModelProperties(database.properties, options.properties);
    this.url = database.url;
  }
}

export interface ModelPageOptions<Props extends PropsSchema> {
  properties: Props;
}
