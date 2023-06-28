import fs from 'fs-extra';
import { DateTime } from 'luxon';

import { FileFormat } from '../utils';

export interface IMetadata {
  get<Field extends keyof MetadataObject>(options: { fields: Field[] }): Promise<Pick<MetadataObject, Field>>;
  get(options?: GetMetadataOptions | undefined): Promise<MetadataObject>;

  getFormat(options: { strict: true } & IMetadata.GetFormatOptions): Promise<FileFormat>;
  getFormat(options?: IMetadata.GetFormatOptions | undefined): Promise<FileFormat | undefined>;
}

export namespace IMetadata {
  export interface GetFormatOptions {
    strict?: boolean | undefined;
    analyzeBuffer?: boolean | undefined;
    bufferSize?: number | undefined;
  }
}

export interface GetMetadataOptions<Field extends keyof MetadataObject = keyof MetadataObject> {
  fields?: Field[] | undefined;
}

export interface MetadataObject extends Omit<fs.Stats, 'atime' | 'birthtime' | 'ctime' | 'mtime'> {
  atime: DateTime;
  birthtime: DateTime;
  ctime: DateTime;
  mtime: DateTime;
  bytes: string;
}
