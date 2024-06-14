import { staticImageMetadataKeys } from './staticImageMetadataKeys';
import { getStaticImageMetadata } from './utils';
import { StaticImageMetadataObject, FileMetadataObject } from './types';
import { File } from '../file';
import { pickFieldsFromResolvedObject } from '../utils';

export class StaticImageMetadata extends File.Metadata implements File.IMetadata {
  readonly path: string;

  constructor(path: string) {
    super(path);

    this.path = path;
  }

  async get<Field extends keyof FileMetadataObject>(options: { fields: Field[] }): Promise<Pick<FileMetadataObject, Field>>;
  async get(options?: File.GetMetadataOptions | undefined): Promise<FileMetadataObject>;
  async get(options?: File.GetMetadataOptions | undefined): Promise<Partial<FileMetadataObject>> {
    const [fileMetadata, staticImageMetadata] = await Promise.all([
      super.get(options),
      pickFieldsFromResolvedObject(
        () => getStaticImageMetadata(this.path),
        [...staticImageMetadataKeys],
        options?.fields as (keyof StaticImageMetadataObject)[] | undefined,
      ),
    ]);

    return {
      ...fileMetadata,
      ...staticImageMetadata,
    };
  }
}
