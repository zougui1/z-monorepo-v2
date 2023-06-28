import { Tabs } from '@mui/material';

import { useAppSelector, useAppDispatch } from '~/store';
import { persistentSelectNode } from '~/features/explorer/slice';

import { EditorTab } from '../EditorTab';
import { focusTab, selectPane } from '../../slice';
import { sortTabs } from '../../utils';

export const EditorTabs = ({ paneId }: EditorTabsProps) => {
  const dispatch = useAppDispatch();
  const pane = useAppSelector(selectPane(paneId));

  const handleChange = (event: {}, tabId: string): void => {
    dispatch(focusTab({ paneId, tabId }));
    dispatch(persistentSelectNode(tabId));
  }

  if(!pane) {
    return null;
  }

  return (
    <Tabs
      value={pane.focusedTabId}
      onChange={handleChange}
      onClick={(e) => console.log('click:')}
      variant="scrollable"
      scrollButtons={false}
      visibleScrollbar
    >
      {sortTabs(Object.values(pane.tabs)).map(tab => (
        <EditorTab
          key={tab.id}
          paneId={paneId}
          tabId={tab.id}
          // value is required for MUI's component Tabs
          value={tab.id}
        />
      ))}
    </Tabs>
  );
}

export interface EditorTabsProps {
  paneId: string;
}
