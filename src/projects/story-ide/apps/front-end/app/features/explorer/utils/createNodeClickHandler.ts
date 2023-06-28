import type { FS } from '@zougui/story-ide.types';

import type { AppDispatch } from '~/store';
import { openFile } from '~/features/editor/slice';

import { persistentSelectNode, addSelectedPath } from '../slice';

export const createNodeClickHandler = (dispatch: AppDispatch) => (event: React.MouseEvent, node: FS.Node): void => {
  if (event.ctrlKey) {
    event.preventDefault();
    dispatch(addSelectedPath({ path: node.path }));
    return;
  }

  if (event.shiftKey) {
    // TODO add every node between the last selected path and the current path to the selection
    return;
  }

  dispatch(persistentSelectNode(node.path));

  if (node.type === 'file') {
    dispatch(openFile({ path: node.path }));
  }
}
