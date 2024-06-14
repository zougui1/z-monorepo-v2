import useLocalStorageState from 'use-local-storage-state';

import { toggleArrayItem } from '~/utils/array';

export const usePersistedToggleArray = (key: string) => {
  const [items, setItems] = useLocalStorageState(key, {
    defaultValue: [] as string[],
  });

  const toggleItem = (item: string) => {
    setItems(values => toggleArrayItem(values, item));
  }

  const removeItem = (item: string) => {
    setItems(values => values.filter(value => value !== item));
  }

  return { items, toggleItem, removeItem };
}
