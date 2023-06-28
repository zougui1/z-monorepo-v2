import React, { useCallback } from 'react';
import clsx from 'clsx';

import type { ClientPosition } from './utils';

export const Resizer = ({ split, index, onDragStarted }: ResizerProps) => {
	const handleMouseDown = useCallback(
		(event: React.MouseEvent) => {
			event.preventDefault();

			onDragStarted(index, event);
		},
		[index, onDragStarted],
	);

	const handleTouchStart = useCallback(
		(event: React.TouchEvent) => {
			event.preventDefault();

			onDragStarted(index, event.touches[0]);
		},
		[index, onDragStarted],
	);

	return (
		<div
			className={clsx(
				'bg-transparent, hover:bg-white/10 transition-colors',
				{
					'cursor-ew-resize w-1': split === 'vertical',
					'cursor-ns-resize h-1': split === 'horizontal',
				},
			)}
			onMouseDown={handleMouseDown}
			onTouchStart={handleTouchStart}
		/>
	);
};

export interface ResizerProps {
	split: 'horizontal' | 'vertical';
	index: number;

	onDragStarted: (index: number, pos: ClientPosition) => void;
}
