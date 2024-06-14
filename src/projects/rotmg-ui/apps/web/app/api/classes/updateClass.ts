import { isNumber } from 'radash';

import { classes as classesData } from '~/data/classes';
import { getNewExaltation } from '~/features/exaltation/utils';

import type { Classes, Class } from './schema';
import { updateClasses, type ErrorResponse } from './updateClasses';
import { getClasses } from './getClasses';

export const updateClass = async (data: UpdateClassData): Promise<Classes | ErrorResponse> => {
  const className = data.className as keyof typeof classesData;

  if (!(className in classesData)) {
    throw new Response('', { status: 400 });
  }

  const currentData = await getClasses();
  const currentClass = currentData[className];

  const newClassData: Partial<Class> = {};

  if (isNumber(data.stars)) {
    newClassData.stars = data.stars;
  }

  if (data.exaltations) {
    newClassData.exaltations = {
      attack: getNewExaltation(currentClass.exaltations.attack, data.exaltations.attack),
      defense: getNewExaltation(currentClass.exaltations.defense, data.exaltations.defense),
      speed: getNewExaltation(currentClass.exaltations.speed, data.exaltations.speed),
      dexterity: getNewExaltation(currentClass.exaltations.dexterity, data.exaltations.dexterity),
      vitality: getNewExaltation(currentClass.exaltations.vitality, data.exaltations.vitality),
      wisdom: getNewExaltation(currentClass.exaltations.wisdom, data.exaltations.wisdom),
      life: getNewExaltation(currentClass.exaltations.life, data.exaltations.life),
      mana: getNewExaltation(currentClass.exaltations.mana, data.exaltations.mana),
    };
  }

  return await updateClasses({ [className]: newClassData });
}

export interface UpdateClassData {
  className: string;
  stars?: number;
  exaltations?: {
    attack: number;
    defense: number;
    speed: number;
    dexterity: number;
    vitality: number;
    wisdom: number;
    life: number;
    mana: number;
  };
}
