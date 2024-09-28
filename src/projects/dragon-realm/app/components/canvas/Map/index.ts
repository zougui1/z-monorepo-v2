import { Map as MapRoot, type MapProps as MapRootProps } from './Map';
import {
  MapBoundaries,
  MapExits,
  MapLocations,
  MapMovableDot,
  type MapMovableDotProps,
} from './compounds';

export const Map = {
  Root: MapRoot,
  Boundaries: MapBoundaries,
  Exits: MapExits,
  Locations: MapLocations,
  MovableDot: MapMovableDot,
};

export type {
  MapRootProps,
  MapMovableDotProps,
};
