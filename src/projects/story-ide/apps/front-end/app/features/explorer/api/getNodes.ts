import axios from 'axios';
import joinUrl from 'url-join';

import { electronApi } from '@zougui/story-ide.electron-api';
import type { FS } from '@zougui/story-ide.types';

import { selectByPlatform, electron } from 'app/utils';

export const getNodes = (path: string): Promise<FS.Node[]> => {
  const request = selectByPlatform({
    electron: async () => {
      return await electron
        .request(electronApi.fs.index, { path })
        .then(response => response.data);
    },
    default: async () => {
      return await axios
        .get(joinUrl('https://api.github.com/repos/zougui1/nameless-story/contents', path))
        .then(response => response.data);
    },
  });

  return request();
}
