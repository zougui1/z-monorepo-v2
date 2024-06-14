import { ListItemIcon, ListItemText } from '@mui/material';
import { ContentCopy as ContentCopyIcon } from '@mui/icons-material';
import { sum } from 'radash';

import { Dropdown, type DropdownMenuItemProps } from '~/components/Dropdown';
import { forkEventHandler } from '~/utils/dom';
import type { Potions } from '~/types';

import { stringifyPotions } from '../../../../utils';

export const CopyPotions = ({ potions, onClick, disabled, ...rest }: CopyPotionsProps) => {
  const totalPotions = sum(Object.values(potions));

  const handleClick = forkEventHandler(onClick, () => {
    navigator.clipboard.writeText(stringifyPotions(potions));
  });

  return (
    <Dropdown.MenuItem
      {...rest}
      disabled={disabled || (totalPotions <= 0)}
      onClick={handleClick}
    >
      <ListItemIcon>
        <ContentCopyIcon />
      </ListItemIcon>

      <ListItemText>
        Copy potions
      </ListItemText>
    </Dropdown.MenuItem>
  );
}

export interface CopyPotionsProps extends DropdownMenuItemProps {
  potions: Potions;
}
