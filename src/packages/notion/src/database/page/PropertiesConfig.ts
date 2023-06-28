import { DatabaseObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import { RawPropertyConfig } from './RawPropertyConfig';
import { PropertyType } from '../../PropertyType';

export class PropertiesConfig {
  properties: Record<string, RawPropertyConfig> = {};

  constructor(properties: DatabaseObjectResponse['properties']) {
    for (const [key, property] of Object.entries(properties)) {
      this.properties[key] = new RawPropertyConfig(property);
    }
  }

  get(name: string, required: true): RawPropertyConfig;
  get(name: string, required?: boolean | undefined): RawPropertyConfig | undefined;
  get(name: string, required?: boolean | undefined): RawPropertyConfig | undefined {
    const property = this.properties[name];

    if (required && !property) {
      throw new Error(`No property "${name}" found`);
    }

    return property;
  }

  getAs<Type extends PropertyType>(name: string, type: Type, required: true): RawPropertyConfig<Type>;
  getAs<Type extends PropertyType>(name: string, type: Type, required?: boolean | undefined): RawPropertyConfig<Type> | undefined;
  getAs<Type extends PropertyType>(name: string, type: Type, required?: boolean | undefined): RawPropertyConfig<Type> | undefined {
    const property = this.get(name, required);

    if (property?.type === type) {
      return property as RawPropertyConfig<Type>;
    }

    if (required) {
      throw new Error(`Expected property "${name}" to be of type ${type}. Got type ${property?.type} instead`);
    }
  }
}
