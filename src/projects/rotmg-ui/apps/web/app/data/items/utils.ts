import { isObject } from 'radash';

import type { FullItemObject, Item } from './types';

const isPartialItem = (value: unknown): value is Item => {
  return (
    isObject(value) &&
    'name' in value &&
    typeof value.name === 'string'
  );
}

export const flattenItems = (input: FullItemObject, parentKey?: string): Record<string, Item> => {
  let items: Record<string, Item> = {};

  for (const [key, value] of Object.entries(input)) {
    const fullKey = [parentKey, key].filter(Boolean).join('.');

    if (isPartialItem(value)) {
      items[fullKey] = value;
    } else {
      items = {
        ...items,
        ...flattenItems(value, fullKey),
      };
    }
  }

  return items;
}
