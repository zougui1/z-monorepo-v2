import { FuraffinitySubmissionQuery } from './FuraffinitySubmissionQuery';
import {
  FuraffinitySubmission as FuraffinitySubmissionModel,
  SubmissionStatus,
} from './FuraffinitySubmission';

export namespace FuraffinitySubmission {
  export const Query = new FuraffinitySubmissionQuery();
  export const Status = SubmissionStatus;
  export type Status = SubmissionStatus;
  export type Document = FuraffinitySubmissionModel.Document;
  export type Object = FuraffinitySubmissionModel.Object;
}
