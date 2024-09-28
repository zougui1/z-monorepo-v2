import zod from 'zod';

import { Random } from '@zougui/common.random-utils';
import { Percent } from '@zougui/common.percent-utils';

import { config } from '~/config';
import type { Character } from '~/database';

import { Class, classList } from '../enums';
import { readJson } from '../utils';

const parseStatAffinityPercent = (statMod: string): number => {
  const percent = statMod[0] === '+' ? statMod.slice(1) : statMod;

  if (!Percent.isValidString(percent)) {
    throw new Error(`Invalid percent "${percent}"`);
  }

  const multiplier = Percent.toMultiplier(Percent.fromString(percent));

  // +1 because the multiplier must be additive and not relative
  return multiplier + 1;
}

const percentSchema = zod
  .string()
  .regex(/^[+-][0-9]+%$/)
  .transform(parseStatAffinityPercent);

const affinitySchema = zod.record(zod.string().regex(/^[+-][0-9]+$/), percentSchema);

const statDefinitionSchema = zod.object({
  base: zod.object({
    min: zod.number().min(0),
    max: zod.number().min(0),
  }),
  affinity: affinitySchema,
});

const classSchema = zod.record(
  zod.enum(['hp', 'mp', 'strength', 'sharpness', 'resilience', 'agility', 'deftness', 'magicalMight', 'magicalMending']),
  zod.union([zod.number(), zod.literal('base'), zod.string().regex(/^\+[0-9]+$/)]),
);

const factoryDataSchema = zod.object({
  definitions: zod.object({
    hp: statDefinitionSchema,
    mp: statDefinitionSchema,
    strength: statDefinitionSchema,
    sharpness: statDefinitionSchema,
    resilience: statDefinitionSchema,
    agility: statDefinitionSchema,
    deftness: statDefinitionSchema,
    magicalMight: statDefinitionSchema,
    magicalMending: statDefinitionSchema,
  }),
  classes: zod.record(
    zod.union(classList.map(className => zod.literal(className)) as [zod.ZodLiteral<Class>, zod.ZodLiteral<Class>, ...zod.ZodLiteral<Class>[]]),
    classSchema,
  ),
});
type FactoryData = zod.infer<typeof factoryDataSchema>;

const pictureMap: Record<Class, string> = {
  'Scaled Dragon': '/images/Scaled Dragon.png',
  'Furred Dragon': '/images/Furred Dragon.png',
  'Fire Dragon': 'https://picsum.photos/seed/011101001/200/200',
  'Air Dragon': 'https://picsum.photos/seed/011101001/200/200',
  'Water Dragon': 'https://picsum.photos/seed/011101001/200/200',
  'Ice Dragon': 'https://picsum.photos/seed/011101001/200/200',
  'Light Dragon': 'https://picsum.photos/seed/011101001/200/200',
  'Shadow Dragon': 'https://picsum.photos/seed/011101001/200/200',
  'Storm Dragon': 'https://picsum.photos/seed/011101001/200/200',
  Hydra: 'https://picsum.photos/seed/011101001/200/200',
  Wyvern: 'https://picsum.photos/seed/011101001/200/200',
};

interface Range {
  min: number;
  max: number;
}

const getStatRangeMap = (definitions: FactoryData['definitions']): Map<string, Range> => {
  const statMap = new Map<string, Range>();

  for (const [statName, statDef] of Object.entries(definitions)) {
    const { min, max } = statDef.base;

    statMap.set(statName, { min, max });

    for (const [affinityIndex, affinityValue] of Object.entries(statDef.affinity)) {
      statMap.set(`${statName}${affinityIndex}`, {
        min: Math.round(min * affinityValue),
        max: Math.round(max * affinityValue),
      });
    }
  }

  return statMap;
}

export const create = async (options: CreateCharacterOptions) => {
  const { name, class: className } = options;
  const { definitions, classes } = await readJson(`${config.game.dataDirectory}/character/start-stats.json`, factoryDataSchema);
  const factory = classes[className];
  const statRangeMap = getStatRangeMap(definitions);

  if (!factory) {
    throw new Error(`Missing data for class "${className}"`);
  }

  const character: Omit<Character, '_id'> = {
    name,
    class: className,
    picture: pictureMap[className],
    level: 1,
    experience: 0,
    maxHp: 0,
    hp: 0,
    maxMp: 0,
    mp: 0,
    strength: 0,
    sharpness: 0,
    resilience: 0,
    agility: 0,
    deftness: 0,
    magicalMight: 0,
    magicalMending: 0,
  };

  for (const stat of Object.keys(factory)) {
    const statName = stat as keyof FactoryData['definitions'];
    const statFactory = factory[statName];

    if (typeof statFactory === 'number') {
      character[statName] = statFactory;
    }

    const statValue = statRangeMap.get(`${statName}${statFactory}`) ?? statRangeMap.get(statName);

    if (!statValue) {
      throw new Error(`Stat "${statName}" not found`);
    }

    character[statName] = Random.integer(statValue.min, statValue.max);
  }

  character.maxHp = character.hp;
  character.maxMp = character.mp;

  return character;
}

export interface CreateCharacterOptions {
  name: string;
  class: Class;
}
