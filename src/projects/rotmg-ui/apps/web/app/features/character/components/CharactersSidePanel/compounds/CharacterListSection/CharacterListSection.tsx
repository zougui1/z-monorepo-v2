import { useState } from 'react';
import { IconButton } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

import { classes as classesData, type ClassName } from '~/data/classes';

import { useCharactersSidePanelContext } from '../../CharactersSidePanelContext';
import { SideSection } from '../../../../../../components/SideSection';
import { ClassSelectionDialog } from '../../../ClassSelectionDialog';

export const CharacterListSection = () => {
  const state = useCharactersSidePanelContext();
  const [isClassSelectionDialogOpen, setIsClassSelectionDialogOpen] = useState(false);

  const getCharacterClassCount = (className: ClassName): number => {
    const characters = state.characters.filter(character => {
      return character.className === className;
    });

    return characters.length;
  }

  return (
    <SideSection
      title={`Characters (${state.characters.length})`}
      icon={
        <IconButton onClick={() => setIsClassSelectionDialogOpen(true)}>
          <AddIcon />
        </IconButton>
      }
    >
      <ClassSelectionDialog
        open={isClassSelectionDialogOpen}
        onClose={() => setIsClassSelectionDialogOpen(false)}
      />

      <ul className="flex flex-wrap gap-2">
        {Object.values(classesData).map(classData => (
          <li key={classData.name} className="flex items-center">
            <classData.SkinIcon className="w-8" />

            <span className="px-2">
              {getCharacterClassCount(classData.name)}
            </span>
          </li>
        ))}
      </ul>
    </SideSection>
  );
}
