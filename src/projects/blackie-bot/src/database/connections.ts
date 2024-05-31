import mongoose from 'mongoose';

import { config } from '../config';

export const connections = {
  production: mongoose.createConnection(config.mongo.production.uri),
  test: mongoose.createConnection(config.mongo.test.uri),
};

connections.production.set('strictQuery', true);
connections.test.set('strictQuery', true);
