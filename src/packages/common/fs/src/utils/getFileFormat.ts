import path from 'node:path';

import fileType from 'file-type';

import { getAnimatedImageMetadata } from './getAnimatedImageMetadata';
import { FileType, ContentType } from '../enums';
import { Extension } from '../types';

const animatableImageExtensions = [
  '.png',
  '.apng',
  '.webp',
  '.gif',
];

const contentTypeMap: Map<string, ContentType> = new Map([
  ['.jpeg', ContentType.StaticImage],
  ['.jpg', ContentType.StaticImage],
  ['.avif', ContentType.StaticImage],
  ['.bmp', ContentType.StaticImage],

  ['.txt', ContentType.Text],
  ['.doc', ContentType.Text],
  ['.docx', ContentType.Text],
  ['.pdf', ContentType.Text],
  ['.rtf', ContentType.Text],
  ['.odt', ContentType.Text],
  ['.odp', ContentType.Text],
  ['.ods', ContentType.Text],

  ['.mp3', ContentType.Audio],
  ['.wav', ContentType.Audio],
  ['.ogg', ContentType.Audio],

  ['.mp4', ContentType.Animation],
  ['.webm', ContentType.Animation],
  ['.mkv', ContentType.Animation],
  ['.mov', ContentType.Animation],

  ['.swf', ContentType.Flash],
]);

const fileTypeMap: Map<string, FileType> = new Map([
  ['.jpeg', FileType.Image],
  ['.jpg', FileType.Image],
  ['.png', FileType.Image],
  ['.apng', FileType.Image],
  ['.gif', FileType.Image],
  ['.webp', FileType.Image],
  ['.avif', FileType.Image],
  ['.bmp', FileType.Image],

  ['.txt', FileType.Text],
  ['.doc', FileType.Text],
  ['.docx', FileType.Text],
  ['.pdf', FileType.Text],
  ['.rtf', FileType.Text],
  ['.odt', FileType.Text],
  ['.odp', FileType.Text],
  ['.ods', FileType.Text],

  ['.mp3', FileType.Audio],
  ['.wav', FileType.Audio],
  ['.ogg', FileType.Audio],

  ['.mp4', FileType.Video],
  ['.webm', FileType.Video],
  ['.mkv', FileType.Video],
  ['.mov', FileType.Video],

  ['.swf', FileType.Flash],
]);

export async function getFileFormat(filePath: string, options: { strict: true;  buffer?: Buffer }): Promise<FileFormat>;
export async function getFileFormat(filePath: string, options?: GetFileFormatOptions | undefined): Promise<FileFormat | undefined>;
export async function getFileFormat(filePath: string, options?: GetFileFormatOptions | undefined): Promise<FileFormat | undefined> {
  const fileExtension = (path.extname(filePath) || undefined) as Extension | undefined;
  const mime = options?.buffer && await getMime(options.buffer);
  const extension = mime?.extension ?? fileExtension;

  if (!extension) {
    if (options?.strict) {
      throw new Error('No mime-type or extension found.');
    }

    return;
  }

  const fileType = fileTypeMap.get(extension);

  if (!fileType) {
    if (options?.strict) {
      throw new Error(`No file-type found for extension: ${extension}`);
    }

    return;
  }

  const contentType = await getContentType(filePath, extension);

  if (!contentType) {
    if (options?.strict) {
      throw new Error(`No content-type found for extension: ${extension}`);
    }

    return;
  }

  return {
    fileExtension,
    extension,
    fileType,
    contentType,
    mimeExtension: mime?.extension,
    mimeType: mime?.type,
  };
}

const getMime = async (buffer: Buffer): Promise<{ extension: Extension; type: string } | undefined> => {
  const result = await fileType.fromBuffer(buffer);

  if(!result) {
    return;
  }

  return {
    extension: `.${result.ext}`,
    type: result.mime,
  };
}

const getContentType = async (filePath: string, extension: Extension): Promise<ContentType | undefined> => {
  if (!animatableImageExtensions.includes(extension)) {
    return contentTypeMap.get(extension);
  }

  const { frameCount } = await getAnimatedImageMetadata(filePath, extension);
  return frameCount > 1 ? ContentType.Animation : ContentType.StaticImage;
}

export interface GetFileFormatOptions {
  strict?: boolean | undefined;
  buffer?: Buffer | undefined;
}

export interface FileFormat {
  mimeExtension: Extension | undefined;
  fileExtension: Extension | undefined;
  extension: Extension;
  mimeType: string | undefined;
  fileType: FileType;
  contentType: ContentType;
}
