import { getTotalRemainingPotions } from '~/features/character/utils';

import { useCharactersSidePanelContext } from '../../CharactersSidePanelContext';
import { SideSection } from '../../../../../../components/SideSection';
import { PotionListSection } from '../../../PotionListSection';

export const PotionsSection = () => {
  const state = useCharactersSidePanelContext();

  const seasonalCharacters = state.characters.filter(character => character.isSeasonal);
  const nonSeasonalCharacters = state.characters.filter(character => !character.isSeasonal);

  const total = {
    seasonal: getTotalRemainingPotions(seasonalCharacters),
    nonSeasonal: getTotalRemainingPotions(nonSeasonalCharacters),
    total: getTotalRemainingPotions(state.characters),
  };

  return (
    <SideSection title="Potions">
      <PotionListSection title="Total" potions={total.total} />
      <PotionListSection title="Seasonal" potions={total.seasonal} />
      <PotionListSection title="Non-Seasonal" potions={total.nonSeasonal} />
    </SideSection>
  );
}
