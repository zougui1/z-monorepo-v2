import { ListItemIcon, ListItemText } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

import { Dropdown, type DropdownButtonItemProps } from '~/components/Dropdown';
import { forkEventHandler } from '~/utils/dom';

export const Delete = ({ onClick, ...rest }: DeleteProps) => {
  const handleClick = forkEventHandler(onClick, event => {
    event.currentTarget.form?.requestSubmit(event.currentTarget);
  });

  return (
    <Dropdown.ButtonItem
      type="submit"
      name="intent"
      value="delete"
      onClick={handleClick}
      {...rest}
    >
      <ListItemIcon>
        <DeleteIcon color="error" />
      </ListItemIcon>

      <ListItemText>
        Delete
      </ListItemText>
    </Dropdown.ButtonItem>
  );
}

export interface DeleteProps extends DropdownButtonItemProps {

}
