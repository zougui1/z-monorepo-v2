import { Box } from '@react-three/drei';

import { useCursor } from '~/components/canvas/utils';
import type { ExitData } from '~/game';

import { useMap } from '../context';
import { EXIT_STATIC_SIZE, EXIT_COLOR, HIGHLIGHT_COLOR } from '../constants';

export const MapExits = ({ exits, highlightId, onClick }: MapExitsProps) => {
  const state = useMap();
  const cursor = useCursor({ disabled: !onClick });

  return (
    <>
      {(exits || state.exits).map(exit => (
        <Box
          key={exit.id}
          position={exit.position}
          args={[
            exit.direction === 'horizontal' ? exit.size : EXIT_STATIC_SIZE,
            exit.direction === 'vertical' ? exit.size : EXIT_STATIC_SIZE,
            0,
          ]}
          material-color={highlightId === exit.id ? HIGHLIGHT_COLOR : EXIT_COLOR}
          onClick={() => onClick?.(exit)}
          onPointerEnter={cursor.enter}
          onPointerLeave={cursor.leave}
        />
      ))}
    </>
  );
}

export interface MapExitsProps {
  exits?: ExitData[];
  highlightId?: string;
  onClick?: (exit: ExitData) => void;
}
