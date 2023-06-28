import { SubmissionQuery } from './SubmissionQuery';
import {
  Submission as SubmissionModel,
  SubmissionRating,
  Post as Post_,
} from './Submission';

export namespace Submission {
  export const Query = new SubmissionQuery();
  export const Rating = SubmissionRating;
  export type Document = SubmissionModel.Document;
  export type Object = SubmissionModel.Object;
  export type Post = Post_;
}
