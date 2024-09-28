import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrthographicCamera, Line, Box } from '@react-three/drei';

import { MovableDot } from '~/components/canvas/MovableDot';
import { pointInBox } from '~/utils';
import { useWindowEvent } from '~/hooks';
import { VectorArray } from '~/types';
import { useGame } from '~/contexts';
import type { LocationData } from '~/game/location';
import type { ExitData } from '~/game';

const EXIT_STATIC_SIZE = 1;
const SQUARE_SIZE = 1;

/**
 * Calculates the maximum zoom level for fitting all elements within the canvas.
 * @param canvasWidth - The width of the canvas.
 * @param canvasHeight - The height of the canvas.
 * @param x1 - The minimum x-coordinate of the elements.
 * @param y1 - The minimum y-coordinate of the elements.
 * @param x2 - The maximum x-coordinate of the elements.
 * @param y2 - The maximum y-coordinate of the elements.
 * @returns The maximum zoom level to fit all elements within the canvas.
 */
function calculateMaxZoomLevel(
  canvasWidth: number,
  canvasHeight: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  // Calculate the width and height of the bounding box
  const boundingBoxWidth = Math.abs(x2 - x1);
  const boundingBoxHeight = Math.abs(y2 - y1);

  // Calculate the scale factors to fit the bounding box within the canvas
  const scaleX = canvasWidth / boundingBoxWidth;
  const scaleY = canvasHeight / boundingBoxHeight;

  // The maximum zoom level is the smaller of the two scale factors
  return Math.min(scaleX, scaleY);
}

const CANVAS_PADDING_DIVIDER = 1.0391;

export const Map = ({ boundaryPoints, locations, exits, onLocation, onExit, onMove, position, setPosition }: MapProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [zoom, setZoom] = useState(1);

  const handleMove = ([x, y, z]: VectorArray) => {
    const location = locations.find(location => (
      pointInBox(x, y, location.position[0], location.position[1], SQUARE_SIZE, SQUARE_SIZE)
    ));

    if (location) {
      console.log('entered location');
      onLocation(location);
      return;
    }

    const exit = exits.find(exit => {
      const width = exit.direction === 'horizontal' ? exit.size : EXIT_STATIC_SIZE;
      const height = exit.direction === 'vertical' ? exit.size : EXIT_STATIC_SIZE;

      return pointInBox(x, y, exit.position[0], exit.position[1], width, height);
    });

    if (exit) {
      console.log('entered exit')
      onExit(exit);
      return;
    }

    onMove([x, y, z]);
  }

  const defineZoom = () => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const xPoints = boundaryPoints.map(([x]) => x);
    const yPoints = boundaryPoints.map(([, y]) => y);

    setZoom(calculateMaxZoomLevel(
      canvas.offsetWidth / CANVAS_PADDING_DIVIDER,
      canvas.offsetHeight / CANVAS_PADDING_DIVIDER,
      Math.min(...xPoints),
      Math.min(...yPoints),
      Math.max(...xPoints),
      Math.max(...yPoints),
    ))
  }

  useWindowEvent('resize', defineZoom, [boundaryPoints]);
  useEffect(() => {
    setTimeout(defineZoom, 100);
  }, []);

  return (
    <Canvas ref={canvasRef} className="border border-red-600">
      <OrthographicCamera makeDefault position={[0, 0, 10]} zoom={zoom} />
      <Line
        points={boundaryPoints}
        color="white"
        lineWidth={1}
      />

      {exits.map(exit => (
        <Box
          key={exit.position.join('/')}
          position={exit.position}
          args={[
            exit.direction === 'horizontal' ? exit.size : EXIT_STATIC_SIZE,
            exit.direction === 'vertical' ? exit.size : EXIT_STATIC_SIZE,
            0,
          ]}
          material-color="#102ab9"
        />
      ))}

      {locations.map(location => (
        <Box
          key={location.name}
          position={location.position}
          args={[SQUARE_SIZE, SQUARE_SIZE, 0]}
          material-color="#ce1014"
        />
      ))}

      <MovableDot
        boundaryPoints={boundaryPoints}
        onMove={handleMove}
        position={position}
        setPosition={setPosition}
      />
    </Canvas>
  );
}

export interface MapProps {
  boundaryPoints: VectorArray[];
  locations: LocationData[];
  exits: ExitData[];
  position: VectorArray;
  setPosition: React.Dispatch<React.SetStateAction<VectorArray>>;
  onLocation: (location: LocationData) => void;
  onExit: (exit: ExitData) => void;
  onMove: (position: VectorArray) => void;
}
