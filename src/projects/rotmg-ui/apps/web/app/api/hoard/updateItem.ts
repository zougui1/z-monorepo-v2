import { createHoardRowArray } from '~/features/hoard/utils';
import { ItemType, flatItems } from '~/data/items';

import { getHoard } from './getHoard';
import { updateHoard } from './internal';
import type { ItemDataSlot } from './schema';
import { slotsPerRow } from '~/data/hoard';
import { isNumber, range } from 'radash';

export const updateItem = async (options: UpdateItemOptions): Promise<void> => {
  const currentHoard = await getHoard();
  const currentSlots = currentHoard[options.id]?.slots || [];
  const dataItem = flatItems[options.id];

  if (!dataItem) {
    console.log(`no data for item "${options.id}"`);
    return;
  }

  const enchants = (options.enchants ?? 0) % 5;
  const slots = [...range(1, Math.max(slotsPerRow, dataItem?.sequence?.length ?? 0))];

  const newSlots: (ItemDataSlot | null)[] = slots.map((slot, index) => {
    const currentSlot = currentSlots[index];

    if (index !== options.position) {
      return currentSlot ?? null;
    }

    if (dataItem.type === ItemType.Infinite && isNumber(options.count)) {
      return {
        ...currentSlot,
        enchants,
        count: options.count,
      };
    }

    // TODO handle the count after the enchantments so that the code for them isn't duplicated
    if (
      dataItem.type === ItemType.Sequence &&
      dataItem.sequence?.[index]?.type === ItemType.Infinite
    ) {
      console.log('count')
      return {
        ...currentSlot,
        enchants,
        count: options.count,
      };
    }

    if (currentSlot && typeof options.enchants !== 'number') {
      return null;
    }

    return {
      enchants,
      count: options.count,
    };
  });

  const isCompleted = !newSlots.includes(null);

  const newHoard = {
    ...currentHoard,
    [options.id]: {
      slots: newSlots,
      completedAt: isCompleted ? options.clientDate : undefined,
    },
  };

  await updateHoard(newHoard);
}

export interface UpdateItemOptions {
  id: string;
  position: number;
  clientDate: string;
  count?: number;
  enchants?: number;
}
