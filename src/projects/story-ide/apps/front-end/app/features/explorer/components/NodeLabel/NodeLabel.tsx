import { Typography, CircularProgress } from '@mui/material';
import clsx from 'clsx';
import { useDrag } from 'react-dnd';

import type { FS } from '@zougui/story-ide.types';

import { useAppSelector } from '~/store';

import { getNodeTypeIcon, getExpandIcon } from './utils';
import { NodeBorders } from '../NodeBorders';
import { NodeName } from '../NodeName';
import {
  selectIsNodeOpen,
  selectIsDirectoryLoading,
  selectIsRenamingNode,
} from '../../slice';
import { ExplorerDndType } from '../../enums';
import type { NodeClickEventHandler } from '../../types';

export const NodeLabel = ({ node, depth, onClick }: NodeLabelProps) => {
  const isOpen = useAppSelector(selectIsNodeOpen(node.path));
  const isLoading = useAppSelector(selectIsDirectoryLoading(node.path));
  const isRenaming = useAppSelector(selectIsRenamingNode(node.path));

  const [, dragRef] = useDrag(() => ({
    type: ExplorerDndType.Node,
    item: { path: node.path },
  }));

  const NodeTypeIcon = getNodeTypeIcon(node.name, node.type, isOpen);
  const ExpandIcon = getExpandIcon(node.type, isOpen);
  const isDir = node.type === 'dir';

  return (
    <Typography
      component="span"
      className={clsx(
        'flex items-center text-gray-200',
        { 'relative z-50': isRenaming }
      )}
      onClick={event => onClick?.(event, node)}
    >
      <NodeBorders path={node.path} depth={depth} />

      {ExpandIcon && <ExpandIcon />}

      <span ref={dragRef} className="flex items-center">
        <NodeTypeIcon className={clsx('text-xl mr-2 mt-0.5 shrink-0', { 'ml-6': !isDir })} />
        <NodeName node={node} />
      </span>

      {isLoading && <CircularProgress size={20} className="ml-2" />}
    </Typography>
  );
}

export interface NodeLabelProps {
  node: FS.Node;
  depth: number;
  onClick?: NodeClickEventHandler | undefined;
}
