import { Menu, type MenuProps } from '@mui/material';

import { forkEventHandler } from '~/utils/dom';

import { useDropdownContext } from '../../DropdownContext';

export const DropdownMenu = ({ onClose, ...rest }: DropdownMenuProps) => {
  const { anchorEl, setAnchorEl, id } = useDropdownContext();

  const open = Boolean(anchorEl);
  const handleClose = forkEventHandler(onClose, () => setAnchorEl(null));

  return (
    <Menu
      {...rest}
      id={`menu-${id}`}
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      MenuListProps={{
        'aria-labelledby': `button-${id}`,
      }}
    />
  );
}

export interface DropdownMenuProps extends Omit<Partial<MenuProps>, 'id'> {

}
