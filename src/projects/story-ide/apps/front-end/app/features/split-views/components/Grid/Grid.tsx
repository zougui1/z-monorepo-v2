import clsx from 'clsx';

import { SplitPane } from 'app/components/SplitPane';
import { useAppDispatch, store } from 'app/store';

import { View } from '../View';
import { resizeGrid } from '../../slice/slice';
import type { SplitGrid, ViewRenderer } from '../../types';

export const Grid = ({ grid, renderView }: GridProps) => {
  const dispatch = useAppDispatch();

  return (
    <SplitPane
      split={grid.direction === 'horizontal' ? 'vertical' : 'horizontal'}
      minSize={200}
      onDragFinished={sizes => dispatch(resizeGrid({ gridId: grid.id, sizes }))}
      defaultSizes={store.getState().splitViews.gridsSizes[grid.id]}
      className={clsx('divide-gray-700', {
        'divide-y-2': grid.direction === 'vertical',
        'divide-x-2': grid.direction === 'horizontal',
      })}
    >
      {grid.views.map(view => (
        <View
          key={view.id}
          view={view}
          renderView={renderView}
        />
      ))}
    </SplitPane>
  );
}

export interface GridProps {
  grid: SplitGrid;
  renderView: ViewRenderer;
}
