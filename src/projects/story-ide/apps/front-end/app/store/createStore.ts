import { configureStore } from '@reduxjs/toolkit';

import { explorerSlice } from '~/features/explorer/slice';
import { splitViewsSlice } from '~/features/split-views/slice';
import { editorSlice } from '~/features/editor/slice';

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
