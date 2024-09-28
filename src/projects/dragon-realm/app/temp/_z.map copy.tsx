import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrthographicCamera, Line } from '@react-three/drei';

const MapBorders = ({ size }) => {
  return (
    <>
      <Line
        points={[
          [-size, -size, 0],
          [size, -size, 0],
          [size, size, 0],
          [-size, size, 0],
          [-size, -size, 0],
        ]}
        color="white"
        lineWidth={1}
      />
    </>
  );
};

const MovableDot = ({ size }) => {
  const [position, setPosition] = useState<[number, number, number]>([0, 0, 0]);
  const speed = 0.1;

  const handleKeyDown = (event) => {
    setPosition((prevPosition) => {
      let [x, y, z] = prevPosition;
      switch (event.key) {
        case 'ArrowUp':
          y = Math.min(size - 0.2, y + speed);
          break;
        case 'ArrowDown':
          y = Math.max(-size, y - speed);
          break;
        case 'ArrowLeft':
          x = Math.max(-size, x - speed);
          break;
        case 'ArrowRight':
          x = Math.min(size, x + speed);
          break;
        default:
          break;
      }
      return [x, y, z];
    });
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <mesh position={position}>
      <circleGeometry args={[0.2, 32]} />
      <meshBasicMaterial color="white" />
    </mesh>
  );
};

const Map = () => {
  const mapSize = 5; // Size of the map

  return (
    <Canvas>
      <OrthographicCamera makeDefault position={[0, 0, 10]} zoom={50} />
      <MapBorders size={mapSize} />
      <MovableDot size={mapSize} />
    </Canvas>
  );
};

export default function MapIndex() {
  return (
    <div className="w-full" style={{ height: 'calc(100vh - 5rem)' }}>
      <Map />
    </div>
  );
}
