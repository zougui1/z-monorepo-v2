import { prop, getModelForClass } from '@typegoose/typegoose';

import { Rating, Category, Species, Gender } from '@zougui/common.furaffinity';

import { User } from '../user/User';
import { DescriptionNode } from '../../common-schemas';
import { enumProp } from '../../utils';
import { DocumentType } from '../../types';
import { WeakEnum } from '../../../types';

class SubmissionContent {
  @enumProp({ enum: Category, required: true })
  category!: WeakEnum<Category>;

  @enumProp({ enum: Species, required: true })
  species!: WeakEnum<Species>;

  @enumProp({ enum: Gender, required: true })
  gender!: WeakEnum<Gender>;
}

class SubmissionStats {
  @prop({ required: true })
  favoriteCount!: number;

  @prop({ required: true })
  commentCount!: number;

  @prop({ required: true })
  viewCount!: number;
}

export class SubmissionReport {
  @prop({ type: String })
  error?: string | undefined;

  @prop({ type: String, default: [] })
  duplicatesIds!: string[];
}

export enum SubmissionStatus {
  Idle = 'idle',
  Downloading = 'downloading',
  Success = 'success',
  Error = 'error',
  Duplicate = 'duplicate',
}

export class FuraffinitySubmission {
  @prop({ required: true, unique: true })
  id!: string;

  @prop({ required: true, unique: true })
  url!: string;

  @prop({ required: true, unique: true })
  downloadUrl!: string;

  @prop({ type: String })
  previewUrl?: string | undefined;

  @prop({ required: true })
  title!: string;

  @prop({ required: true, type: Date })
  postedDate!: Date;

  @enumProp({ enum: Rating, required: true })
  rating!: WeakEnum<Rating>;

  @prop({ required: true, type: [String] })
  keywords!: string[];

  @prop({ type: () => User, ref: () => User, required: true })
  author!: User.Object;

  description!: DescriptionNode;

  @prop({ required: true, type: SubmissionContent, _id: false })
  content!: SubmissionContent;

  @prop({ required: true, type: SubmissionStats, _id: false })
  stats!: SubmissionStats;

  @enumProp({ enum: SubmissionStatus, required: true })
  status!: WeakEnum<SubmissionStatus>;

  @prop({ type: SubmissionReport, _id: false })
  report?: SubmissionReport | undefined;
}

// istanbul ignore next for some reason the namespace is marked as untested
export namespace FuraffinitySubmission {
  export const Model = getModelForClass(FuraffinitySubmission);
  Model.schema.add({
    description: {
      type: DescriptionNode.Schema,
      required: true,
      _id: false,
    },
  });

  export type Document = DocumentType<FuraffinitySubmission>;
  export type Object = FuraffinitySubmission & { _id: string };
}
