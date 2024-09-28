import { Line, type LineProps } from '@react-three/drei';

import type { VectorArray } from '~/types';

import { useMap } from '../context';

export const MapBoundaries = ({ hover, ...rest }: MapBoundariesProps) => {
  const state = useMap();

  if(!state.boundaryPoints.length) {
    return null;
  }

  return (
    <Line
      points={state.boundaryPoints}
      color="white"
      lineWidth={2}
      {...rest}
    />
  );
}

export interface MapBoundariesProps extends Partial<LineProps> {
  boundaryPoints?: VectorArray[];
}
