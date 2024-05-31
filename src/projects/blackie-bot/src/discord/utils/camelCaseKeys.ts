import { camel } from 'radash';

export const camelCaseKeys = (object: Record<string, unknown>): Record<string, unknown> => {
  return Object.entries(object).reduce((obj, [key, value]) => {
    obj[camel(key)] = value;
    return obj;
  }, {} as Record<string, unknown>);
}
