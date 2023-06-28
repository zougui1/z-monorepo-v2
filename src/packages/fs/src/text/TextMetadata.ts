import { textMetadataKeys } from './textMetadataKeys';
import { getTextMetadata } from './utils';
import { TextMetadataObject, FileMetadataObject } from './types';
import { File } from '../file';
import { pickFieldsFromResolvedObject } from '../utils';

export class TextMetadata extends File.Metadata implements File.IMetadata {
  readonly path: string;

  constructor(path: string) {
    super(path);

    this.path = path;
  }

  async get<Field extends keyof FileMetadataObject>(options: { fields: Field[] }): Promise<Pick<FileMetadataObject, Field>>;
  async get(options?: File.GetMetadataOptions | undefined): Promise<FileMetadataObject>;
  async get(options?: File.GetMetadataOptions | undefined): Promise<Partial<FileMetadataObject>> {
    const [fileMetadata, textMetadata] = await Promise.all([
      super.get(options),
      pickFieldsFromResolvedObject(
        () => getTextMetadata(this.path),
        [...textMetadataKeys],
        options?.fields as (keyof TextMetadataObject)[] | undefined,
      ),
    ]);

    return {
      ...fileMetadata,
      ...textMetadata,
    };
  }
}
