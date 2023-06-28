import { prop, getModelForClass } from '@typegoose/typegoose';

import { ContentType, FileType } from '@zougui/common.fs';

import { User } from '../user/User';
import { enumProp } from '../../utils';
import { DocumentType } from '../../types';
import { Source } from '../../../enums';
import { WeakEnum } from '../../../types';

export enum SubmissionRating {
  SFW = 'SFW',
  NSFW = 'NSFW',
}

class File {
  // common properties
  @prop({ required: true })
  name!: string;
  @prop({ required: true })
  size!: number;

  // properties for images
  @prop({ type: String })
  hash?: string | undefined;

  // poroperties for images and videos
  @prop({ type: Number })
  width?: number | undefined;
  @prop({ type: Number })
  height?: number | undefined;

  // properties for animated files
  @prop({ type: Number })
  frameCount?: number | undefined;
  @prop({ type: Number })
  frameRate?: number | undefined;

  // properties for animated files and audios
  @prop({ type: Number })
  duration?: number | undefined;

  // properties for text and doc files
  @prop({ type: Number })
  wordCount?: number | undefined;
}

class PreviewFile {
  @prop({ required: true })
  name!: string;
  @prop({ required: true })
  size!: number;
  @prop({ required: true })
  width!: number;
  @prop({ required: true })
  height!: number;
}

class FileGroup {
  @enumProp({ enum: FileType, required: true })
  type!: WeakEnum<FileType>;

  @enumProp({ enum: ContentType, required: true })
  contentType!: WeakEnum<ContentType>;

  @prop({ type: File, required: true, _id: false })
  original!: File;

  @prop({ type: [File], required: true, _id: false })
  samples!: File[];
}

class PreviewFileGroup {
  @prop({ type: PreviewFile, required: true, _id: false })
  original!: PreviewFile;

  @prop({ type: [PreviewFile], required: true, _id: false })
  samples!: PreviewFile[];
}

export class Post {
  @prop({ required: true })
  id!: string;

  @prop({ required: true, unique: true })
  url!: string;

  @prop({ required: true, unique: true })
  downloadUrl!: string;

  @prop({ required: true })
  title!: string;

  @enumProp({ enum: Source, required: true })
  source!: WeakEnum<Source>;

  @prop({ required: true, type: Date })
  postedDate!: Date;

  @enumProp({ enum: SubmissionRating, required: true })
  rating!: WeakEnum<SubmissionRating>;

  @prop({ type: [String], equired: true })
  tags!: string[];

  @prop({ type: () => User, ref: () => User, required: true })
  author!: User.Object;

  @prop({ type: String, required: false })
  description?: string | undefined;

  @prop({ type: FileGroup, required: true, _id: false })
  file!: FileGroup;

  @prop({ type: PreviewFileGroup, required: false, _id: false })
  preview?: PreviewFileGroup | undefined;
}

export class Submission {
  @prop({ required: true, type: Post })
  posts!: Post[];
}

// istanbul ignore next for some reason the namespace is marked as untested
export namespace Submission {
  export const Model = getModelForClass(Submission);
  export type Document = DocumentType<Submission>;
  export type Object = Submission & { _id: string };
}
