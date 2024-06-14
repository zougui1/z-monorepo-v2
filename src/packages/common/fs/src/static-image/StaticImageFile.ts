import { StaticImageMetadata } from './StaticImageMetadata';
import { File } from '../file';
import * as utils from '../utils';

export class StaticImageFile extends File.Definition {
  readonly metadata: StaticImageMetadata;

  constructor(filePath: string) {
    super(filePath);

    this.metadata = new StaticImageMetadata(filePath);
  }

  async readBytes(options?: utils.ReadBytesOptions | undefined): Promise<Buffer> {
    return await utils.readBytes(this.path, options);
  }
}
