import mongoose from 'mongoose';
import { prop, getModelForClass } from '@typegoose/typegoose';

import type { VectorArray } from '~/types';
import type { ExitData } from '~/game';

import type { TypegooseDocument } from '../types';
import type { LocationData } from '~/game/location';

const vectorValidation = (value: unknown): boolean => {
  return Array.isArray(value) && value.length === 3;
}

//! for some reason the typegoose model doesn't work
//! it expects `exits` to be an object instead of an array

export enum ExitDirection {
  vertical = 'vertical',
  horizontal = 'horizontal',
}

export interface Location extends LocationData {
  _id: string;
}

export class Exit {
  _id!: string;
  id!: string;
  name!: string;
  position!: VectorArray;
  direction!: ExitDirection;
  size!: number;
  characterPosition!: VectorArray;
}

export class Area {
  id!: string;
  name!: string;
  boundaryPoints!: VectorArray[];
  exits!: ExitData[];
  locations!: Location[];
}

const villagerSchema = {
  id: {
    type: String,
    index: true,
    required: true,
  },
  name: {
    type: String,
    index: true,
    trim: true,
    required: true,
  },
  dialog: {
    type: mongoose.SchemaTypes.Mixed,
    required: true,
  },
};

const schema = new mongoose.Schema({
  id: {
    type: String,
    index: true,
    required: true,
  },
  name: {
    type: String,
    index: true,
    trim: true,
    required: true,
  },
  boundaryPoints: [[Number]],
  exits: [
    {
      id: {
        type: String,
        index: true,
        required: true,
      },
      position: {
        type: [Number],
        validate: [vectorValidation, '{PATH} must contain 3 numbers [x, y, z]'],
        required: true,
      },
      direction: {
        type: String,
        enum: Object.values(ExitDirection),
        required: true,
      },
      size: {
        type: Number,
        min: 0,
        required: true,
      },
      characterPosition: {
        type: [Number],
        validate: [vectorValidation, '{PATH} must contain 3 numbers [x, y, z]'],
        required: true,
      },
    }
  ],
  locations: [
    {
      id: {
        type: String,
        index: true,
        required: true,
      },
      name: {
        type: String,
        index: true,
        required: true,
      },
      position: {
        type: [Number],
        validate: [vectorValidation, '{PATH} must contain 3 numbers [x, y, z]'],
        required: true,
      },
      villagers: [villagerSchema],
      buildings: [
        {
          id: {
            type: String,
            index: true,
            required: true,
          },
          name: {
            type: String,
            index: true,
            required: true,
          },
          villagers: [villagerSchema],
        }
      ],
    }
  ],
});

export const AreaModel = mongoose.model('Area', schema, undefined, {
  overwriteModels: true,
});

/*export const AreaModel = getModelForClass(Area, {
  options: { disableCaching: true },
});*/
export type AreaDocument = TypegooseDocument<Area>;
export type AreaObject = Area & { _id: string };
