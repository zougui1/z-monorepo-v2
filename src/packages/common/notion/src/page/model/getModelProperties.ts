import { PropsSchema, ModelProps } from './types';
import { Properties } from '../Properties';

export const getModelProperties = <Props extends PropsSchema>(properties: Properties, schema: Props): ModelProps<Props> => {
  const props = Object.entries(schema).reduce((props, [name, Property]) => {
    const property = properties.getAs(name, Property.type, true).raw;
    props[name as keyof Props] = new Property(property, { name }) as InstanceType<Props[keyof Props]>;

    return props;
  }, {} as ModelProps<Props>)

  return props;
}
