import { Box } from '@react-three/drei';

import { useCursor } from '~/components/canvas/utils';
import type { LocationData } from '~/game/location';

import { useMap } from '../context';
import { LOCATION_SIZE, LOCATION_COLOR, HIGHLIGHT_COLOR } from '../constants';



export const MapLocations = ({ locations, highlightId, onClick }: MapLocationsProps) => {
  const state = useMap();
  const cursor = useCursor({ disabled: !onClick });

  return (
    <>
      {(locations || state.locations).map(location => (
        <Box
          key={location.id}
          position={location.position}
          args={[LOCATION_SIZE, LOCATION_SIZE, 0]}
          material-color={highlightId === location.id ? HIGHLIGHT_COLOR : LOCATION_COLOR}
          onClick={() => onClick?.(location)}
          onPointerEnter={cursor.enter}
          onPointerLeave={cursor.leave}
        />
      ))}
    </>
  );
}

export interface MapLocationsProps {
  locations?: LocationData[];
  highlightId?: string;
  onClick?: (location: LocationData) => void;
}
