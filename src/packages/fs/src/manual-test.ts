import path from 'node:path';

import { Constructor } from 'type-fest';

import { File } from './file';
import { AudioFile } from './audio';
import { AnimationFile } from './animation';
import { ImageFile } from './image';
import { StaticImageFile } from './static-image';
import { TextFile } from './text';
import { VideoFile } from './video';
import { FileType, ContentType } from './enums';

const byFileType: Record<FileType, Constructor<File.Object, [filePath: string]>> = {
  audio: AudioFile.Object,
  flash: File.Object,
  image: ImageFile.Object,
  text: TextFile.Object,
  video: VideoFile.Object,
};

const byContentType: Record<ContentType, Constructor<File.Object, [filePath: string]>> = {
  audio: AudioFile.Object,
  flash: File.Object,
  staticImage: StaticImageFile.Object,
  text: TextFile.Object,
  animation: AnimationFile.Object,
};

const fields = [
  'size',
  'duration',
  'width',
  'height',
  'frameCount',
  'frameRate',
  'wordCount',
] as any[];

(async () => {
  const dir = '/mnt/Manjaro_Data/zougui/Temp/compression/images/input/';
  const fileName = '0c633c4d2377a2cb80f6a584ff1e641e.jpg';

  const file = new File.Object(path.join(dir, fileName));
  const format = await file.metadata.getFormat({ strict: true, analyzeBuffer: true });

  {
    const metadata = await new byFileType[format.fileType](file.path).metadata.get({ fields });
    console.group('file-type:', format.fileType);
    console.log(metadata);
    console.groupEnd();
  }

  {
    const metadata = await new byContentType[format.contentType](file.path).metadata.get({ fields });
    console.group('content-type:', format.contentType);
    console.log(metadata);
    console.groupEnd();
  }
})();
