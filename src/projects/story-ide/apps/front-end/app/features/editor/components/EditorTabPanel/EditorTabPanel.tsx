import { useRef } from 'react';
import clsx from 'clsx';
import { Editor as MonacoEditor } from '@monaco-editor/react';

import { isElectron } from '~/utils';

import { useTabEditor } from './hooks';
import { useEditorDrop } from '../../hooks';
import { DropPosition } from '../../enums';
import { config } from '../../config';
import type { EditorTab } from '../../slice';

export const EditorTabPanel = ({ paneId, tab }: EditorTabPanelProps) => {
  const { monaco, onMount } = useTabEditor(paneId);
  const [{ isOver, position }, dropRef] = useEditorDrop(paneId);
  const editorConfig = useRef({
    ...config,
    readOnly: !isElectron,
  });

  return (
    <div
      ref={dropRef}
      role="tabpanel"
      id={`tabpanel-${tab.id}`}
      aria-labelledby={`tab-${tab.id}`}
      className="h-full px-4"
    >
      {monaco && (
        <MonacoEditor
          value={tab.content}
          language="zdown"
          theme="zdown"
          onMount={onMount}
          options={editorConfig.current}
        />
      )}

      {isOver && (
        <div
          className={clsx(
            'absolute bg-gray-200/20',
            {
              'top-0 left-0 w-full h-full': position === DropPosition.Neutral,
              'top-0 left-0 w-1/2 h-full': position === DropPosition.Left,
              'top-0 right-0 w-1/2 h-full': position === DropPosition.Right,
              'top-0 left-0 w-full h-1/2': position === DropPosition.Top,
              'bottom-0 left-0 w-full h-1/2': position === DropPosition.Bottom,
            }
          )}
        />
      )}
    </div>
  );
}

export interface EditorTabPanelProps {
  paneId: string;
  tab: EditorTab;
}
