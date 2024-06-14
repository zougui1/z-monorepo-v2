import { FileDefinition } from './FileDefinition';
import { Metadata } from './Metadata';
import { IMetadata } from './IMetadata';
import * as utils from '../utils';

export class File extends FileDefinition {
  readonly metadata: IMetadata;

  constructor(filePath: string) {
    super(filePath);
    this.metadata = new Metadata(filePath);
  }

  async readBytes(options?: utils.ReadBytesOptions | undefined): Promise<Buffer> {
    return await utils.readBytes(this.path, options);
  }
}
