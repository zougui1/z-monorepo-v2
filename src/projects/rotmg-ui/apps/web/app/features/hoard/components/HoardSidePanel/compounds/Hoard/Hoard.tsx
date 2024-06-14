import { memo } from 'react';
import { sum } from 'radash';

import { SideSection } from '~/components/SideSection';
import { ItemType, itemSections } from '~/data/items';
import { slotsPerRow } from '~/data/hoard';
import { compact } from '~/utils/array';
import type { Hoard as HoardData } from '~/api/hoard';

export const Hoard = memo(function HoardMemo({ hoard }: HoardProps) {
  const allItems = itemSections.flatMap(itemSection => itemSection.items);
  const dedupedItems = Array.from(new Set(allItems));

  const totalItems = sum(dedupedItems.flatMap(item => {
    if (item.type === ItemType.Infinite || item.type === ItemType.Sequence) {
      const hoardItem = hoard[item.id];
      return hoardItem?.slots?.map((slot, index) => {
        const count = slot?.count ?? 0;

        if (item.type === ItemType.Infinite) {
          return count;
        }

        return item.sequence?.[index]?.type === ItemType.Infinite ? count : 1;
      });
    }

    return slotsPerRow;
  }));
  const shinyItems = dedupedItems.filter(item => item.shiny);
  const totalShinyItems = shinyItems.length * slotsPerRow;
  const gatheredItems = sum(dedupedItems.map(item => compact(hoard[item.id]?.slots ?? []).length));
  const gatheredShinyItems = sum(shinyItems.map(item => compact(hoard[item.id]?.slots ?? []).length));
  const completion = Math.min(100, gatheredItems * 100 / totalItems);

  return (
    <SideSection title="Hoard" className="flex flex-col">
      <span>Completion: {completion.toFixed(2)}%</span>
      <span>Items: {gatheredItems}/{totalItems}</span>
      <span>Shiny Items: {gatheredShinyItems}/{totalShinyItems}</span>
    </SideSection>
  );
});

export interface HoardProps {
  hoard: HoardData;
}
