import axios from 'axios';
import joinUrl from 'url-join';

import { electronApi } from '@zougui/story-ide.electron-api';

import { selectByPlatform, electron } from 'app/utils';

export const getFileContent = (path: string): Promise<string> => {
  const request = selectByPlatform({
    electron: async () => {
      return await electron
        .request(electronApi.fs.file, { path })
        .then(response => response.data);
    },
    default: async () => {
      return await axios
        .get(joinUrl('https://raw.githubusercontent.com/zougui1/nameless-story/main', path))
        .then(response => response.data);
    },
  });

  return request();
}
