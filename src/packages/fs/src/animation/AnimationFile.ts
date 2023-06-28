import { AnimationMetadata } from './AnimationMetadata';
import { File } from '../file';
import * as utils from '../utils';

export class AnimationFile extends File.Definition {
  readonly metadata: AnimationMetadata;

  constructor(filePath: string) {
    super(filePath);

    this.metadata = new AnimationMetadata(filePath);
  }

  async readBytes(options?: utils.ReadBytesOptions | undefined): Promise<Buffer> {
    return await utils.readBytes(this.path, options);
  }
}
