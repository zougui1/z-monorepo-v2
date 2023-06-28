import { store } from '~/store';

import { closeDirectory } from './slice';
import { openDirectory, type OpenDirectoryPayload } from './middlewares';
import { selectIsNodeOpen } from './selectors';

export const toggleDirectory = (
  payload: OpenDirectoryPayload,
): ReturnType<typeof openDirectory> | ReturnType<typeof closeDirectory> => {
  const state = store.getState();
  const isNodeOpen = selectIsNodeOpen(payload.path)(state);
  const toggle = isNodeOpen ? closeDirectory : openDirectory;

  return toggle(payload);
}
