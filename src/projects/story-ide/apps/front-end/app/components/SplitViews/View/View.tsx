import { useEffect, useMemo } from 'react';

import { Grid } from '../Grid';
import type { ViewData, GridData, InternalViewData } from '../types';
import { ElementResizer, Position, type Bounding } from '../../ElementResizer';

export function View<T>(props: ViewProps<T>) {
  const { grid, view, subViews, viewIndex, renderView, gridsBoundings, setGridsBoundings, width, height } = props;

  const handles = useMemo(() => {
    // no handle needed for the left-most/bottom-most view
    if ((viewIndex + 1) >= grid.views.length) {
      return [];
    }

    if (grid.direction === 'horizontal') {
      return [Position.Right];
    }

    return [Position.Bottom];
  }, [grid.direction, grid.views.length, viewIndex]);

  const handleChange = (newBounding: Bounding): void => {
    setGridsBoundings(gridsBoundings => {
      const newGridBoundings = grid.views.map((v, index) => {
        if (index === viewIndex) {
          return {
            ...bounding,
            ...newBounding,
          };
        }

        if (grid.direction === 'horizontal') {
          return {
            ...(gridsBoundings[grid.id][index]),
            left: newBounding.width,
            width: width - newBounding.width,
          };
        }

        return {
          ...(gridsBoundings[grid.id][index]),
          top: newBounding.height,
          height: height - newBounding.height,
        };
      });

      if (newGridBoundings.some(bound => bound.height < bounding.minHeight || bound.width < bounding.minWidth)) {
        return gridsBoundings;
      }

      return {
        ...gridsBoundings,
        [grid.id]: newGridBoundings,
      }
    });
  }

  const bounding = gridsBoundings[grid.id][viewIndex];

  useEffect(() => {

    if (grid.id === '1-2-2') {
      //console.log(grid.id, viewIndex, 'bounding', bounding)
    }
  }, [grid.id, viewIndex, bounding])

  if (!('direction' in view)) {
    return (
      <ElementResizer
        bounding={bounding}
        onChange={handleChange}
        handles={handles}
        minWidth={bounding.minWidth}
        maxWidth={bounding.maxWidth}
        minHeight={bounding.minHeight}
        maxHeight={bounding.maxHeight}
      >
        {renderView(view.data)}
      </ElementResizer>
    );
  }

  if (subViews) {
    return (
      <ElementResizer
        bounding={bounding}
        onChange={handleChange}
        handles={handles}
        minWidth={bounding.minWidth}
        maxWidth={bounding.maxWidth}
        minHeight={bounding.minHeight}
        maxHeight={bounding.maxHeight}
      >
        <Grid
          grid={view}
          gridsBoundings={gridsBoundings}
          setGridsBoundings={setGridsBoundings}
          renderView={renderView}
          width={bounding.width}
          height={bounding.height}
        />
      </ElementResizer>
    );
  }

  return null;
}

export interface ViewProps<T = unknown> {
  renderView: (data: T) => React.ReactNode;
  grid: GridData<T>;
  view: ViewData<T> | GridData<T>;
  subViews: (ViewData<T> | GridData<T>)[];
  viewIndex: number;
  gridsBoundings: Record<string, InternalViewData[]>;
  setGridsBoundings: React.Dispatch<React.SetStateAction<Record<string, InternalViewData[]>>>;
  width: number;
  height: number;
}
