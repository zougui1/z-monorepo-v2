import { DatabaseObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { PropertiesConfig } from './PropertiesConfig';
import { BasePage } from '../../page/BasePage';

export class DatabasePage extends BasePage {
  object: 'database';
  properties: PropertiesConfig;

  constructor(database: DatabaseObjectResponse) {
    super(database);

    this.object = database.object;
    this.properties = new PropertiesConfig(database.properties);
  }
}
