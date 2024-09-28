import mongoose from 'mongoose';
import { prop, getModelForClass } from '@typegoose/typegoose';

import { Class } from '~/game/enums';

import type { TypegooseDocument } from '../types';
//import { Character } from '../Character';

//! for some reason the typegoose model doesn't work
//! it expects `characters` to be an object instead of an array

export class Character {
  @prop({ type: String, required: true, trim: true })
  name!: string;

  @prop({ type: String, required: true })
  picture!: string;

  @prop({ enum: Class, type: String, required: true })
  class!: Class;

  @prop({ type: Number, min: 1, max: 100, required: true })
  level!: number;

  @prop({ type: Number, min: 0, max: 1000, required: true })
  maxHp!: number;

  @prop({ type: Number, min: 0, max: 1000, required: true })
  hp!: number;

  @prop({ type: Number, min: 0, max: 1000, required: true })
  maxMp!: number;

  @prop({ type: Number, min: 0, max: 1000, required: true })
  mp!: number;

  @prop({ type: Number, min: 0, max: 1000, required: true })
  strength!: number;

  @prop({ type: Number, min: 0, max: 1000, required: true })
  sharpness!: number;

  @prop({ type: Number, min: 0, max: 1000, required: true })
  resilience!: number;

  @prop({ type: Number, min: 0, max: 1000, required: true })
  agility!: number;

  @prop({ type: Number, min: 0, max: 1000, required: true })
  deftness!: number;

  @prop({ type: Number, min: 0, max: 1000, required: true })
  magicalMight!: number;

  @prop({ type: Number, min: 0, max: 1000, required: true })
  magicalMending!: number;

  @prop({ type: Number, min: 0, required: true })
  experience!: number;

  // managed by mongoose
  _id!: string;
}

export class Save {
  @prop({ type: String, required: true, index: true })
  name!: string;

  @prop({ type: () => [Character], required: true })
  characters!: Character[];

  @prop({ type: String, required: true })
  currentArea!: string;

  @prop({ type: String, required: false })
  currentLocation?: string;

  // managed by mongoose
  createdAt!: Date;
  updatedAt!: Date;
}

const schema = new mongoose.Schema({
  name: {
    type: String,
    index: true,
    trim: true,
  },
  characters: [
    {
      name: {
        type: String,
        trim: true,
      },
      picture: String,
      class: String,
      level: {
        type: Number,
        min: 1,
        max: 100,
      },
      maxHp: {
        type: Number,
        min: 0,
        max: 1000,
      },
      hp: {
        type: Number,
        min: 0,
        max: 1000,
      },
      maxMp: {
        type: Number,
        min: 0,
        max: 1000,
      },
      mp: {
        type: Number,
        min: 0,
        max: 1000,
      },
      strength: {
        type: Number,
        min: 0,
        max: 1000,
      },
      resilience: {
        type: Number,
        min: 0,
        max: 1000,
      },
      agility: {
        type: Number,
        min: 0,
        max: 1000,
      },
      deftness: {
        type: Number,
        min: 0,
        max: 1000,
      },
      magicalMight: {
        type: Number,
        min: 0,
        max: 1000,
      },
      magicalMending: {
        type: Number,
        min: 0,
        max: 1000,
      },
      experience: {
        type: Number,
        min: 0,
      },
    }
  ],
  currentArea: {
    type: String,
    required: true,
  },
  currentLocation: {
    type: String,
    required: false,
  },
}, { timestamps: true })

export const SaveModel = mongoose.model('Save', schema, undefined, {
  overwriteModels: true,
});

/*export const SaveModel = getModelForClass(Save, {
  //schemaOptions: { timestamps: true },
  options: { disableCaching: true },
});*/
export type SaveDocument = TypegooseDocument<Save>;
export type SaveObject = Save & { _id: string };
