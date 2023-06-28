import { useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { useAppSelector, useAppDispatch } from '~/store';
import { initSplitViews } from '~/features/split-views/slice';
import { SplitViews } from '~/features/split-views/components/SplitViews';
import { Explorer } from '~/features/explorer/components/Explorer';
import { Editor } from '~/features/editor/components/Editor';

export default function Workspaces() {
  const dispatch = useAppDispatch();
  const grid = useAppSelector(state => state.splitViews.grid);

  useEffect(() => {
    if (!grid) {
      dispatch(initSplitViews({
        grid: {
          direction: 'horizontal',
          id: 'root',
          views: [
            { id: 'explorer' },
            { id: 'editor' },
          ],
        },

        gridSizes: {
          root: [300, 1600],
        },
      }));
    }
  }, [dispatch, grid]);

  return (
    <DndProvider backend={HTML5Backend}>
      <SplitViews
        renderView={view => {
          if (view.id === 'explorer') {
            return <Explorer />;
          }

          return <Editor paneId={view.id} />;
        }}
      />
    </DndProvider>
  );
}
