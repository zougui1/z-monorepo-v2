import { useState, useEffect } from 'react';

const animationSpeed = {
  normal: 1,
  fast: 10,
};

export const useTextSpeed = (text: string): UseTextSpeedResult => {
  const [speed, setSpeed] = useState(animationSpeed.normal);

  const increaseSpeed = () => {
    setSpeed(animationSpeed.fast);
  }

  useEffect(() => {
    return () => {
      setSpeed(animationSpeed.normal);
    }
  }, [text]);

  return { speed, increaseSpeed };
}

export interface UseTextSpeedResult {
  speed: number;
  increaseSpeed: () => void;
}
