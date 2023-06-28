import { isObject } from 'radash';

import type { ZodDef } from './def';
import type { ObjectZodDef } from './def/parsers';

type UnknownObject = Record<string, unknown>;

const defaultValue = null;

const typesDefaultValueMap = new Map<string, unknown>([
  ['array', []],
  ['string', ''],
  ['boolean', false],
  ['date', null],
  ['number', null],
  ['null', null],
  ['undefined', undefined],
  ['void', undefined],
  ['never', undefined],
]);

export const getFieldsDefaultValue = (def: ZodDef): UnknownObject => {
  if (def.type !== 'object') {
    return {};
  }

  if ('defaultValue' in def && isObject(def.defaultValue)) {
    return def.defaultValue as UnknownObject;
  }


  return getDefaultObject(def);
}

export const getDefaultObject = (def: ObjectZodDef): UnknownObject => {
return Object.entries(def.fields).reduce((acc, [fieldName, fieldDef]) => {
    acc[fieldName] = getFieldDefaultValue(fieldDef);
    return acc;
  }, {} as UnknownObject);
}

const getFieldDefaultValue = (def: ZodDef): unknown => {
  if ('defaultValue' in def && def.defaultValue !== undefined) {
    return def.defaultValue;
  }

  if (def.type === 'literal') {
    return getDefaultValueForType(def.valueType);
  }

  if (def.type === 'object') {
    return getDefaultObject(def);
  }

  return getDefaultValueForType(def.type);
}

const getDefaultValueForType = (type: string): unknown => {
  if (typesDefaultValueMap.has(type)) {
    return typesDefaultValueMap.get(type);
  }

  return defaultValue;
}
