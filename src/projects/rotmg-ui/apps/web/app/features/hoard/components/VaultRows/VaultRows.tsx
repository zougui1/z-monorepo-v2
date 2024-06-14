import { ItemType, type Item } from '~/data/items';
import type { Hoard } from '~/api/hoard';

import { VaultSlot } from '../VaultSlot';
import { SequencialRows } from '../SequencialRows';
import { createHoardRowArray } from '../../utils';

export const VaultRows = ({ item, hoard, onToggle, onCount }: VaultRowsProps) => {
  if (item.type === ItemType.Sequence && item?.sequence) {
    return (
      <SequencialRows
        item={item}
        hoard={hoard}
        onToggle={onToggle}
        onCount={onCount}
      />
    )
  }

  return (
    <tr className="w-full flex">
      {createHoardRowArray().map((number, index) => (
        <VaultSlot
          key={number}
          item={item}
          index={index}
          hoard={hoard}
          onToggle={onToggle({ id: item.id, position: index })}
          onCount={onCount({ id: item.id, position: index })}
        />
      ))}
    </tr>
  );
}

export interface VaultRowsProps {
  item: Item;
  hoard: Hoard;
  onToggle: (data: { id: string; position: number; }) => (type: 'item' | 'slotted' | 'enchanted', bool: boolean) => void;
  onCount: (data: { id: string; position: number; }) => (count: number) => void;
}
