import { useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Circle } from '@react-three/drei';

import { useWindowEvent } from '~/hooks';
import { pointInPolygon } from '~/utils';
import type { VectorArray } from '~/types';

const SPEED = 0.15*3;
const RADIUS = 0.3;

export const MovableDot = ({ boundaryPoints, onMove, position, setPosition }: MovableDotProps) => {
  const [keysDown, setKeysDown] = useState<Set<string>>(new Set());

  useWindowEvent('keydown', event => {
    setKeysDown(keysDown => {
      if(keysDown.has(event.key)) {
        return keysDown;
      }

      return new Set([...keysDown, event.key]);
    });
  });

  useWindowEvent('keyup', event => {
    setKeysDown(keysDown => {
      if(!keysDown.has(event.key)) {
        return keysDown;
      }

      const newKeysDown = new Set(keysDown);
      newKeysDown.delete(event.key);

      return newKeysDown;
    });
  });

  const moveDot = () => {
    setPosition((prevPosition) => {
      const [x, y, z] = prevPosition;
      let newX = x;
      let newY = y;

      for (const keyDown of keysDown) {
        let nextX = x;
        let nextY = y;

        switch (keyDown) {
          case 'ArrowUp':
            nextY += SPEED;
            break;
          case 'ArrowDown':
            nextY -= SPEED;
            break;
          case 'ArrowLeft':
            nextX -= SPEED;
            break;
          case 'ArrowRight':
            nextX += SPEED;
            break;
        }

        if (pointInPolygon([nextX, nextY], boundaryPoints, RADIUS)) {
          if (nextX !== x) newX = nextX;
          if (nextY !== y) newY = nextY;
        }
      }

      if (newX === x && newY === y) {
        return prevPosition;
      }

      const newPosition: VectorArray = [newX, newY, z];
      onMove?.(newPosition)

      return newPosition;
    });
  }

  useFrame(() => {
    if (keysDown.size) {
      moveDot();
    }
  });

  return (
    <Circle
      position={position}
      args={[RADIUS, 32]}
      material-color="white"
    />
  );
}

export interface MovableDotProps {
  boundaryPoints: VectorArray[];
  position: VectorArray;
  setPosition: React.Dispatch<React.SetStateAction<VectorArray>>;
  onMove?: (position: VectorArray) => void;
}
