import { AudioMetadata } from './AudioMetadata';
import { File } from '../file';
import * as utils from '../utils';

export class AudioFile extends File.Definition {
  readonly metadata: AudioMetadata;

  constructor(filePath: string) {
    super(filePath);

    this.metadata = new AudioMetadata(filePath);
  }

  async readBytes(options?: utils.ReadBytesOptions | undefined): Promise<Buffer> {
    return await utils.readBytes(this.path, options);
  }
}
