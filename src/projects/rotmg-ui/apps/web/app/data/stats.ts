import {
  AttackPotionIcon,
  DefensePotionIcon,
  SpeedPotionIcon,
  DexterityPotionIcon,
  VitalityPotionIcon,
  WisdomPotionIcon,
  LifePotionIcon,
  ManaPotionIcon,
  PortalIcons,
} from '~/components/icons';

export const stats = {
  life: {
    name: 'life',
    short: 'LIFE',
    PotionIcon: LifePotionIcon,
    PortalIcon: PortalIcons.SmallOryxSanctuary
  },
  mana: {
    name: 'mana',
    short: 'MANA',
    PotionIcon: ManaPotionIcon,
    PortalIcon: PortalIcons.TheVoid
  },
  attack: {
    name: 'attack',
    short: 'ATT',
    PotionIcon: AttackPotionIcon,
    PortalIcon: PortalIcons.TheShatters
  },
  defense: {
    name: 'defense',
    short: 'DEF',
    PotionIcon: DefensePotionIcon,
    PortalIcon: PortalIcons.LostHalls
  },
  speed: {
    name: 'speed',
    short: 'SPD',
    PotionIcon: SpeedPotionIcon,
    PortalIcon: PortalIcons.CultistHideout
  },
  dexterity: {
    name: 'dexterity',
    short: 'DEX',
    PotionIcon: DexterityPotionIcon,
    PortalIcon: PortalIcons.TheNest
  },
  vitality: {
    name: 'vitality',
    short: 'VIT',
    PotionIcon: VitalityPotionIcon,
    PortalIcon: PortalIcons.KogboldSteamworks
  },
  wisdom: {
    name: 'wisdom',
    short: 'WIS',
    PotionIcon: WisdomPotionIcon,
    PortalIcon: PortalIcons.FungalCavern
  },
} as const;

export type StatName = keyof typeof stats;
