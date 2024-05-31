import mongoose from 'mongoose';

import { config } from '../config';

export const connections = {
  production: mongoose.createConnection(config.production.mongo.uri),
  development: mongoose.createConnection(config.development.mongo.uri),
};

connections.production.set('strictQuery', true);
connections.development.set('strictQuery', true);
