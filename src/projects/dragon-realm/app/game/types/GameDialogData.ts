import type { VillagerData, VillagerDialogData } from '../villager';

export type GameDialogData = VillagerDialogData & {
  villager: VillagerData;
}
