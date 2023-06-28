import type { GridData, InternalViewData } from '../types'

const minSize = 200;

export const initGridsBoundings = (grids: GridData[], width: number, height: number): Record<string, InternalViewData[]> => {
  const gridsBoundings: Record<string, InternalViewData[]> = {};

  const addGridBoundings = (grid: GridData, parentWidth: number, parentHeight: number): void => {
    gridsBoundings[grid.id] = grid.views.map((view, index) => {
      const bounding = grid.direction === 'horizontal'
        ? {
          height: parentHeight,
          width: Math.floor(parentWidth / grid.views.length),
          top: 0,
          left: -Math.floor((parentWidth / (index + 1)) - parentWidth),
        }
        : {
          width: parentWidth,
          height: Math.floor(parentHeight / grid.views.length),
          left: 0,
          top: -Math.floor((parentHeight / (index + 1)) - parentHeight),
        };

      if ('direction' in view) {
        addGridBoundings(view, bounding.width, bounding.height);
      }

      const fullBounding: InternalViewData = {
        ...bounding,
        minWidth: 'direction' in view
          ? gridsBoundings[view.id].reduce((acc, v) => v.minWidth + acc, 0)
          : minSize,
        minHeight: 'direction' in view
          ? gridsBoundings[view.id].reduce((acc, v) => v.minHeight + acc, 0)
          : minSize,
        maxWidth: parentWidth,
        maxHeight: parentHeight,
      };

      return fullBounding;
    });
  }

  for (const grid of grids) {
    addGridBoundings(grid, width, height);
  }

  return gridsBoundings;
}
