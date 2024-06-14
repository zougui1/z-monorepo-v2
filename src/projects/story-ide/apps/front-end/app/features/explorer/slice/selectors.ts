import type { AppState } from 'app/store';

import type { Directory, Node } from './slice';
import type { FS } from '@zougui/story-ide.types';

const defaultDirectory: Directory = {
  depth: 0,
  nodes: [],
};

const defaultNode: Node = {
  name: 'unknown',
  path: '/',
  type: 'file',
  depth: 0,
};

export const selectDirectory = (path: string) => (state: AppState): Directory => {
  return state.explorer.directories[path] || defaultDirectory;
}

export const selectIsNodeOpen = (path: string) => (state: AppState): boolean => {
  return state.explorer.openPaths.includes(path);
}

export const selectIsDirectoryLoading = (path: string) => (state: AppState): boolean => {
  return state.explorer.loadingPaths.includes(path);
}

export const selectDirectoryNodes = (path: string) => (state: AppState): FS.Node[] => {
  return selectDirectory(path)(state).nodes;
}

export const selectHoveredDirectoryPath = (state: AppState): string => {
  return state.explorer.hoveredDirectoryPath || '/';
}

export const selectHoveredDirectory = (state: AppState): Directory => {
  const hoveredDirectory = selectHoveredDirectoryPath(state);
  return selectDirectory(hoveredDirectory)(state);
}

export const selectNode = (path: string) => (state: AppState): Node => {
  return state.explorer.nodes[path] || defaultNode;
}

export const selectIsNodeSelected = (path: string) => (state: AppState): boolean => {
  if (!state.explorer.selectedPaths.length && path === '/') {
    return true;
  }

  return state.explorer.selectedPaths.includes(path);
}

export const selectIsRenamingNode = (path: string) => (state: AppState): boolean => {
  return state.explorer.renamingPath === path;
}
