import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { BasePage } from './BasePage';
import { Properties } from './Properties';

export class Page extends BasePage {
  object: 'page';
  properties: Properties;

  constructor(page: PageObjectResponse) {
    super(page);

    this.object = page.object;
    this.properties = new Properties(page.properties);
  }
}
