import { CharacterChardActionMenuAddLabel } from './compounds/CharacterChardActionMenuAddLabel';
import { CharacterChardActionMenuCopyPotions } from './compounds/CharacterChardActionMenuCopyPotions';
import { CharacterChardActionMenuExaltationsLink } from './compounds/CharacterChardActionMenuExaltationsLink';
import { CharacterChardActionMenuDelete } from './compounds/CharacterChardActionMenuDelete';
import { CharacterActionMenu, type CharacterActionMenuProps } from '../../../CharacterActionMenu';

export const CharacterCardActionMenu = (props: CharacterCardActionMenuProps) => {
  return <CharacterActionMenu {...props} />;
}

export interface CharacterCardActionMenuProps extends CharacterActionMenuProps {

}

CharacterCardActionMenu.AddLabel = CharacterChardActionMenuAddLabel;
CharacterCardActionMenu.CopyPotions = CharacterChardActionMenuCopyPotions;
CharacterCardActionMenu.ExaltationsLink = CharacterChardActionMenuExaltationsLink;
CharacterCardActionMenu.Delete = CharacterChardActionMenuDelete;
