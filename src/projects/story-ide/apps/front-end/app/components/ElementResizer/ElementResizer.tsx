import React, { useRef, useCallback, useMemo } from 'react';

import { clamp } from '@zougui/common.math-utils';

import { getWebValue } from '~/utils';

import { Handles } from './Handles';
import { useHandle } from './hooks';
import { getContentOffsets } from './utils';
import type { Position } from './enums';
import type { NewBounds } from './types';

const defaultDiagonalOffset = 20;
const minSize = 60;

export const ElementResizer = (props: ElementResizerProps) => {
  const {
    bounding,
    onChange,
    children,
    disabled,
    diagonalsDisabled,
    diagonalOffset = defaultDiagonalOffset,
    handles = [],
    minWidth = minSize,
    maxWidth = Number.MAX_SAFE_INTEGER,
    minHeight = minSize,
    maxHeight = Number.MAX_SAFE_INTEGER,
  } = props;
  const rootRef = useRef<HTMLDivElement | null>(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const enabledHandles = useMemo(() => handles, handles);

  const handleChange = useCallback((bounds: NewBounds) => {
    const width = bounds.width ?? bounding.width;
    const height = bounds.height ?? bounding.height;
    const left = bounds.left ?? bounding.left;
    const top = bounds.top ?? bounding.top;

    onChange({ width, height, left, top });
  }, [bounding.height, bounding.left, bounding.top, bounding.width, onChange])

  const handleProps = useHandle(rootRef, {
    maxHeight,
    maxWidth,
    minHeight,
    minWidth,
    diagonalsDisabled,
    diagonalOffset,
    enabledHandles,
    onChange: handleChange,
  });

  const width = clamp(bounding.width, minWidth, maxWidth);

  const boundingStyle = {
    width,
    height: clamp(bounding.height, minHeight, maxHeight),
    left: clamp(bounding.left, 0, window.innerWidth - width),
    top: clamp(bounding.top, 0, window.innerHeight - bounding.height),
  };
  const contentOffsets = getContentOffsets(handles);

  return (
    <div ref={rootRef} className="absolute flex" style={boundingStyle}>
      <Handles
        handles={handles}
        disabled={disabled}
        {...handleProps}
      />

      <div style={contentOffsets}>
        {children}
      </div>
    </div>
  );
}

export interface ElementResizerProps {
  bounding: Bounding;
  onChange: (bounding: Bounding) => void;
  children?: React.ReactNode;
  minWidth?: number | undefined;
  maxWidth?: number | undefined;
  minHeight?: number | undefined;
  maxHeight?: number | undefined;
  disabled?: boolean | undefined;
  handles?: Position[] | undefined;
  diagonalsDisabled?: boolean | undefined;
  diagonalOffset?: number | undefined;
}

export type Bounding = {
  width: number;
  height: number;
  top: number;
  left: number;
}
