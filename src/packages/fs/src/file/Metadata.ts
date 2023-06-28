import { getFileMetadata } from './utils';
import { fileMetadataKeys } from './fileMetadataKeys';
import { IMetadata, GetMetadataOptions, MetadataObject } from './IMetadata';
import * as utils from '../utils';

// A fair amount of file-types are detectable within this range.
const minimumHeaderBytes = 4100;

export class Metadata implements IMetadata {
  readonly path: string;

  constructor(path: string) {
    this.path = path;
  }

  async get<Field extends keyof MetadataObject>(options: { fields: Field[] }): Promise<Pick<MetadataObject, Field>>;
  async get(options?: GetMetadataOptions | undefined): Promise<MetadataObject>;
  async get(options?: GetMetadataOptions | undefined): Promise<Partial<MetadataObject>> {
    return utils.pickFieldsFromResolvedObject(
      () => getFileMetadata(this.path),
      // copy due to the readonly
      [...fileMetadataKeys],
      options?.fields,
    );
  }

  async getFormat(options: { strict: true } & IMetadata.GetFormatOptions): Promise<utils.FileFormat>;
  async getFormat(options?: IMetadata.GetFormatOptions | undefined): Promise<utils.FileFormat | undefined>;
  async getFormat(options?: IMetadata.GetFormatOptions | undefined): Promise<utils.FileFormat | undefined> {
    const buffer = options?.analyzeBuffer
      ? await utils.readBytes(this.path, { size: options?.bufferSize ?? minimumHeaderBytes })
      : undefined;

    return await utils.getFileFormat(this.path, {
      ...options,
      buffer,
    });
  }
}
