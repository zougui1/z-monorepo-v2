import { Item, ItemType } from '~/data/items';
import type { Hoard } from '~/api/hoard';

import { VaultCell } from '../VaultCell';


export const VaultSlot = ({ item, sequenceItem, index, hoard, onToggle, onToggleEnchant, onCount }: VaultSlotProps) => {
  const hoardItem = hoard[item?.id ?? ''];
  const itemSlot = hoardItem?.slots[index];
  const isInfinite = [item?.type, sequenceItem?.type].includes(ItemType.Infinite);

  return (
    <VaultCell
      used={Boolean(itemSlot)}
      enchants={itemSlot?.enchants}
      name={(sequenceItem ?? item)?.name}
      tier={(sequenceItem ?? item)?.tier}
      count={isInfinite ? (itemSlot?.count ?? 0) : (sequenceItem ?? item)?.count}
      numbered={isInfinite}
      Icon={(sequenceItem ?? item)?.Icon}
      image={(sequenceItem ?? item)?.image}
      onToggle={onToggle}
      onToggleEnchant={onToggleEnchant}
      onCount={onCount}
      disabledContextMenu={!(sequenceItem ?? item)?.enchantable}
    />
  );
}

export interface VaultSlotProps {
  item?: Item;
  sequenceItem?: Item;
  index: number;
  hoard: Hoard;
  onToggle: (type: 'item', bool: boolean) => void;
  onToggleEnchant: (enchants: number) => void;
  onCount: (count: number) => void;
}
