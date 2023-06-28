import { Constructor } from 'type-fest';

import type { ModelDatabasePage } from './ModelDatabasePage';
import { RawPropertyConfigTypeMap } from '../property-types';
import type { PropertyType } from '../../../PropertyType';
import type { RawDatabaseObjectResponse } from '../../../notion-types';

export interface ModelProperty<Type extends PropertyType = PropertyType> {
  id: string;
  type: Type;
}

export interface ModelPropertyOptions {
  name: string;
}

export type ModelPropertyConstructor<Type extends PropertyType = PropertyType> = Constructor<ModelProperty<Type>, [property: any, options: ModelPropertyOptions]>;

export type PropertySchema<Type extends PropertyType = PropertyType> = ModelPropertyConstructor<Type> & { type: Type };

export type ModelProps<Props extends Record<string, PropertySchema>> = {
  [T in keyof Props]: RawPropertyConfigTypeMap[Props[T]['type']];
}

export type PropsSchema = Record<string, PropertySchema>;

export type ModelDatabasePageConstructor<Props extends PropsSchema = PropsSchema> = Constructor<ModelDatabasePage<Props>, [database: RawDatabaseObjectResponse]>;
