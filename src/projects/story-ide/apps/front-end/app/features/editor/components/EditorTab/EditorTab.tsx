import { Tab, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import clsx from 'clsx';

//import { Tab } from '~/components/Tab';
import { useAppSelector, useAppDispatch } from '~/store';
import { getFileName } from '~/utils';
import { getFileTypeIcon } from '~/utils';

import { closeTab, selectTab, selectPane } from '../../slice';

export const EditorTab = ({ paneId, tabId, value, ...rest }: EditorTabProps) => {
  const dispatch = useAppDispatch();
  const tab = useAppSelector(selectTab({ paneId, tabId }));
  const focusedTabId = useAppSelector(state => selectPane(paneId)(state)?.focusedTabId);
  const isSelected = tab?.id === focusedTabId;

  const close = () => {
    dispatch(closeTab({ paneId, tabId }));
  }

  const handleAuxClick = (event: React.MouseEvent): void => {
    // mouse wheel click
    if (event.button === 1) {
      close();
    }
  }

  if(!tab) {
    return null;
  }

  const FileIcon = getFileTypeIcon(tab.path);

  return (
    <Tab
      {...rest}
      id={`tab-${tab.id}`}
      aria-controls={`tabpanel-${tab.id}`}
      className="!normal-case !hover:invisible-children:visible flex !px-2 !py-1"
      label={(
        <div className="flex items-center">
          <FileIcon className="text-xl mr-2 shrink-0" />

          <span className="mr-1">
            {getFileName(tab.path)}
          </span>

          {/* @ts-ignore the property "component" is missing in the comoponent's interface, but it works */}
          <IconButton
            component="span"
            type="button"
            className={clsx('!p-1', { '!invisible': !isSelected })}
            onClick={close}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </div>
      )}
      value={value}
      onAuxClick={handleAuxClick}
    />
  );
}

export interface EditorTabProps {
  paneId: string;
  tabId: string;
  value: string;
}
