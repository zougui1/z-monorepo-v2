import { useRef } from 'react';

import { useProgressiveText } from '~/hooks';

import { Typography, TypographyProps } from './Typography';

export const ProgressiveText = ({ speed, text, onDone, ...rest }: ProgressiveTextProps) => {
  const typoRef = useRef<HTMLParagraphElement | null>(null);
  useProgressiveText(typoRef, text, { speed, onDone });

  return (
    <Typography
      {...rest}
      variant="p"
      ref={typoRef}
    />
  );
}

export interface ProgressiveTextProps extends Omit<TypographyProps, 'children' | 'ref' | 'variant'> {
  text: string;
  speed?: number | undefined;
  onDone?: (() => void) | undefined;
}
