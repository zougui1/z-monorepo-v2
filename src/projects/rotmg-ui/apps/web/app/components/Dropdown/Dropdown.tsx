import { DropdownContextProvider } from './DropdownContext';

import { DropdownIconButton } from './compounds/DropdownIconButton';
import { DropdownMenu } from './compounds/DropdownMenu';
import { DropdownMenuItem } from './compounds/DropdownMenuItem';
import { DropdownLinkItem } from './compounds/DropdownLinkItem';
import { DropdownButtonItem } from './compounds/DropdownButtonItem';

export const Dropdown = ({ children }: DropdownProps) => {
  return (
    <DropdownContextProvider>
      {children}
    </DropdownContextProvider>
  );
}

export interface DropdownProps {
  children?: React.ReactNode;
}

Dropdown.IconButton = DropdownIconButton;
Dropdown.Menu = DropdownMenu;
Dropdown.MenuItem = DropdownMenuItem;
Dropdown.LinkItem = DropdownLinkItem;
Dropdown.ButtonItem = DropdownButtonItem;
