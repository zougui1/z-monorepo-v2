import { useState, useEffect } from 'react';

import { initGridsBoundings } from './utils';
import { Grid } from './Grid';
import type { GridData, InternalViewData } from './types';

export function SplitViews<T>(props: SplitViewsProps<T>) {
  const { grids, renderView, width, height } = props;
  const [gridsBoundings, setGridsBoundings] = useState<Record<string,InternalViewData[]>>(() => {
    return initGridsBoundings(grids, width, height);
  });

  useEffect(() => {
    console.log('boundings:', initGridsBoundings(grids, width, height));
  }, [grids, width, height])

  return (
    <div className="relative">
      {grids.map(grid => (
        <Grid
          key={grid.id}
          grid={grid}
          renderView={renderView as any}
          gridsBoundings={gridsBoundings}
          setGridsBoundings={setGridsBoundings}
          width={width}
          height={height}
        />
      ))}
    </div>
  );
}

export interface SplitViewsProps<T = unknown> {
  renderView: (data: T) => React.ReactNode;
  grids: GridData<T>[];
  width: number;
  height: number;
}
