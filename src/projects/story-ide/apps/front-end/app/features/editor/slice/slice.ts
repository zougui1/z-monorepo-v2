import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { closeTab, createPane, openFile } from './middlewares';

export interface EditorTab {
  id: string;
  path: string;
  position: number;
  content: string;
}

export interface EditorPane {
  id: string;
  /**
   * the key is the tab ID
   */
  tabs: Record<string, EditorTab>;
  focusedTabId: string;
  tempTabId?: string | undefined;
}

export interface EditorState {
  /**
   * the key is the pane ID
   */
  panes: Record<string, EditorPane | undefined>;
  focusedPaneId: string | undefined;
}

const initialState: EditorState = {
  panes: {
    editor: { id: 'editor', tabs: {}, focusedTabId: '' }
  },
  focusedPaneId: 'editor',
};

export const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    focusTab: (state, { payload }: PayloadAction<BaseTabPayload>) => {
      const pane = state.panes[payload.paneId];
      const tab = pane?.tabs[payload.tabId];

      if(!tab) {
        return;
      }

      if (state.focusedPaneId !== pane.id) {
        state.focusedPaneId = pane.id;
      }

      pane.focusedTabId = tab.id;
    },

    closePane: (state, { payload }: PayloadAction<{ id: string }>) => {
      if(!state.panes[payload.id]) {
        return;
      }

      delete state.panes[payload.id];
      state.focusedPaneId = Object.keys(state.panes).at(-1) || '';
    }
  },

  extraReducers: builder => {
    builder.addCase(openFile.fulfilled, (state, { payload, meta }) => {
      if (!payload) {
        return;
      }

      const pane = state.panes[payload.paneId];

      if(!pane) {
        return;
      }

      const tabId = meta.arg.path;
      const currentTempTab = pane.tempTabId ? pane.tabs[pane.tempTabId] : undefined;

      pane.tabs[tabId] = {
        id: tabId,
        path: tabId,
        position: currentTempTab?.position ?? Object.keys(pane.tabs).length,
        content: payload.fileContent,
      };
      pane.focusedTabId = tabId;
      pane.tempTabId = tabId;
    });

    builder.addCase(createPane.fulfilled, (state, { payload }) => {
      if (!payload) {
        return;
      }

      state.panes[payload.id] = {
        id: payload.id,
        tabs: {},
        focusedTabId: payload.createdTabId,
        tempTabId: undefined,
      };

      state.focusedPaneId = payload.id;
    });

    builder.addCase(closeTab.fulfilled, (state, { payload }) => {
      if(!payload) {
        return;
      }

      const pane = state.panes[payload.paneId];
      const closedTab = pane?.tabs[payload.tabId];

      if (!closedTab) {
        return;
      }

      delete pane.tabs[closedTab.id];
      const tabs = Object.values(pane.tabs);

      if (!tabs.length) {
        pane.focusedTabId = '';

        // don't remove the last pane
        if (Object.keys(state.panes).length > 1) {
          delete state.panes[pane.id];
          state.focusedPaneId = Object.keys(state.panes)[0];
        }

        return;
      }

      pane.focusedTabId = payload.newFocusedTabId;
    });
  },
});

export const {
  focusTab,
  closePane,
} = editorSlice.actions;

export interface BaseTabPayload {
  paneId: string;
  tabId: string;
}
