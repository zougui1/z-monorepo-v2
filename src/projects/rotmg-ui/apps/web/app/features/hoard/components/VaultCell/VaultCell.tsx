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

export const VaultCell = (props: VaultCellProps) => {
  const {
    used,
    slotted,
    enchanted,
    Icon,
    onToggle,
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

  return(
    <td
      className={clsx('VaultCell', {
        used,
        slotted,
        enchanted,
      })}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <ContextMenuComponent
        disabled={disabledContextMenu || !Icon}
        slotted={slotted}
        enchanted={enchanted}
        onToggle={onToggle}
        name={name}
      >
        <div>
          <div
            className={clsx('relative cursor-pointer', {
              'opacity-15 hover:opacity-30 active:opacity-50 transition-all': !numbered && !used,
            })}
            onClick={() => onToggle('item', !used)}
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
          </div>
        </div>
      </ContextMenuComponent>
    </td>
  );
}

export interface VaultCellProps {
  onToggle: (type: 'item' | 'slotted' | 'enchanted', bool: boolean) => void;
  onCount: (count: number) => void;
  used?: boolean;
  slotted?: boolean;
  enchanted?: boolean;
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
