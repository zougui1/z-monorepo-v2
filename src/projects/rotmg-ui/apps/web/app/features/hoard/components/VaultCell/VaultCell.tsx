import { useState } from 'react';
import { isNumber } from 'radash';
import clsx from 'clsx';

import { IconComponent } from '~/utils/component-factory';

import './VaultCell.css';
import { VaultCellContextMenu } from '../VaultCellContextMenu';
import { VaultCellCountIncrements } from '../VaultCellCountIncrements';

// TODO optimization: replace the tooltip for the context menu with an icon click
// TODO optimization: add the icon to the DOM only when the cell is hovered (about twice as fast)

const Fragment = ({ children }: { children: React.ReactNode }) => children;

const EnchantGroup = ({ className, children }: { className?: string; children?: React.ReactNode; }) => {
  return (
    <div className={clsx('absolute left-2 bottom-2', className)}>
      {children}
    </div>
  );
}

const EnchantSlot = ({ className }: { className?: string; }) => {
  return (
    <div className={clsx('size-3 rotate-45 border border-black shadow-md', className)} />
  );
}

const enchantGroups: Record<number, React.ReactNode> = {
  1: (
    <EnchantGroup>
      <EnchantSlot className="bg-green-600" />
    </EnchantGroup>
  ),
  2: (
    <EnchantGroup>
      <EnchantSlot className="bg-blue-600" />
      <EnchantSlot className="bg-blue-600" />
    </EnchantGroup>
  ),
  3: (
    <EnchantGroup>
      <EnchantSlot className="bg-purple-600" />
      <EnchantSlot className="bg-purple-600" />
      <EnchantSlot className="bg-purple-600" />
    </EnchantGroup>
  ),
  4: (
    <EnchantGroup>
      <EnchantSlot className="bg-yellow-300" />
      <EnchantSlot className="bg-yellow-300" />
      <EnchantSlot className="bg-yellow-300" />
      <EnchantSlot className="bg-yellow-300" />
    </EnchantGroup>
  ),
};


export const VaultCell = (props: VaultCellProps) => {
  const {
    used,
    enchants,
    Icon,
    onToggle,
    onToggleEnchant,
    onCount,
    tier,
    name,
    count,
    disabledContextMenu,
    numbered,
    image,
  } = props;
  const [isHovered, setIsHovered] = useState(false);

  // the Tooltip used in VaultCellContextMenu is expensive especially in large numbers
  // so we render it only when the cell is hovered as it cannot be interacted with
  // otherwise
  const ContextMenuComponent = isHovered ? VaultCellContextMenu : Fragment;

  const handleClick = (event: React.MouseEvent) => {
    if (event.shiftKey) {
      onToggleEnchant((enchants ?? 0) + 1);
    } else {
      onToggle('item', !used);
    }
  }

  return(
    <td
      className={clsx(
        'VaultCell',
        'data-[enchants="1"]:shadow-green-600',
        'data-[enchants="2"]:shadow-blue-600',
        'data-[enchants="3"]:shadow-purple-600',
        'data-[enchants="4"]:shadow-yellow-300',
        { used },
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-enchants={enchants ?? 0}
      data-enchanted={enchants ? 'true' : undefined}
    >
      <ContextMenuComponent
        disabled={disabledContextMenu || (!Icon && !image)}
        name={name}
      >
        <div>
          <div
            className={clsx('relative cursor-pointer', {
              'opacity-15 hover:opacity-30 active:opacity-50 transition-all': !numbered && !used,
            })}
            onClick={handleClick}
            tabIndex={0}
            onKeyDown={() => { }}
            role="button"
            title={name}
          >
            {image && (
              <img src={image} alt={name} loading="lazy" width="100" height="100" />
            )}
            {Icon && <Icon loading="lazy" width="100" height="100" />}

            {tier && (
              <span
                className={clsx('absolute bottom-0 right-2 text-3xl font-bold text-shadow', {
                  'text-orange-500': tier === 'ST',
                  'text-purple-700': tier === 'UT',
                })}
              >
                {tier}
              </span>
            )}

            {isNumber(count) && (
              <span
                className="absolute top-1 left-1 text-3xl font-bold text-shadow"
              >
                {count}
              </span>
            )}

            {numbered && isNumber(count) && (
              <VaultCellCountIncrements count={count} onCount={onCount} />
            )}

            {enchantGroups[enchants ?? 0]}
          </div>
        </div>
      </ContextMenuComponent>
    </td>
  );
}

export interface VaultCellProps {
  onToggle: (type: 'item', bool: boolean) => void;
  onToggleEnchant: (enchants: number) => void;
  onCount: (count: number) => void;
  enchants?: number;
  used?: boolean;
  /**
   * @deprecated
   */
  Icon?: IconComponent;
  image?: string;
  tier?: string;
  count?: number;
  name?: string;
  disabledContextMenu?: boolean;
  numbered?: boolean;
}
