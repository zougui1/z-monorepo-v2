import { IconButton, type IconButtonProps } from '@mui/material';

import { forkEventHandler } from '~/utils/dom';

import { useDropdownContext } from '../../DropdownContext';

export const DropdownIconButton = ({ onClick, ...rest }: DropdownIconButtonProps) => {
  const { anchorEl, setAnchorEl, id } = useDropdownContext();

  const handleClick = forkEventHandler(onClick, e => setAnchorEl(e.currentTarget));

  return (
    <IconButton
      {...rest}
      aria-controls={anchorEl ? `menu-${id}` : undefined}
      aria-haspopup="true"
      aria-expanded={anchorEl ? 'true' : undefined}
      id={`button-${id}`}
      onClick={handleClick}
    />
  );
}

export interface DropdownIconButtonProps extends Omit<IconButtonProps, 'id'> {

}
