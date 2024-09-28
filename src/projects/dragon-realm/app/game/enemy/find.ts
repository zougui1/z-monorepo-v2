import zod from 'zod';

import { Random } from '@zougui/common.random-utils';

import { config } from '~/config';
import type { Character } from '~/database';

import { readJson } from '../utils';

const enemyDataSchema = zod.object({
  id: zod.string(),
  name: zod.string(),
  picture: zod.string().url(),
  hp: zod.number().min(1).max(9999),
  mp: zod.number().min(0).max(9999),
  strength: zod.number().min(0).max(9999),
  sharpness: zod.number().min(0).max(9999),
  resilience: zod.number().min(0).max(9999),
  agility: zod.number().min(0).max(9999),
  deftness: zod.number().min(0).max(9999),
  magicalMight: zod.number().min(0).max(9999),
  magicalMending: zod.number().min(0).max(9999),
  experience: zod.number().min(0).max(999_999),
  gold: zod.number().min(0).max(9999),
  // TODO loot table
  loots: zod.array(zod.undefined()).optional(),
});

const enemyListDataSchema = zod.array(enemyDataSchema);

type EnemyData = zod.infer<typeof enemyDataSchema> & { maxHp: number; maxMp: number; };

export const find = async (id: string): Promise<EnemyData | undefined> => {
  const enemies = await readJson(`${config.game.dataDirectory}/enemies.json`, enemyListDataSchema);
  const enemy = enemies.find(enemy => enemy.id === id);

  if (enemy) {
    return {
      ...enemy,
      maxHp: enemy.hp,
      maxMp: enemy.mp,
    };
  }
}

export interface CreateCharacterOptions {
  name: string;
  class: Class;
}
