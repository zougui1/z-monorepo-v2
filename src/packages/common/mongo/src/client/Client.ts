import mongoose from 'mongoose';

import { parseMongoUri } from './parseMongoUri';
import { createConnection } from './createConnection';
import { Model, type ModelOptions } from '../model';
import type { MongoRawShape, MongoObject } from '../schema';

export class Client {
  readonly dbName: string;
  readonly connection: mongoose.Connection;

  constructor(uri: string, options?: mongoose.ConnectOptions | undefined) {
    const parsedUri = parseMongoUri(uri);

    this.dbName = parsedUri.dbName;
    this.connection = createConnection(uri, options);
  }

  createModel = <Schema extends MongoObject<MongoRawShape>>(name: string, schema: Schema, options?: ModelOptions): Model<Schema> => {
    return new Model(this, name, schema, options);
  }
}
