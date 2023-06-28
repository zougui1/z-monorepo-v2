import clsx from 'clsx';

import { useAppSelector } from '~/store';

import {
  selectHoveredDirectory,
  selectHoveredDirectoryPath,
} from '../../slice';

export const NodeBorders = ({ path, depth }: NodeBordersProps) => {
  const hoveredDepth = useAppSelector(state => selectHoveredDirectory(state).depth);
  const hoveredDirectory = useAppSelector(selectHoveredDirectoryPath);

  const getIsHovered = (depth: number) => {
    return path.startsWith(hoveredDirectory + '/') && depth === hoveredDepth;
  }

  return (
    <>
      {new Array(depth).fill(0).map((v, index) => (
        <span
          key={index}
          className={clsx(
            'border-l border-solid border-gray-200/25 h-6 ml-3 transition-colors',
            `node-${path}-border-${depth} node-border`,
            { 'border-gray-200/40': getIsHovered(index) },
          )}
          style={{ width: 3, minWidth: 3 }}
        />
      ))}
    </>
  );
}

export interface NodeBordersProps {
  path: string;
  depth: number;
}
