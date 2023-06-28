import { TreeNode } from '~/utils';

import type { SplitGrid, SplitView } from '../types';

export const createTree = (grid: SplitGrid): TreeNode<SplitGrid, SplitView> => {
  return new TreeNode<SplitGrid, SplitView>(grid, {
    getIsLeaf: node => !('views' in node),
    getChildren: node => node.views,
  });
}
