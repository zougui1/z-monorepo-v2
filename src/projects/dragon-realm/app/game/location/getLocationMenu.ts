import type { LocationData } from './parse';
import type { VillagerData } from '../villager';
import type { BuildingData } from '../building';
import type { GameMenu, GameMenuOption } from '../types';

export const getLocationMenu = (location: LocationData, options: GetLocationMenuOptions): GameMenu => {
  const menuOptions: GameMenuOption[] = [];

  for (const building of location.buildings) {
    menuOptions.push({
      text: building.name,
      action: () => options.onEnterBuilding(building),
    });
  }

  for (const villager of location.villagers) {
    menuOptions.push({
      text: villager.name,
      action: () => options.onTalk(villager),
    });
  }

  menuOptions.push({
    text: 'Leave',
    action: options.onLeave,
  });

  return { options: menuOptions };
}

export interface GetLocationMenuOptions {
  onEnterBuilding: (building: BuildingData) => void;
  onTalk: (villager: VillagerData) => void;
  onLeave: () => void;
}
