import { electronApi } from '@zougui/story-ide.electron-api';

import { store } from 'app/store';
import { electron } from 'app/utils';

export const deleteSelectedNodes = async (): Promise<void> => {
  await electron.request(electronApi.fs.delete, {
    paths: store.getState().explorer.selectedPaths,
  });
}
