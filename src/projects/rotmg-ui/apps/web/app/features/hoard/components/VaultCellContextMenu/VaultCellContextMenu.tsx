import { cloneElement, useState } from 'react';
import { Tooltip, ClickAwayListener, Backdrop, Divider } from '@mui/material';

export const VaultCellContextMenu = (props: VaultCellContextMenuProps) => {
  const { children, disabled, name } = props;
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
  children: React.ReactElement;
  name?: string;
  disabled?: boolean;
}
