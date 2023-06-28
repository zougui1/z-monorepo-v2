import { animationMetadataKeys } from './animationMetadataKeys';
import { getAnimationMetadata } from './utils';
import { AnimationMetadataObject, FileMetadataObject } from './types';
import { File } from '../file';
import { pickFieldsFromResolvedObject } from '../utils';

export class AnimationMetadata extends File.Metadata implements File.IMetadata {
  readonly path: string;

  constructor(path: string) {
    super(path);

    this.path = path;
  }

  async get<Field extends keyof FileMetadataObject>(options: { fields: Field[] }): Promise<Pick<FileMetadataObject, Field>>;
  async get(options?: File.GetMetadataOptions | undefined): Promise<FileMetadataObject>;
  async get(options?: File.GetMetadataOptions | undefined): Promise<Partial<FileMetadataObject>> {
    const [fileMetadata, animationMetadata] = await Promise.all([
      super.get(options),
      pickFieldsFromResolvedObject(
        async () => {
          const format = await this.getFormat({ strict: true, analyzeBuffer: true });
          return await getAnimationMetadata(this.path, format);
        },
        [...animationMetadataKeys],
        options?.fields as (keyof AnimationMetadataObject)[] | undefined,
      ),
    ]);

    return {
      ...fileMetadata,
      ...animationMetadata,
    };
  }
}
