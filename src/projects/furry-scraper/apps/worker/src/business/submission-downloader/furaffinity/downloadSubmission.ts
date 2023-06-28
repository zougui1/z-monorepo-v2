import path from 'node:path';

import { File } from '@zougui/common.fs';

import { findDuplicate } from './findDuplicate';
import { downloadSubmissionFile } from './downloadSubmissionFile';
import { downloadPreviewFile } from './downloadPreviewFile';
import { DownloadSubmissionFileResult } from './types';
import { FuraffinitySubmission, Submission } from '../../../database';
import { FileMetadata, ImageMetadata } from '../../../utils';
import { Source } from '../../../enums';

export const downloadSubmission = async (submission: FuraffinitySubmission.Object): Promise<DownloadSubmissionResult> => {
  const [file, preview] = await Promise.all([
    downloadSubmissionFile(submission.downloadUrl),
    submission.previewUrl && downloadPreviewFile(submission.previewUrl),
  ]);

  const post = {
    id: submission.id,
    url: submission.url + '/',
    downloadUrl: submission.downloadUrl,
    title: submission.title,
    source: Source.Furaffinity,
    postedDate: submission.postedDate,
    rating: submission.rating === 'General' || submission.rating === 'Any'
      ? Submission.Rating.SFW
      : Submission.Rating.NSFW,
    tags: [
      ...submission.keywords,
      submission.content.category,
      submission.content.gender,
      submission.content.species,
    ],
    author: submission.author,
    description: submission.description.text,
    file: await getSubmissionFile(file),
    preview: preview ? getPreviewFile(preview) : undefined,
  };

  const duplicate = file.original.hash
    ? await findDuplicate(post.file.contentType, file.original.hash)
    : undefined;

  if (duplicate) {
    return {
      status: FuraffinitySubmission.Status.Duplicate,
      post,
      duplicate,
    };
  }

  return {
    status: FuraffinitySubmission.Status.Success,
    post,
  };
}

export interface DownloadSubmissionResult {
  status: typeof FuraffinitySubmission.Status['Success'] | typeof FuraffinitySubmission.Status['Duplicate'];
  post: Submission.Post;
  duplicate?: { _id: string;  id: string } | undefined;
}

const getFileData = (file: OriginalFileMetadata) => {
  return {
    ...file,
    name: path.basename(file.path),
  };
}

const getSubmissionFile = async (fileData: DownloadSubmissionFileResult) => {
  const file = new File(fileData.original.path);

  const commonData = {
    original: getFileData(fileData.original),
    contentType: await file.metadata.getContentType({ strict: true }),
    type: await file.metadata.getFileType({ strict: true }),
  };

  return {
    ...commonData,
    samples: fileData.samples.map(getFileData),
  };
}

const getPreviewFile = (file: DownloadSubmissionFileResult) => {
  return {
    original: getFileData(file.original) as (ImageMetadata & { name: string }),
    samples: file.samples.map(getFileData) as (ImageMetadata & { name: string })[],
  };
}

export interface OriginalFileMetadata extends FileMetadata {
  path: string;
  hash?: string | undefined;
}
