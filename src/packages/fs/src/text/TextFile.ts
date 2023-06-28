import { TextMetadata } from './TextMetadata';
import { File } from '../file';
import * as utils from '../utils';

export class TextFile extends File.Definition {
  readonly metadata: TextMetadata;

  constructor(filePath: string) {
    super(filePath);

    this.metadata = new TextMetadata(filePath);
  }

  async readBytes(options?: utils.ReadBytesOptions | undefined): Promise<Buffer> {
    return await utils.readBytes(this.path, options);
  }
}
