import zod from 'zod';
import fs from 'fs-extra';

import { Percent } from '@zougui/common.percent-utils';

import { readJson } from './utils';

const parseStatAffinityPercent = (statMod: string): number => {
  const percent = statMod[0] === '+' ? statMod.slice(1) : statMod;

  if (!Percent.isValidString(percent)) {
    throw new Error(`Invalid percent "${percent}"`);
  }

  const multiplier = Percent.toMultiplier(Percent.fromString(percent));

  // +1 because the multiplier must be additive and not relative
  return multiplier + 1;
}

const input = '/mnt/Dev/Code/javascript/zougui/src/projects/dragon-realm/game-data/character/start-stats.json';
const output = '/mnt/Dev/Code/javascript/zougui/src/projects/dragon-realm/stats.txt';

const percentSchema = zod
  .string()
  .regex(/^[+-][0-9]+%$/)
  .transform(parseStatAffinityPercent);

const affinitySchema = zod.record(zod.string().regex(/^[+-][0-9]+$/), percentSchema);

zod.record(zod.number(), zod.string())

const statDefinitionSchema = zod.object({
  base: zod.object({
    min: zod.number().min(0),
    max: zod.number().min(0),
  }),
  affinity: affinitySchema,
});

const classSchema_v2 = zod.record(
  zod.enum(['hp', 'mp', 'strength', 'sharpness', 'resilience', 'agility', 'deftness', 'magicalMight', 'magicalMending']),
  zod.union([zod.number(), zod.literal('base'), zod.string().regex(/^\+[0-9]+$/)]),
);

const schema = zod.object({
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
  classes: zod.record(classSchema_v2)
});

export const temp = async (): Promise<void> => {
  const { definitions, classes } = await readJson(input, schema);

  const outputText: string[] = [];
  const stats = new Map<string, { min: number; max: number }>();

  for (const [statName, statDef] of Object.entries(definitions)) {
    const { min, max } = statDef.base;

    stats.set(statName, { min, max });

    for (const [affinityIndex, affinityValue] of Object.entries(statDef.affinity)) {
      stats.set(`${statName}${affinityIndex}`, { min: Math.round(min * affinityValue), max: Math.round(max * affinityValue) });
    }
  }

  for (const [className, classStats] of Object.entries(classes)) {
    outputText.push(`- ${className}:`);

    for (const [statName, statValueOrAffinity] of Object.entries(classStats)) {
      if (typeof statValueOrAffinity === 'number') {
        outputText.push(`  - ${statName}: ${statValueOrAffinity}`);
        continue;
      }

      const statValue = stats.get(`${statName}${statValueOrAffinity}`) ?? stats.get(statName);

      if (!statValue) {
        throw new Error(`Stat "${statName}" not found`);
      }

      outputText.push(`  - ${statName}: ${statValue.min}-${statValue.max}`);
    }
  }

  await fs.writeFile(output, outputText.join('\n'));
}
