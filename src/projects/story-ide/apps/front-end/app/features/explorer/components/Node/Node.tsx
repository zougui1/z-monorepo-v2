import clsx from 'clsx';

import type { FS } from '@zougui/story-ide.types';

import { useAppSelector, useAppDispatch } from '~/store';
import { useBodyCursor } from '~/hooks';

import { NodeLabel } from '../NodeLabel';
import { NodeSubList } from '../NodeSubList';
import {
  persistentSelectNode,
  selectIsNodeSelected,
  toggleDirectory,
} from '../../slice';
import type { NodeClickEventHandler } from '../../types';

export const Node = ({ node, depth, onClick }: NodeProps) => {
  const dispatch = useAppDispatch();
  const isSelected = useAppSelector(selectIsNodeSelected(node.path));
  const bodyCursor = useBodyCursor();

  const isDir = node.type === 'dir';

  const handleClick = (event: React.MouseEvent) => {
    onClick?.(event, node);

    if (!event.isDefaultPrevented() && isDir) {
      dispatch(toggleDirectory({ path: node.path, depth }));
    }
  }

  return (
    <li>
      <div
        className={clsx(
          'hover:bg-gray-200/10 select-none',
          {
            'bg-gray-200/25': isSelected,
            'hover:bg-gray-200/30': isSelected,
          },
        )}
        onClick={handleClick}
        onMouseEnter={() => bodyCursor.set('pointer')}
        onMouseLeave={bodyCursor.reset}
      >
        <NodeLabel
          node={node}
          depth={depth}
          onClick={onClick}
        />
      </div>

      <NodeSubList
        path={node.path}
        depth={depth}
        onNodeClick={onClick}
      />
    </li>
  );
}

export interface NodeProps {
  node: FS.Node;
  depth: number;
  onClick?: NodeClickEventHandler | undefined;
}
