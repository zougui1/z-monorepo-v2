import { useEffect, useRef, useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrthographicCamera } from '@react-three/drei';
import { isNumber } from 'radash';

import { pointInBox } from '~/utils';
import { useWindowEvent } from '~/hooks';
import type { VectorArray } from '~/types';
import type { LocationData } from '~/game/location';
import type { ExitData } from '~/game';

import { MapProvider, type MapProviderProps } from './context';
import { CANVAS_PADDING_DIVIDER, EXIT_STATIC_SIZE, LOCATION_SIZE } from './constants';
import { calculateMaxZoomLevel } from './utils';

const DEFAULT_ZOOM = 'auto';

export const Map = (props: MapProps) => {
  const {
    children,
    boundaryPoints,
    locations,
    exits,
    onMove,
    onExit,
    onLocation,
    className,
    zoom: propsZoom = DEFAULT_ZOOM,
    ...rest
  } = props;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [internalZoom, setInternalZoom] = useState(1);

  const zoom = isNumber(propsZoom) ? propsZoom : internalZoom;

  const handleMove = ([x, y, z]: VectorArray) => {
    const location = locations.find(location => (
      pointInBox(x, y, location.position[0], location.position[1], LOCATION_SIZE, LOCATION_SIZE)
    ));

    if (location) {
      console.log('entered location');
      onLocation?.(location);
      return;
    }

    const exit = exits.find(exit => {
      const width = exit.direction === 'horizontal' ? exit.size : EXIT_STATIC_SIZE;
      const height = exit.direction === 'vertical' ? exit.size : EXIT_STATIC_SIZE;

      return pointInBox(x, y, exit.position[0], exit.position[1], width, height);
    });

    if (exit) {
      console.log('entered exit')
      onExit?.(exit);
      return;
    }

    onMove?.([x, y, z]);
  }

  const defineZoom = useCallback(() => {
    const canvas = canvasRef.current;

    if (!canvas || isNumber(propsZoom)) {
      return;
    }

    const xPoints = boundaryPoints.map(([x]) => x);
    const yPoints = boundaryPoints.map(([, y]) => y);

    setInternalZoom(calculateMaxZoomLevel(
      canvas.offsetWidth / CANVAS_PADDING_DIVIDER,
      canvas.offsetHeight / CANVAS_PADDING_DIVIDER,
      Math.min(...xPoints),
      Math.min(...yPoints),
      Math.max(...xPoints),
      Math.max(...yPoints),
    ))
  }, [boundaryPoints, propsZoom]);

  useWindowEvent('resize', defineZoom, [defineZoom]);
  useEffect(() => {
    setTimeout(defineZoom, 100);
  }, [defineZoom]);

  return (
    <MapProvider
      boundaryPoints={boundaryPoints}
      locations={locations}
      exits={exits}
      onMove={handleMove}
    >
      <Canvas
        ref={canvasRef}
        className={className}
        onClick={e => rest.onClick?.(e, zoom)}
        onMouseMove={e => rest.onMouseMove?.(e, zoom)}
        onMouseLeave={e => rest.onMouseLeave?.(e, zoom)}
      >
        <OrthographicCamera makeDefault position={[0, 0, 10]} zoom={zoom} />

        {children}
      </Canvas>
    </MapProvider>
  )
}

export interface MapProps extends Omit<MapProviderProps, 'onMove'> {
  zoom?: number | 'auto';
  className?: string;
  onLocation?: (location: LocationData) => void;
  onExit?: (exit: ExitData) => void;
  onMove?: (position: VectorArray) => void;
  onClick?: (event: React.MouseEvent<HTMLDivElement>, zoom: number) => void;
  onMouseMove?: (event: React.MouseEvent<HTMLDivElement>, zoom: number) => void;
  onMouseLeave?: (event: React.MouseEvent<HTMLDivElement>, zoom: number) => void;
}
