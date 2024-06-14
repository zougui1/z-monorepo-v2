import { ListItemIcon, ListItemText } from '@mui/material';

import { ExaltationIcon } from '~/components/icons';
import { Dropdown, type DropdownMenuItemProps } from '~/components/Dropdown';
import type { ClassName } from '~/data/classes';

export const ExaltationsLink = ({ class: className, ...rest }: ExaltationsLinkProps) => {
  return (
    <Dropdown.LinkItem {...rest} to={`/exaltations/${className}`}>
      <ListItemIcon>
        <ExaltationIcon className="w-6" />
      </ListItemIcon>

      <ListItemText>
        Exaltations
      </ListItemText>
    </Dropdown.LinkItem>
  );
}

export interface ExaltationsLinkProps extends Omit<DropdownMenuItemProps, 'to'> {
  class: ClassName;
}
