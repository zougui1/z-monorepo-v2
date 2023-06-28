import { createAsyncThunk } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';

import { store } from '~/store';
import { removeView, splitView } from '~/features/split-views/slice';
import { persistentSelectNode } from '~/features/explorer/slice';

import { focusTab, closePane, type BaseTabPayload } from './slice';
import { selectOptionalPane } from './selectors';
import { getFileContent } from '../api';
import type { DropPosition } from '../enums';

export const openFile = createAsyncThunk(
  'editor/openFile',
  async (payload: OpenFilePayload): Promise<{ paneId: string; fileContent: string } | undefined> => {
    const state = store.getState();
    const paneId = payload.paneId || state.editor.focusedPaneId;
    const pane = selectOptionalPane(paneId)(state);

    if (!pane) {
      return;
    }

    if (pane.tabs[payload.path]) {
      // focus the tab instead of requesting it when already open
      store.dispatch(focusTab({
        paneId: pane.id,
        tabId: payload.path,
      }));
      store.dispatch(persistentSelectNode(payload.path));
      return;
    }

    const fileContent = await getFileContent(payload.path);
    store.dispatch(persistentSelectNode(payload.path));

    return { paneId: pane.id, fileContent };
  },
);

export const createPane = createAsyncThunk(
  'editor/createPane',
  async (payload: CreatePanePayload): Promise<CreatePaneResult | undefined> => {
    const state = store.getState();
    const pane = selectOptionalPane(payload.paneId)(state);

    if (!pane) {
      return;
    }

    const newPaneId = nanoid();

    store.dispatch(splitView({
      id: pane.id,
      newViewId: newPaneId,
      position: payload.position,
    }));

    setTimeout(() => {
      store.dispatch(openFile({
        paneId: newPaneId,
        path: payload.path,
      }));
    }, 0);

    return {
      id: newPaneId,
      createdTabId: payload.path,
    };
  },
);

export const closeTab = createAsyncThunk(
  'editor/closeTab',
  (payload: BaseTabPayload): CloseTabResult | undefined => {
    const state = store.getState();
    const pane = selectOptionalPane(payload.paneId)(state);
    const closedTab = pane?.tabs[payload.tabId];

    if (!closedTab) {
      return;
    }

    const paneTabs = Object.values(pane.tabs);
    const panes = Object.keys(state.editor.panes);
    const tabsWithoutClosedOne = paneTabs.filter(tab => tab.id !== closedTab.id);

    // remove the current view only if there is more than one pane and the current pane
    // has one tab or less
    if (tabsWithoutClosedOne.length < 1 && panes.length > 1) {
      store.dispatch(removeView({ id: payload.paneId }));
      store.dispatch(closePane({ id: payload.paneId }));
    }

    const newFocusedTabId = pane.focusedTabId !== payload.tabId
      ? pane.focusedTabId
      : (tabsWithoutClosedOne.at(closedTab.position) || tabsWithoutClosedOne[0])?.id || '';

    store.dispatch(persistentSelectNode(pane.tabs[newFocusedTabId].path));

    return {
      paneId: payload.paneId,
      tabId: payload.tabId,
      newFocusedTabId: newFocusedTabId,
    };
  }
);

export interface OpenFilePayload {
  path: string;
  paneId?: string | undefined;
}

export interface CreatePanePayload {
  paneId: string;
  position: DropPosition;
  path: string;
}

export interface CreatePaneResult {
  id: string;
  createdTabId: string;
}

export interface CloseTabResult {
  paneId: string;
  tabId: string;
  newFocusedTabId: string;
}
