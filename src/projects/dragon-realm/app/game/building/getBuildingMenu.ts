import type { BuildingData } from './parse';
import type { VillagerData } from '../villager';
import type { GameMenu, GameMenuOption } from '../types';

export const getBuildingMenu = (building: BuildingData, options: GetBuildingMenuOptions): GameMenu => {
  const menuOptions: GameMenuOption[] = [];

  for (const villager of building.villagers) {
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

export interface GetBuildingMenuOptions {
  onTalk: (villager: VillagerData) => void;
  onLeave: () => void;
}
