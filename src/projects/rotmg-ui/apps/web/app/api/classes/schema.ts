import zod from 'zod';

import { classes, type ClassName } from '~/data/classes';

const exaltationSchema = zod.object({
  level: zod.number().int().min(0).max(5),
  points: zod.number().int().min(0).max(25),
});

const classSchema = zod.object({
  name: zod.string().refine((value): value is ClassName => {
    return value in classes;
  }),

  stars: zod.number().int().min(0).max(5),

  exaltations: zod.object({
    attack: exaltationSchema,
    defense: exaltationSchema,
    speed: exaltationSchema,
    dexterity: exaltationSchema,
    vitality: exaltationSchema,
    wisdom: exaltationSchema,
    life: exaltationSchema,
    mana: exaltationSchema,
  })
})

export const classesSchema = zod.object({
  rogue: classSchema,
  archer: classSchema,
  wizard: classSchema,
  priest: classSchema,
  warrior: classSchema,
  knight: classSchema,
  paladin: classSchema,
  assassin: classSchema,
  necromancer: classSchema,
  huntress: classSchema,
  mystic: classSchema,
  trickster: classSchema,
  sorcerer: classSchema,
  ninja: classSchema,
  samurai: classSchema,
  bard: classSchema,
  summoner: classSchema,
  kensei: classSchema,
});

export type Classes = zod.infer<typeof classesSchema>;
export type Class = zod.infer<typeof classSchema>;
export type Exaltation = zod.infer<typeof exaltationSchema>;

export * from 'zod';
