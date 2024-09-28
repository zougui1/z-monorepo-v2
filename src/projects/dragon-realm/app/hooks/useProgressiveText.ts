import { useState, useEffect } from 'react';
import { useRaf } from 'rooks';

const defaultSpeed = 1;

export const useProgressiveText = (
  ref: React.MutableRefObject<HTMLElement | null>,
  text: string,
  options?: UseProgressiveTextOptions | undefined,
) => {
  const { speed = defaultSpeed, onDone } = options || {};

  const [isFullyDisplayed, setIsFullyDisplayed] = useState(false);

  useRaf(() => {
    if(!ref.current) {
      return;
    }

    if (ref.current.textContent?.length === text.length) {
      setIsFullyDisplayed(true);
      onDone?.();
      return;
    }

    ref.current.textContent ??= '';
    const index = ref.current.textContent.length;
    const newSlice = text.slice(index, index + speed + 1);
    ref.current.textContent += newSlice;
  }, !isFullyDisplayed);

  useEffect(() => {
    if (ref.current) {
      ref.current.textContent = '';
    }

    setIsFullyDisplayed(false);
  }, [ref, text]);
}

export interface UseProgressiveTextOptions {
  speed?: number | undefined;
  onDone?: (() => void) | undefined;
}
