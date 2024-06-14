import { MenuItem, type MenuItemProps } from '@mui/material';

import { forkEventHandler } from '~/utils/dom';

import { useDropdownContext } from '../../DropdownContext';

export const DropdownMenuItem = ({ onClick, ...rest }: DropdownMenuItemProps) => {
  const { setAnchorEl } = useDropdownContext();

  const handleClose = forkEventHandler(onClick, () => setAnchorEl(null));

  return (
    <MenuItem
      {...rest}
      onClick={handleClose}
    />
  );
}

export interface DropdownMenuItemProps extends MenuItemProps {

}
