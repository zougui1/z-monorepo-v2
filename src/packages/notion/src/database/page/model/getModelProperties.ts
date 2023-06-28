import { PropsSchema, ModelProps } from './types';
import { PropertiesConfig } from '../PropertiesConfig';

export const getModelProperties = <Props extends PropsSchema>(properties: PropertiesConfig, schema: Props): ModelProps<Props> => {
  const props = Object.entries(schema).reduce((props, [name, Property]) => {
    const property = properties.getAs(name, Property.type, true).raw;
    (props as any)[name as any] = property;

    return props;
  }, {} as ModelProps<Props>)

  return props;
}
