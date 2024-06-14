import { ListItemIcon, ListItemText } from '@mui/material';
import { Label as LabelIcon } from '@mui/icons-material';

import { Dropdown, type DropdownMenuItemProps } from '~/components/Dropdown';

export const AddLabel = (props: AddLabelProps) => {
  return (
    <Dropdown.MenuItem {...props}>
      <ListItemIcon>
        <LabelIcon />
      </ListItemIcon>

      <ListItemText>
        Add label
      </ListItemText>
    </Dropdown.MenuItem>
  );
}

export interface AddLabelProps extends DropdownMenuItemProps {

}
