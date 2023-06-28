import { FileMetadata } from '../../../utils';

export interface OriginalFileMetadata extends FileMetadata {
  hash?: string | undefined;
}

export interface DownloadSubmissionFileResult {
  original: OriginalFileMetadata;
  samples: FileMetadata[];
}
