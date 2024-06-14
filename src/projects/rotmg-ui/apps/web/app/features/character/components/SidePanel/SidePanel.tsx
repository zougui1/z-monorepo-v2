import { useState, useRef } from 'react';
import { useFetcher, useSearchParams } from '@remix-run/react';
import { Divider, IconButton, RadioGroup } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

import { classes as classesData } from '~/data/classes';
import type { Character } from '~/api/characters';
import { LabelledSwitch } from '~/components/LabelledSwitch';
import { LabelledRadio } from '~/components/LabelledRadio';

import { ClassSelectionDialog } from '../ClassSelectionDialog';
import { PotionListSection } from '../PotionListSection';
import { SideSection } from '../../../../components/SideSection';
import { getTotalRemainingPotions } from '../../utils';

export const SidePanel = ({ characters, excludedCharacterIds }: SidePanelProps) => {
  const [isClassSelectionDialogOpen, setIsClassSelectionDialogOpen] = useState(false);
  const fetchers = useFetcher();
  const filterFormRef = useRef<HTMLFormElement | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const handleFilter = () => {
    if (filterFormRef.current) {
      const formData = new FormData(filterFormRef.current);
      setSearchParams(new URLSearchParams(formData));
    }
  }

  const openClassSelectionDialog = () => {
    setIsClassSelectionDialogOpen(true);
  }

  const closeClassSelectionDialog = () => {
    setIsClassSelectionDialogOpen(false);
  }

  const inclusiveCharacters = characters.filter(character => {
    return !excludedCharacterIds.includes(character.id);
  });
  const seasonalCharacters = inclusiveCharacters.filter(character => character.isSeasonal);
  const nonSeasonalCharacters = inclusiveCharacters.filter(character => !character.isSeasonal);

  const total = {
    seasonal: getTotalRemainingPotions(seasonalCharacters),
    nonSeasonal: getTotalRemainingPotions(nonSeasonalCharacters),
    total: getTotalRemainingPotions(inclusiveCharacters),
  };

  return (
    <div className="bg-gray-700 p-4 flex flex-col gap-4 rounded-md" style={{ minWidth: 350, maxWidth: 400 }}>
      <ClassSelectionDialog
        open={isClassSelectionDialogOpen}
        onClose={closeClassSelectionDialog}
      />

      <SideSection
        title={`Characters (${characters.length})`}
        icon={
          <IconButton onClick={openClassSelectionDialog}>
            <AddIcon />
          </IconButton>
        }
      >
        <ul className="flex flex-wrap gap-2">
          {Object.values(classesData).map(classData => (
            <li
              key={classData.name}
              className="flex items-center"
            >
              <classData.SkinIcon className="w-8" />
              <span className="px-2">
                {Object.values(characters).filter(character => character.className === classData.name).length}
              </span>
            </li>
          ))}
        </ul>
      </SideSection>

      <Divider />

      <SideSection title="Potions">
        <PotionListSection title="Total" potions={total.total} />
        <PotionListSection title="Seasonal" potions={total.seasonal} />
        <PotionListSection title="Non-Seasonal" potions={total.nonSeasonal} />
      </SideSection>

      <Divider />

      <SideSection title="Filters">
        <fetchers.Form ref={filterFormRef} onChange={handleFilter}>
          <LabelledSwitch
            name="unmaxed"
            label="Unmaxed characters only"
            defaultChecked={Boolean(searchParams.get('unmaxed'))}
          />

          <LabelledSwitch
            name="unexalted"
            label="Unexalted classes only"
            defaultChecked={Boolean(searchParams.get('unexalted'))}
          />

          <LabelledSwitch
            name="missingStars"
            label="Missing stars classes only"
            defaultChecked={Boolean(searchParams.get('missingStars'))}
          />

          <RadioGroup row name="seasonal" defaultValue={searchParams.get('seasonal') || 'seasonal'}>
            <LabelledRadio label="Seasonal" value="yes" />
            <LabelledRadio label="Non-Seasonal" value="no" />
            <LabelledRadio label="All" value="all" />
          </RadioGroup>
        </fetchers.Form>
      </SideSection>
      TODO: filters: class
      <br />
    </div>
  );
}

export interface SidePanelProps {
  characters: Character[];
  excludedCharacterIds: string[];
}
