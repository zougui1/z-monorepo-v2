import { stats } from '~/data/stats';
import { PotionsRemaining } from '~/api/characters';

export const stringifyPotions = (potions: PotionsRemaining): string => {
  return Object
    .values(stats)
    .filter(stat => potions[stat.name] > 0)
    .map(stat => `${potions[stat.name]} ${stat.short.toLowerCase()}`)
    .join(', ');
}
