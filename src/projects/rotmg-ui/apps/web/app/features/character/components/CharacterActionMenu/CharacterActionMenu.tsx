import { MoreVert as MoreVertIcon } from '@mui/icons-material';

import { Dropdown } from '~/components/Dropdown';

import { AddLabel } from './compounds/AddLabel';
import { CopyPotions } from './compounds/CopyPotions';
import { Delete } from './compounds/Delete';
import { ExaltationsLink } from './compounds/ExaltationsLink';

export const CharacterActionMenu = ({ children }: CharacterActionMenuProps) => {
  return (
    <Dropdown>
      <Dropdown.IconButton>
        <MoreVertIcon />
      </Dropdown.IconButton>

      <Dropdown.Menu disablePortal>
        {children}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export interface CharacterActionMenuProps {
  children?: React.ReactNode;
}

CharacterActionMenu.AddLabel = AddLabel;
CharacterActionMenu.CopyPotions = CopyPotions;
CharacterActionMenu.Delete = Delete;
CharacterActionMenu.ExaltationsLink = ExaltationsLink;
