import { range } from 'radash';

import { slotsPerRow } from '~/data/hoard';
import type { Item } from '~/data/items';
import type { Hoard } from '~/api/hoard';

import { VaultSlot } from '../VaultSlot';
import { createHoardRowArray } from '../../utils';

export const SequencialRows = ({ item, hoard, onToggle, onCount }: SequencialRowsProps) => {
  const { sequence } = item;

  if(!sequence) {
    return null;
  }

  const sequenceLength = sequence.length;

  return (
    <>
      {[...range(Math.ceil(sequenceLength / slotsPerRow) - 1)].map(rowNumber => (
        <tr key={rowNumber} className="flex w-full">
          {createHoardRowArray().map((number, index) => (
            <VaultSlot
              key={number}
              item={item}
              sequenceItem={sequence[(rowNumber * slotsPerRow) + index]}
              index={(rowNumber * slotsPerRow) + index}
              hoard={hoard}
              onToggle={onToggle({ id: item.id, position: (rowNumber * slotsPerRow) + index })}
              onCount={onCount({ id: item.id, position: (rowNumber * slotsPerRow) + index })}
            />
          ))}
        </tr>
      ))}
    </>
  );
}

export interface SequencialRowsProps {
  item: Item;
  hoard: Hoard;
  onToggle: (data: { id: string; position: number; }) => (type: 'item' | 'slotted' | 'enchanted', bool: boolean) => void;
  onCount: (data: { id: string; position: number; }) => (count: number) => void;
}
