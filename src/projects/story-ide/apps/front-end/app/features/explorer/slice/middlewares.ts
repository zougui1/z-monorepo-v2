import { createAsyncThunk } from '@reduxjs/toolkit';

import { electronApi } from '@zougui/story-ide.electron-api';
import type { FS } from '@zougui/story-ide.types';

import { electron } from '~/utils';

import { getNodes } from '../api';

export const openDirectory = createAsyncThunk(
  'explorer/openDirectory',
  async (payload: OpenDirectoryPayload): Promise<{ nodes: FS.Node[] }> => {
    const nodes = await getNodes(payload.path);
    return {
      nodes,
    };
  },
);

export const renameNode = createAsyncThunk(
  'explorer/renameNode',
  async (payload: RenameNodePayload): Promise<void> => {
    await electron.request(electronApi.fs.rename, payload);
  },
);

export interface OpenDirectoryPayload {
  path: string;
  depth: number;
}

export interface RenameNodePayload {
  oldPath: string;
  newPath: string;
}
