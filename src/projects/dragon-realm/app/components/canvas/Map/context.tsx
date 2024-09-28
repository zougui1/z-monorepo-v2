import { createContext, useContext, useMemo } from 'react';

import type { VectorArray } from '~/types';
import type { ExitData } from '~/game';
import type { LocationData } from '~/game/location';

export interface MapContextState {
  boundaryPoints: VectorArray[];
  locations: LocationData[];
  exits: ExitData[];
  onMove: (position: VectorArray) => void;
}

export const MapContext = createContext<MapContextState | undefined>(undefined);

export const MapProvider = ({ children, boundaryPoints, exits, locations, onMove }: MapProviderProps) => {
  const stateValue = useMemo(() => {
    return {
      boundaryPoints,
      exits,
      locations,
      onMove,
    };
  }, [boundaryPoints, exits, locations]);

  return (
    <MapContext.Provider value={stateValue}>
      {children}
    </MapContext.Provider>
  )
}

export interface MapProviderProps extends MapContextState {
  children?: React.ReactNode;
}

export const useMap = (): MapContextState => {
  const context = useContext(MapContext);

  if (!context) {
    throw new Error('Cannot use map outside of the MapProvider tree');
  }

  return context;
}
