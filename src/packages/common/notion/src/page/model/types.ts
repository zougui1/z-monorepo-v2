import { Constructor } from 'type-fest';

import type { ModelPage } from './ModelPage';
import type { PropertyType } from '../../PropertyType';
import type { RawPageObjectResponse } from '../../notion-types';

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
  [T in keyof Props]: InstanceType<Props[T]>;
}

export type PropsSchema = Record<string, PropertySchema>;

export type ModelPageConstructor<Props extends PropsSchema = PropsSchema> = Constructor<ModelPage<Props>, [page: RawPageObjectResponse]>;

export interface PageSchema<Props extends PropsSchema = PropsSchema> {
  properties: Props;
}
