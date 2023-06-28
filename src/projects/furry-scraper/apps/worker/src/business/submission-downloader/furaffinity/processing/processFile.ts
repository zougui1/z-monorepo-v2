import { FileProcessingResult } from '.';
import { moveToDir, getFileMetadata, FileMetadata } from '../../../../utils';

export const processFile = async (file: string, options: ProcessImageOptions): Promise<FileMetadataProcessingResult> => {
  const result = await options.process(file);
  const originalPath = result?.original ?? file;
  const samples = result?.samples || [];

  const [
    originalFile,
    ...samplesFiles
  ] = await Promise.all([
    moveToDir(originalPath, options.originalDir),
    ...samples.map(file => moveToDir(file, options.sampleDir)),
  ]);

  const [
    originalMetadata,
    ...samplesMetadata
  ] = await Promise.all([
    getFileMetadata(originalFile),
    ...samplesFiles.map(file => getFileMetadata(file)),
  ]);

  return {
    original: originalMetadata,
    samples: samplesMetadata,
  };
}

export interface ProcessImageOptions {
  process: (tempFile: string) => Promise<FileProcessingResult | undefined>;
  originalDir: string;
  sampleDir: string;
}

export interface FileMetadataProcessingResult {
  original: FileMetadata;
  samples: FileMetadata[];
}
