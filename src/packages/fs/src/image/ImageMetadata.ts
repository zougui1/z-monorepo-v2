import { imageMetadataKeys } from './imageMetadataKeys';
import { getImageMetadata } from './utils';
import { ImageMetadataObject, FileMetadataObject } from './types';
import { File } from '../file';
import { pickFieldsFromResolvedObject } from '../utils';

export class ImageMetadata extends File.Metadata implements File.IMetadata {
  readonly path: string;

  constructor(path: string) {
    super(path);

    this.path = path;
  }

  async get<Field extends keyof FileMetadataObject>(options: { fields: Field[] }): Promise<Pick<FileMetadataObject, Field>>;
  async get(options?: File.GetMetadataOptions | undefined): Promise<FileMetadataObject>;
  async get(options?: File.GetMetadataOptions | undefined): Promise<Partial<FileMetadataObject>> {
    const [fileMetadata, imageMetadata] = await Promise.all([
      super.get(options),
      pickFieldsFromResolvedObject(
        () => getImageMetadata(this.path),
        [...imageMetadataKeys],
        options?.fields as (keyof ImageMetadataObject)[] | undefined,
      ),
    ]);

    return {
      ...fileMetadata,
      ...imageMetadata,
    };
  }
}
