import { cloneElement, useState } from 'react';
import { Tooltip, ClickAwayListener, Backdrop, Divider } from '@mui/material';

import { LabelledSwitch } from '~/components/LabelledSwitch';

export const VaultCellContextMenu = (props: VaultCellContextMenuProps) => {
  const { children, disabled, slotted, enchanted, onToggle, name } = props;
  const [activeTooltip, setActiveTooltip] = useState(false);

  const handleContextMenu = (event: React.MouseEvent) => {
    if (!disabled) {
      event.preventDefault();
      setActiveTooltip(true);
    }
  }

  if(disabled) {
    return children;
  }

  return (
    <>
      {activeTooltip && <Backdrop
        open={activeTooltip}
        className="z-50 !bg-transparent fixed top-0 left-0 w-screen h-screen"
      />}

      <Tooltip
        open={Boolean(!disabled && activeTooltip)}
        classes={{ tooltip: 'shadow-xl' }}
        title={
          <ClickAwayListener onClickAway={() => setActiveTooltip(false)}>
            <div className="flex flex-col">
              <span className="text-lg">{name}</span>
              <Divider />

              <LabelledSwitch
                label="Slotted"
                checked={Boolean(slotted)}
                onChange={() => onToggle('slotted', !slotted)}
              />
              <LabelledSwitch
                label="Enchanted"
                checked={Boolean(enchanted)}
                onChange={() => onToggle('enchanted', !enchanted)}
              />
            </div>
          </ClickAwayListener>
        }
      >
        {cloneElement(children, {
          onContextMenu: handleContextMenu,
        })}
      </Tooltip>
    </>
  );
}

export interface VaultCellContextMenuProps {
  onToggle: (type: 'item' | 'slotted' | 'enchanted', bool: boolean) => void;
  children: React.ReactElement;
  slotted?: boolean;
  enchanted?: boolean;
  name?: string;
  disabled?: boolean;
}
