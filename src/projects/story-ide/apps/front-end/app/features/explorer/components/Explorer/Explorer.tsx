import { useEffect } from 'react';

import { useAppSelector, useAppDispatch, store } from 'app/store';
import { useShortcut } from 'app/hooks';

import { NodeList } from '../NodeList';
import { openDirectory, selectDirectoryNodes, startRenaming } from '../../slice';
import { deleteSelectedNodes } from '../../api';
import { createNodeClickHandler } from '../../utils';

const path = '/';
const depth = 0;

const getDisableExplorerShortcuts = (): boolean => {
  const state = store.getState();

  return (
    state.splitViews.focusedViewId !== 'explorer' ||
    !!state.explorer.renamingPath
  );
}

export const Explorer = () => {
  const nodes = useAppSelector(selectDirectoryNodes(path));
  const isRenaming = useAppSelector(state => !!state.explorer.renamingPath);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(openDirectory({ path, depth }));
  }, [dispatch]);

  useShortcut({
    shortcut: 'Del',
    handler: deleteSelectedNodes,
    getIsDisabled: getDisableExplorerShortcuts,
  });

  useShortcut({
    shortcut: 'F2',
    handler: () => {
      const state = store.getState();
      const selectedPath = state.explorer.selectedPaths.at(-1);

      if(selectedPath) {
        dispatch(startRenaming({ path: selectedPath }));
      }
    },
    getIsDisabled: getDisableExplorerShortcuts,
  });

  return (
    <div className="w-full h-full overflow-y-auto">
      <NodeList
        className="overflow-hidden"
        nodes={nodes}
        depth={depth}
        onNodeClick={createNodeClickHandler(dispatch)}
      />

      {isRenaming && (
        <div className="w-full h-full absolute left-0 top-0 bg-stone-950/50" />
      )}
    </div>
  );
}
