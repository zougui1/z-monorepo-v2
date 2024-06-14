import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { FS } from '@zougui/story-ide.types';

import { toggle } from 'app/utils';

import { openDirectory, renameNode } from './middlewares';

export interface Directory {
  depth: number;
  nodes: FS.Node[];
}

export interface Node {
  name: string;
  path: string;
  type: FS.NodeType;
  depth: number;
}

export interface ExplorerState {
  directories: Record<string, Directory | undefined>;
  nodes: Record<string, Node | undefined>;
  hoveredDirectoryPath: string | undefined;
  selectedPaths: string[];
  openPaths: string[];
  loadingPaths: string[];
  renamingPath: string | undefined;
}

const initialState: ExplorerState = {
  directories: {},
  nodes: {},
  openPaths: [],
  loadingPaths: [],
  hoveredDirectoryPath: undefined,
  selectedPaths: [],
  renamingPath: undefined,
}

export const explorerSlice = createSlice({
  name: 'explorer',
  initialState,
  reducers: {
    closeDirectory: (state, { payload }: PayloadAction<{ path: string }>) => {
      state.openPaths = toggle(state.openPaths, payload.path, { ensure: 'not-present' });
    },

    hoverDirectory: (state, { payload }: PayloadAction<string>) => {
      state.hoveredDirectoryPath = payload;
    },

    persistentSelectNode: (state, { payload }: PayloadAction<string>) => {
      state.selectedPaths = [payload];
    },

    addSelectedPath: (state, { payload }: PayloadAction<{ path: string }>) => {
      state.selectedPaths.push(payload.path);
    },

    startRenaming: (state, { payload }: PayloadAction<{ path: string }>) => {
      state.renamingPath = payload.path;
    },

    cancelRenaming: state => {
      state.renamingPath = undefined;
    },
  },
  extraReducers: builder => {
    builder.addCase(openDirectory.pending, (state, { meta }) => {
      const { path, depth } = meta.arg;

      const directory = state.directories[path] || {
        depth,
        nodes: [],
      };

      if (!state.directories[path]) {
        state.directories[path] = directory;
      }

      state.loadingPaths = toggle(state.loadingPaths, path, { ensure: 'present' });
      state.openPaths = toggle(state.openPaths, path, { ensure: 'present' });
    });

    builder.addCase(openDirectory.fulfilled, (state, { payload, meta }) => {
      const { path } = meta.arg;

      const directory = state.directories[path];

      if (directory) {
        directory.nodes = payload.nodes;
        state.loadingPaths = toggle(state.loadingPaths, path, { ensure: 'not-present' });
      }

      for (const node of payload.nodes) {
        state.nodes[node.path] = {
          name: node.name,
          path: node.path,
          type: node.type,
          depth: meta.arg.depth,
        };
      }
    });

    builder.addCase(renameNode.pending, (state) => {
      state.renamingPath = undefined;
    });
  },
});

export const {
  closeDirectory,
  hoverDirectory,
  persistentSelectNode,
  addSelectedPath,
  startRenaming,
  cancelRenaming,
} = explorerSlice.actions;
