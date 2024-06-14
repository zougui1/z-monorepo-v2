import mongoose from 'mongoose';

import { getDef } from '@zougui/common.zod-def-parser';

import { zodDefToMongoSchema } from './zodDefToMongoSchema';
import { QueryBuilder } from '../query-builder';
import { z, type MongoRawShape, type MongoObject } from '../schema';
import type { Client } from '../client';

export class Model<Schema extends MongoObject> {
  readonly connection: mongoose.Connection;
  readonly name: string;
  readonly sourceSchema: Schema;
  readonly schema: MongoExtend<MandatoryDocumentSchema, Schema>;
  // TODO type this correctly
  readonly model: mongoose.Model<any>;//<mongoose.Schema<any, mongoose.Model<unknown>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, ZodDefToMongoSchema<Schema>>>;
  readonly options: ModelOptions | undefined;

  constructor(connection: Client, name: string, schema: Schema, options?: ModelOptions | undefined) {
    this.connection = connection.connection;
    this.name = name;
    this.sourceSchema = schema;
    this.schema = mandatoryDocumentSchema.extend(schema._def.shape) as MongoExtend<MandatoryDocumentSchema, Schema>;
    this.options = options;

    const schemaDef = getDef(schema.toZod());
    const mongoSchema = new mongoose.Schema(zodDefToMongoSchema(schemaDef), options?.schemaOptions);

    this.model = mongoose.model(
      `${connection.dbName}/${name}`,
      mongoSchema,
      name,
      { connection: this.connection },
    );
  }

  portToConnection(connection: Client): Model<Schema> {
    return new Model<Schema>(connection, this.name, this.sourceSchema, this.options);
  }

  query(): QueryBuilder<any, MongoExtend<MandatoryDocumentSchema, Schema>, true, false> {
    return new QueryBuilder<any, MongoExtend<MandatoryDocumentSchema, Schema>, true, false>({
      model: this,
      schema: this.schema,
      isDocument: true,
      isReverse: false,
    });
  }
}

export interface ModelOptions {
  schemaOptions?: mongoose.SchemaOptions | undefined;
}

export const mandatoryDocumentSchema = z.object({
  _id: z.objectId(),
});

export type MandatoryDocumentSchema = typeof mandatoryDocumentSchema;
export type MongoExtend<T1 extends MongoObject, T2 extends MongoObject> = (
  MongoObject<T1['_shape'] & T2['_shape']>
);
