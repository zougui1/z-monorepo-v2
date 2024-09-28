import type { SaveObject } from '~/database';
import type { LocationData } from '~/game';
import type { AreaData } from '~/game/area';

export interface SaveData extends Omit<SaveObject, 'createdAt' | 'updatedAt' | 'currentLocation' | 'currentArea'> {
  currentLocation?: LocationData;
  currentArea?: AreaData;
  createdAt: string;
  updatedAt: string;
}
