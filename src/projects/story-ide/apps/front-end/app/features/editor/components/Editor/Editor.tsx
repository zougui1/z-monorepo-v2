import { useAppSelector } from '~/store';

import { EditorTabs } from '../EditorTabs';
import { EditorTabPanel } from '../EditorTabPanel';
import { selectPane } from '../../slice';

export const Editor = ({ paneId }: EditorProps) => {
  const pane = useAppSelector(selectPane(paneId));
  const focusedTab = pane?.focusedTabId ? pane.tabs[pane.focusedTabId] : undefined;

  if(!pane) {
    return null;
  }

  return (
    <div className="w-full h-full">
      <EditorTabs paneId={paneId} />
      {focusedTab && <EditorTabPanel paneId={paneId} tab={focusedTab} />}
    </div>
  );
}

export interface EditorProps {
  paneId: string;
}
