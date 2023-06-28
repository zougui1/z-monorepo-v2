import clsx from 'clsx';

import { View } from '../View';
import type { GridData, InternalViewData } from '../types';

export function Grid<T>(props: GridProps<T>) {
  const { grid, renderView, gridsBoundings, setGridsBoundings, width, height } = props;

  return (
    <div
      className={clsx(
        'flex',
        {
          'flex-row': grid.direction === 'horizontal',
          'flex-col': grid.direction === 'vertical',
        }
      )}
    >
      {grid.views.map((view, viewIndex) => (
        'direction' in view ? (
          <View
            key={view.id}
            gridsBoundings={gridsBoundings}
            setGridsBoundings={setGridsBoundings}
            grid={grid}
            view={view}
            subViews={view.views}
            viewIndex={viewIndex}
            renderView={renderView}
            width={width}
            height={height}
          />
        ) : (
          <View
            key={view.id}
            gridsBoundings={gridsBoundings}
            setGridsBoundings={setGridsBoundings}
            grid={grid}
            view={view}
            viewIndex={viewIndex}
            renderView={renderView}
            width={width}
            height={height}
          />
        )
      ))}
    </div>
  );
}

export interface GridProps<T = unknown> {
  renderView: (data: T) => React.ReactNode;
  grid: GridData<T>;
  gridsBoundings: Record<string, InternalViewData[]>;
  setGridsBoundings: React.Dispatch<React.SetStateAction<Record<string, InternalViewData[]>>>;
  width: number;
  height: number;
}
