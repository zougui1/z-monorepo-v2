import { useAppSelector, useAppDispatch } from 'app/store';
import { dirname } from 'app/utils';

import { NodeList } from '../NodeList';
import {
  hoverDirectory,
  selectIsNodeOpen,
  selectDirectoryNodes,
} from '../../slice';
import type { NodeClickEventHandler } from '../../types';

export const NodeSubList = ({ path, depth, onNodeClick }: NodeSubListProps) => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectIsNodeOpen(path));
  const nodes = useAppSelector(selectDirectoryNodes(path));

  if (!isOpen) {
    return null;
  }

  return (
    <NodeList
      nodes={nodes}
      depth={depth + 1}
      onMouseEnter={() => dispatch(hoverDirectory(path))}
      onMouseLeave={() => dispatch(hoverDirectory(dirname(path)))}
      onNodeClick={onNodeClick}
    />
  );
}

export interface NodeSubListProps {
  path: string;
  depth: number;
  onNodeClick?: NodeClickEventHandler | undefined;
}
