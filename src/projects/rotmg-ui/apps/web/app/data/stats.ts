import { PortalIcons, PotionIcons } from '~/components/icons';
import type { IconComponent } from '~/utils/component-factory';

export const stats = {
  life: {
    name: 'life',
    short: 'LIFE',
    potion: {
      Small: PotionIcons.small.Life,
      Greater: PotionIcons.greater.Life,
    },
    PortalIcon: PortalIcons.SmallOryxSanctuary
  },
  mana: {
    name: 'mana',
    short: 'MANA',
    potion: {
      Small: PotionIcons.small.Mana,
      Greater: PotionIcons.greater.Mana,
    },
    PortalIcon: PortalIcons.TheVoid
  },
  attack: {
    name: 'attack',
    short: 'ATT',
    potion: {
      Small: PotionIcons.small.Attack,
      Greater: PotionIcons.greater.Attack,
    },
    PortalIcon: PortalIcons.TheShatters
  },
  defense: {
    name: 'defense',
    short: 'DEF',
    potion: {
      Small: PotionIcons.small.Defense,
      Greater: PotionIcons.greater.Defense,
    },
    PortalIcon: PortalIcons.LostHalls
  },
  speed: {
    name: 'speed',
    short: 'SPD',
    potion: {
      Small: PotionIcons.small.Speed,
      Greater: PotionIcons.greater.Speed,
    },
    PortalIcon: PortalIcons.CultistHideout
  },
  dexterity: {
    name: 'dexterity',
    short: 'DEX',
    potion: {
      Small: PotionIcons.small.Dexterity,
      Greater: PotionIcons.greater.Dexterity,
    },
    PortalIcon: PortalIcons.TheNest
  },
  vitality: {
    name: 'vitality',
    short: 'VIT',
    potion: {
      Small: PotionIcons.small.Vitality,
      Greater: PotionIcons.greater.Vitality,
    },
    PortalIcon: PortalIcons.KogboldSteamworks
  },
  wisdom: {
    name: 'wisdom',
    short: 'WIS',
    potion: {
      Small: PotionIcons.small.Wisdom,
      Greater: PotionIcons.greater.Wisdom,
    },
    PortalIcon: PortalIcons.FungalCavern
  },
} satisfies Record<StatName, Stat>;

export type StatName = (
  | 'life'
  | 'mana'
  | 'defense'
  | 'attack'
  | 'speed'
  | 'dexterity'
  | 'vitality'
  | 'wisdom'
);

export interface Stat {
  name: StatName;
  short: string;
  potion: {
    Small: IconComponent;
    Greater: IconComponent;
  };
  PortalIcon: IconComponent;
};
