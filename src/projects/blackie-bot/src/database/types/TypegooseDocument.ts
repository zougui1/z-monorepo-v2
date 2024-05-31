import type { BeAnObject, IObjectWithTypegooseFunction } from '@typegoose/typegoose/lib/types';
import type { Types, Document as MongooseDocument } from 'mongoose';

export type TypegooseDocument<T> = MongooseDocument<unknown, BeAnObject, T> & Omit<T & {
  _id: Types.ObjectId;
}, 'typegooseName'> & IObjectWithTypegooseFunction;
