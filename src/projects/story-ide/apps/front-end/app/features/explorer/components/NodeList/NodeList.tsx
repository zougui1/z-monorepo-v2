import { memo, type HTMLProps } from 'react';

import type { FS } from '@zougui/story-ide.types';

import { Node } from '../Node';
import { sortNodes } from '../../utils';
import type { NodeClickEventHandler } from '../../types';

export const NodeList = memo(function NodeListMemo({ nodes, depth, onNodeClick, ...rest }: NodeListProps) {
  return (
    <ul {...rest}>
      {nodes.slice().sort(sortNodes).map(node => (
        <Node
          key={node.path}
          node={node}
          depth={depth}
          onClick={onNodeClick}
        />
      ))}
    </ul>
  );
});

export interface NodeListProps extends HTMLProps<HTMLUListElement> {
  nodes: FS.Node[];
  depth: number;
  onNodeClick?: NodeClickEventHandler | undefined;
}
