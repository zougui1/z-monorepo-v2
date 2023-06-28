import { ImageMetadata } from './ImageMetadata';
import { File } from '../file';
import * as utils from '../utils';

export class ImageFile extends File.Definition {
  readonly metadata: ImageMetadata;

  constructor(filePath: string) {
    super(filePath);

    this.metadata = new ImageMetadata(filePath);
  }

  async readBytes(options?: utils.ReadBytesOptions | undefined): Promise<Buffer> {
    return await utils.readBytes(this.path, options);
  }
}
