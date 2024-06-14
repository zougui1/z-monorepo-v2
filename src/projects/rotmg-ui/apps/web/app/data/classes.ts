import {
  RogueIcon,
  ArcherIcon,
  WizardIcon,
  PriestIcon,
  WarriorIcon,
  KnightIcon,
  PaladinIcon,
  AssassinIcon,
  NecromancerIcon,
  HuntressIcon,
  MysticIcon,
  TricksterIcon,
  SorcererIcon,
  NinjaIcon,
  SamuraiIcon,
  BardIcon,
  SummonerIcon,
  KenseiIcon,
} from '~/components/icons';

export const classes = {
  rogue: {
    name: 'rogue',
    SkinIcon: RogueIcon,
  },
  archer: {
    name: 'archer',
    SkinIcon: ArcherIcon,
  },
  wizard: {
    name: 'wizard',
    SkinIcon: WizardIcon,
  },
  priest: {
    name: 'priest',
    SkinIcon: PriestIcon,
  },
  warrior: {
    name: 'warrior',
    SkinIcon: WarriorIcon,
  },
  knight: {
    name: 'knight',
    SkinIcon: KnightIcon,
  },
  paladin: {
    name: 'paladin',
    SkinIcon: PaladinIcon,
  },
  assassin: {
    name: 'assassin',
    SkinIcon: AssassinIcon,
  },
  necromancer: {
    name: 'necromancer',
    SkinIcon: NecromancerIcon,
  },
  huntress: {
    name: 'huntress',
    SkinIcon: HuntressIcon,
  },
  mystic: {
    name: 'mystic',
    SkinIcon: MysticIcon,
  },
  trickster: {
    name: 'trickster',
    SkinIcon: TricksterIcon,
  },
  sorcerer: {
    name: 'sorcerer',
    SkinIcon: SorcererIcon,
  },
  ninja: {
    name: 'ninja',
    SkinIcon: NinjaIcon,
  },
  samurai: {
    name: 'samurai',
    SkinIcon: SamuraiIcon,
  },
  bard: {
    name: 'bard',
    SkinIcon: BardIcon,
  },
  summoner: {
    name: 'summoner',
    SkinIcon: SummonerIcon,
  },
  kensei: {
    name: 'kensei',
    SkinIcon: KenseiIcon,
  },
} as const;

export type ClassName = keyof typeof classes;
