import { prop } from '@typegoose/typegoose';
import type { PropType } from '@typegoose/typegoose';
import type {
  BasePropOptions,
  ArrayPropOptions,
  MapPropOptions,
  PropOptionsForNumber,
  PropOptionsForString,
  VirtualOptions,
} from '@typegoose/typegoose/lib/types';

export const enumProp = (
  { array, ...options }: EnumPropOptions,
  kind?: PropType | undefined
): PropertyDecorator => {
  const enumValues = Object.values(options.enum);

  if (!enumValues.length) {
    throw new Error('The enum must have at least one value');
  }

  const enumType = enumValues[0].constructor;

  return prop({
    ...options,
    type: () => array ? [enumType] : enumType,
    enum: enumValues,
  }, kind);
}

export type EnumPropOptions = Omit<
  BasePropOptions | ArrayPropOptions | MapPropOptions | PropOptionsForNumber | PropOptionsForString | VirtualOptions,
  'type' | 'enum'
> & {
  enum: Record<string, string> | Record<string, number>;
  array?: boolean | undefined;
  required?: boolean | undefined;
};
