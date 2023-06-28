import { VideoMetadata } from './VideoMetadata';
import { File } from '../file';
import * as utils from '../utils';

export class VideoFile extends File.Definition {
  readonly metadata: VideoMetadata;

  constructor(filePath: string) {
    super(filePath);

    this.metadata = new VideoMetadata(filePath);
  }

  async readBytes(options?: utils.ReadBytesOptions | undefined): Promise<Buffer> {
    return await utils.readBytes(this.path, options);
  }
}
