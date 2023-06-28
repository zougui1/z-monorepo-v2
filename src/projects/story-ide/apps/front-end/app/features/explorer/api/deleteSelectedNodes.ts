import { electronApi } from '@zougui/story-ide.electron-api';

import { store } from '~/store';
import { electron } from '~/utils';

export const deleteSelectedNodes = async (): Promise<void> => {
  await electron.request(electronApi.fs.delete, {
    paths: store.getState().explorer.selectedPaths,
  });
}
