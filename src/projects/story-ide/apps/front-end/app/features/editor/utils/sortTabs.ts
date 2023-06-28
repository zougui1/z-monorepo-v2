import { sort } from 'radash';

import type { EditorTab } from '../slice';

export const sortTabs = (tabs: EditorTab[]): EditorTab[] => {
  return sort(tabs, tab => tab.position);
}
