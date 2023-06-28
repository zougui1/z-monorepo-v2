import type { AppState } from '~/store';

import type { EditorPane, EditorTab } from './slice';

export const selectPane = (paneId: string) => (state: AppState): EditorPane | undefined => {
  return state.editor.panes[paneId];
}

export const selectTab = ({ paneId, tabId }: { paneId: string; tabId: string }) => {
  return (state: AppState): EditorTab | undefined => {
    return selectPane(paneId)(state)?.tabs[tabId];
  }
}

export const selectOptionalPane = (paneId?: string | undefined) => (state: AppState): EditorPane | undefined => {
  if(paneId) {
    return state.editor.panes[paneId];
  }
}
