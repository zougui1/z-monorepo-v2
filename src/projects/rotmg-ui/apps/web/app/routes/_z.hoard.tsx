import { isNumber, sum } from 'radash';
import clsx from 'clsx';
import { useLoaderData, useFetcher, useSearchParams } from '@remix-run/react';
import { Tooltip, IconButton } from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import type { ActionFunctionArgs, MetaFunction } from '@remix-run/node';

import { Item, ItemSection, itemSections, ItemType } from '~/data/items';
import { getHoard, updateItem, type Hoard, ItemDataSlot } from '~/api/hoard';
import React, { useState } from 'react';
import { compact, toggleArrayItem } from '~/utils/array';
import { slotsPerRow } from '~/data/hoard';
import { VaultRows } from '~/features/hoard/components/VaultRows';
import { ProgressNumber } from '~/components/ProgressNumber';
import { HoardSidePanel } from '~/features/hoard/components/HoardSidePanel';
import { FilterTernary } from '~/types';

// TODO refactor
// TODO optimizations: virtualization
// TODO sections: shinies, STs

export const meta: MetaFunction = () => {
  return [
    { title: 'Hoard' },
    { name: 'description', content: 'Hoard' },
  ];
};

export const loader = async () => {
  return await getHoard();
}

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData();
  const id = body.get('id')?.toString();
  const position = Number(body.get('position'));
  const count = Number(body.get('count'));
  const clientDate = body.get('date')?.toString();
  const slotted = JSON.parse(body.get('slotted')?.toString() ?? 'null');
  const enchanted = JSON.parse(body.get('enchanted')?.toString() ?? 'null');

  if (!id || !isNumber(position) || !clientDate) {
    throw new Error('Invalid data');
  }

  await updateItem({
    id,
    position,
    clientDate,
    slotted,
    enchanted,
    count: isNumber(count) ? count : undefined,
  });

  return null;
}

export interface HoardFilters {
  complete: FilterTernary;
  search: string | null;
  forgeMaterial: 'red' | 'all';
}

const filterItemSections = (itemSections: ItemSection[], hoard: Hoard, filters: HoardFilters): (ItemSection & { allItems: Item[] })[] => {
  const sections = itemSections.map(section => {
    const filteredItems = section.items
      .filter(item => {
        if (filters.complete === 'all') {
          return true;
        }

        const completed = filters.complete === 'yes';

        if (item.type === ItemType.Infinite) {
          return !completed;
        }

        if (item.type === ItemType.Sequence) {
          if(!hoard[item.id]) {
            return !completed;
          }

          const bool =  hoard[item.id].slots.every((slot, index) => {
            if(!slot) {
              return !item.sequence?.[index];
            }

            return item.sequence?.[index]?.type !== ItemType.Infinite;
          });

          if(completed) {
            return bool;
          }

          return !bool;
        }

        if (completed) {
          return hoard[item.id]?.slots.every(Boolean);
        }

        return !hoard[item.id]?.slots.every(Boolean);
      })
      .filter(item => {
        const filterByMaterial: Record<HoardFilters['forgeMaterial'], boolean | undefined> = {
          all: true,
          red: item.forge?.materials.red,
        };

        return filterByMaterial[filters.forgeMaterial];
      })
      .filter(item => {
        if(!filters.search) {
          return true;
        }

        return (
          item.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          item.tier?.toLowerCase().includes(filters.search.toLowerCase()) ||
          section.label.toLowerCase().includes(filters.search.toLowerCase())
        );
      });

      return {
        ...section,
        allItems: section.items,
        items: filteredItems,
      }
    });

  return sections.filter(section => section.items.length);
}

export default function Hoard() {
  const hoard = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const [openSections, setOpenSections] = useState<string[]>([]);
  const [searchParams] = useSearchParams();

  const filters = React.useMemo(() => ({
    complete: searchParams.get('complete') || 'all',
    forgeMaterial: searchParams.get('forgeMaterial') || 'all',
    search: searchParams.get('search'),
  }), [searchParams]);

  const handler = (data: Record<string, unknown>) => {
    const formData = new FormData();
    formData.set('date', new Date().toISOString());

    for (const [name, value] of Object.entries(data)) {
      formData.set(name, String(value));
    }

    fetcher.submit(formData, { method: 'post' });
  }

  const handleToggle = (data: { id: string; position: number; }) => {
    return (type: 'item' | 'slotted' | 'enchanted', bool: boolean) => {
      handler({
        ...data,
        [type]: bool,
      });
    }
  }

  const handleCount = (data: { id: string; position: number; }) => {
    return (count: number) => {
      handler({
        ...data,
        count,
      });
    }
  }

  const handleToggleSection = React.useCallback((section: string) => {
    setOpenSections(sections => toggleArrayItem(sections, section));
  }, []);

  const sections = React.useMemo(() => {
    return filterItemSections(itemSections, hoard, filters);
  }, [hoard, filters]);

  return (
    <div className="flex gap-4" style={{ height: '90vh' }}>
      <div className="overflow-y-scroll pr-2" style={{ minWidth: 120 * 8 }}>
        <table className="divide-y divide-gray-500 w-full">
          {sections.map(section => (
            <tbody key={section.label}>
              <TableBodyHeader
                itemSection={section}
                hoard={hoard}
                isOpen={openSections.includes(section.label)}
                onToggle={handleToggleSection}
              />

              {openSections.includes(section.label) && section.items.map(item => (
                <VaultRows
                  key={item.id}
                  item={item}
                  hoard={hoard}
                  onToggle={handleToggle}
                  onCount={handleCount}
                />
              ))}
            </tbody>
          ))}
        </table>
      </div>

      <HoardSidePanel>
        <HoardSidePanel.Hoard hoard={hoard} />
        <HoardSidePanel.Filters />
      </HoardSidePanel>
    </div>
  );
}

export const TableBodyHeader = React.memo(function TableBodyHeaderMemo({ itemSection, hoard, onToggle, isOpen }: TableBodyHeaderProps) {
  const {
    completion,
    isCompleted,
    filledSlotCount,
    completedRowCount,
    totalEnchantableItemCount,
    slottedItemCount,
    enchantedItemCount,
    totalItemCount,
    totalRowCount,
  } = React.useMemo(() => {
    // TODO handle items of type Infinite
    const totalItemCount = sum(itemSection.allItems.flatMap(item => item.sequence?.length ?? slotsPerRow));
    const totalRowCount = Math.ceil(totalItemCount / slotsPerRow);

    const getFilledSlots = (item: Item): ItemDataSlot[] => {
      return compact(hoard[item.id]?.slots ?? []);
    }

    const filledSlotCount = sum(itemSection.allItems.map(item => (
      getFilledSlots(item).length
    )));

    const completedRowCount = itemSection.allItems.filter(item => (
      getFilledSlots(item).length === 8
    )).length;

    const totalEnchantableItemCount = itemSection.allItems.filter(item => item.enchantable).length * slotsPerRow;
    const slottedItemCount = sum(itemSection.allItems.map(item => (
      getFilledSlots(item).filter(slot => slot.slotted).length
    )));
    const enchantedItemCount = sum(itemSection.allItems.map(item => (
      getFilledSlots(item).filter(slot => slot.enchanted).length
    )));

    // total enchantable item count 2x for slotted and enchanted
    const total = totalItemCount + totalEnchantableItemCount * 2;
    const progress = filledSlotCount + slottedItemCount + enchantedItemCount;
    const completion = Math.min(100, progress * 100 / total);
    const isCompleted = completion === 100;

    return {
      total,
      progress,
      completion,
      isCompleted,
      filledSlotCount,
      completedRowCount,
      totalEnchantableItemCount,
      slottedItemCount,
      enchantedItemCount,
      totalItemCount,
      totalRowCount,
    };
  }, [hoard, itemSection]);

  const handleToggle = () => {
    onToggle?.(itemSection.label);
  }

  return (
    <tr
      role="button"
      onClick={handleToggle}
      tabIndex={0}
      className="sticky top-0 z-50"
    >
      {
        // TODO use multiple <td> instead of just one
      }
      <td colSpan={8} style={{ height: 57 }} className="bg-gray-700 py-2 border-x-8 border-gray-700">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4 w-full">
            <div className="flex  items-center gap-2 w-1/3">
              {itemSection.image && (
                <img src={itemSection.image} alt={itemSection.label} className="h-10" />
              )}
              {itemSection.Icon && <itemSection.Icon className="h-10" />}
              <span>{itemSection.label}</span>
            </div>

            <div>
              <Tooltip
                arrow
                title={
                  <div className="flex flex-col text-sm">
                    <ProgressNumber
                      label="Rows completed"
                      value={completedRowCount}
                      total={totalRowCount}
                    />
                    <ProgressNumber
                      label="Items"
                      value={filledSlotCount}
                      total={totalItemCount}
                    />

                    {totalEnchantableItemCount > 0 && (
                      <>
                        <ProgressNumber
                          label="Slotted Items"
                          value={slottedItemCount}
                          total={totalEnchantableItemCount}
                        />

                        <ProgressNumber
                          label="Enchanted Items"
                          value={enchantedItemCount}
                          total={totalEnchantableItemCount}
                        />
                      </>
                    )}
                  </div>
                }
              >
                <div>
                  <span>Completion:</span>
                  <span
                    className={clsx('ml-1.5', {
                      'text-yellow-500': isCompleted,
                    })}
                  >
                    {completion.toFixed(2)}%
                  </span>
                </div>
              </Tooltip>
            </div>
          </div>

          <IconButton onClick={handleToggle}>
            {isOpen
              ? <ExpandLessIcon />
              : <ExpandMoreIcon />
            }
          </IconButton>
        </div>
      </td>
    </tr>
  );
});

export interface TableBodyHeaderProps {
  itemSection: ItemSection & { allItems: Item[] };
  hoard: Hoard;
  isOpen?: boolean;
  onToggle?: (label: string) => void;
}
