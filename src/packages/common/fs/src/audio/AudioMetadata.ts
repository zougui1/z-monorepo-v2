import { audioMetadataKeys } from './audioMetadataKeys';
import { getAudioMetadata } from './utils';
import { AudioMetadataObject, FileMetadataObject } from './types';
import { File } from '../file';
import { pickFieldsFromResolvedObject } from '../utils';

export class AudioMetadata extends File.Metadata implements File.IMetadata {
  readonly path: string;

  constructor(path: string) {
    super(path);

    this.path = path;
  }

  async get<Field extends keyof FileMetadataObject>(options: { fields: Field[] }): Promise<Pick<FileMetadataObject, Field>>;
  async get(options?: File.GetMetadataOptions | undefined): Promise<FileMetadataObject>;
  async get(options?: File.GetMetadataOptions | undefined): Promise<Partial<FileMetadataObject>> {
    const [fileMetadata, audioMetadata] = await Promise.all([
      super.get(options),
      pickFieldsFromResolvedObject(
        () => getAudioMetadata(this.path),
        [...audioMetadataKeys],
        options?.fields as (keyof AudioMetadataObject)[] | undefined,
      ),
    ]);

    return {
      ...fileMetadata,
      ...audioMetadata,
    };
  }
}
