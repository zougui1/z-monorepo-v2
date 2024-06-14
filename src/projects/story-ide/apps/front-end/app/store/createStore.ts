import { configureStore } from '@reduxjs/toolkit';

import { explorerSlice } from 'app/features/explorer/slice';
import { splitViewsSlice } from 'app/features/split-views/slice';
import { editorSlice } from 'app/features/editor/slice';

export const createStore = (preloadedState?: any) => {
  return configureStore({
    preloadedState,
    reducer: {
      explorer: explorerSlice.reducer,
      splitViews: splitViewsSlice.reducer,
      editor: editorSlice.reducer,
    },
  });
}
