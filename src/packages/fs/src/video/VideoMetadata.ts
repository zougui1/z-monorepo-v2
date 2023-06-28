import { videoMetadataKeys } from './videoMetadataKeys';
import { getVideoMetadata } from './utils';
import { VideoMetadataObject, FileMetadataObject } from './types';
import { File } from '../file';
import { pickFieldsFromResolvedObject } from '../utils';

export class VideoMetadata extends File.Metadata implements File.IMetadata {
  readonly path: string;

  constructor(path: string) {
    super(path);

    this.path = path;
  }

  async get<Field extends keyof FileMetadataObject>(options: { fields: Field[] }): Promise<Pick<FileMetadataObject, Field>>;
  async get(options?: File.GetMetadataOptions | undefined): Promise<FileMetadataObject>;
  async get(options?: File.GetMetadataOptions | undefined): Promise<Partial<FileMetadataObject>> {
    const [fileMetadata, videoMetadata] = await Promise.all([
      super.get(options),
      pickFieldsFromResolvedObject(
        () => getVideoMetadata(this.path),
        [...videoMetadataKeys],
        options?.fields as (keyof VideoMetadataObject)[] | undefined,
      ),
    ]);

    return {
      ...fileMetadata,
      ...videoMetadata,
    };
  }
}
