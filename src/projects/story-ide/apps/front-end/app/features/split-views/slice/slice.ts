import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';

import { DropPosition } from '~/features/editor/enums';

import { createTree } from '../utils';
import type { SplitGrid } from '../types';

export interface SplitViewsState {
  grid: SplitGrid;
  /**
   * The key is the grid ID
   */
  gridsSizes: Record<string, number[] | undefined>;
  focusedViewId: string;
}

const initialState: SplitViewsState = {
  grid: {
    direction: 'horizontal',
    id: 'root',
    views: [
      { id: 'explorer' },
      { id: 'editor' },
    ],
  },

  gridsSizes: {
    root: [300, 1600],
  },

  focusedViewId: 'explorer',
};

export const splitViewsSlice = createSlice({
  name: 'split-views',
  initialState,
  reducers: {
    initSplitViews: (state, { payload }: PayloadAction<InitSplitViewsPayload>) => {
      state.grid = payload.grid;
      state.gridsSizes = payload.gridSizes || {};
    },

    resizeGrid: (state, { payload }: PayloadAction<{ gridId: string; sizes: number[] }>) => {
      state.gridsSizes[payload.gridId] = payload.sizes;
    },

    splitView: (state, { payload }: PayloadAction<SplitViewPayload>) => {
      const tree = createTree(state.grid);
      const node = tree.find(node => node.id === payload.id);

      // the parent (if any) should always be a branch; just for type-safety
      if (!node?.parent?.getIsBranch()) {
        return;
      }

      const newGrid = {
        id: nanoid(),
        direction: [DropPosition.Left, DropPosition.Right].includes(payload.position)
          ? 'horizontal'
          : 'vertical',
        views: [node.data],
      };
      const newView = { id: payload.newViewId };

      if (node.getIsLeaf()) {
        node.parent.data.views = node.parent.data.views.map(view => {
          if (view.id !== payload.id) {
            return view;
          }

          return newGrid;
        });
      }

      if ([DropPosition.Left, DropPosition.Top].includes(payload.position)) {
        newGrid.views.unshift(newView);
      } else {
        newGrid.views.push(newView);
      }

      state.focusedViewId = newGrid.id;
    },

    removeView: (state, { payload }: PayloadAction<RemoveViewPayload>) => {
      const tree = createTree(state.grid);
      const node = tree.find(node => node.id === payload.id);


      // the parent (if any) should always be a branch; just for type-safety
      // if the parent is the root node then we don't remove the view
      if (!node?.parent?.getIsBranch()) {
        return;
      }

      node.parent.data.views = node.parent.data.views.filter(view => view.id !== payload.id);
      delete state.gridsSizes[node.parent.data.id];

      const getIsDeletedViewFocused = () => state.focusedViewId === payload.id || !state.focusedViewId;

      if (getIsDeletedViewFocused()) {
        state.focusedViewId = node.parent.data.views.at(0)?.id || '';
      }

      if (node.parent.data.views.length > 1) {
        return;
      }

      if (!node.parent.parent?.getIsBranch()) {
        return;
      }

      // if the parent grid has only 1 view then we turn it into a view
      // with the ID of its only child
      node.parent.parent.data.views = node.parent.parent.data.views.map(view => {
        if (!node.parent?.getIsBranch()) {
          return view;
        }

        if (view.id !== node.parent.data.id) {
          return view;
        }

        return {
          id: node.parent.data.views[0].id
        };
      });

      state.focusedViewId = node.parent.data.views[0].id;
    },

    focusView: (state, { payload }: PayloadAction<{ id: string }>) => {
      state.focusedViewId = payload.id;
    },
  },
});


export const {
  initSplitViews,
  resizeGrid,
  splitView,
  removeView,
  focusView,
} = splitViewsSlice.actions;

export interface InitSplitViewsPayload {
  grid: SplitGrid;
  gridSizes?: Record<string, number[] | undefined> | undefined;
}

export interface SplitViewPayload {
  id: string;
  newViewId: string;
  position: DropPosition;
}

export interface RemoveViewPayload {
  id: string;
}
