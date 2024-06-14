import { StatName } from '~/data/stats';
import { createImgIcon, type IconComponent } from '~/utils/component-factory';
import { upperFirst } from '~/utils/string';

const createPotionIcon = (size: 'small' | 'greater', name: StatName): IconComponent => {
  const statName = upperFirst(name);
  const prefix = size === 'greater' ? 'Greater' : '';

  return createImgIcon({
    src: `/images/potions/${size}/${statName}Potion.png`,
    alt: `${prefix} ${statName} Potion`.trim(),
  });
}

export const small = {
  Attack: createPotionIcon('small', 'attack'),
  Defense: createPotionIcon('small', 'defense'),
  Speed: createPotionIcon('small', 'speed'),
  Dexterity: createPotionIcon('small', 'dexterity'),
  Vitality: createPotionIcon('small', 'vitality'),
  Wisdom: createPotionIcon('small', 'wisdom'),
  Life: createPotionIcon('small', 'life'),
  Mana: createPotionIcon('small', 'mana'),
};

export const greater = {
  Attack: createPotionIcon('greater', 'attack'),
  Defense: createPotionIcon('greater', 'defense'),
  Speed: createPotionIcon('greater', 'speed'),
  Dexterity: createPotionIcon('greater', 'dexterity'),
  Vitality: createPotionIcon('greater', 'vitality'),
  Wisdom: createPotionIcon('greater', 'wisdom'),
  Life: createPotionIcon('greater', 'life'),
  Mana: createPotionIcon('greater', 'mana'),
};
