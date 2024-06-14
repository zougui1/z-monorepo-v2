import { RawPropertyConfigTypeMap } from './property-types';
import { PropertyType } from '../../PropertyType';

export class RawPropertyConfig<Type extends PropertyType = PropertyType> {
  raw: RawPropertyConfigTypeMap[Type];
  type: Type;
  id: string;

  constructor(property: RawPropertyConfigTypeMap[Type]) {
    this.raw = property;
    this.type = property.type as Type;
    this.id = property.id;
  }
}
