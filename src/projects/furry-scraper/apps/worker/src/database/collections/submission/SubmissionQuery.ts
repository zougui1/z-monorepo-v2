import type { Cursor, ObjectId } from 'mongoose';

import { Submission, Post } from './Submission';
import { ContentType } from '../../../enums';
import { WeakEnum } from '../../../types';

export class SubmissionQuery {
  async create(submission: Submission): Promise<Submission.Object> {
    const document = await Submission.Model.create(submission);
    return document.toObject();
  }

  /**
   * TODO replace this method with an indexing search engine
   * @deprecated use an indexing engine, like elasticsearch, instead
   * @param param0
   * @returns
   */
  async getManyHashCursor({ contentType }: GetAllIdleCursorOptions): Promise<Cursor<HashCursorItem>> {
    return Submission.Model
      .aggregate()
      .match({
        'posts.file.type': {
          $in: [contentType],
        },
        'posts.file.original.hash': {
          $ne: null,
        },
      })
      .unwind('$posts')
      .match({
        'posts.file.type': contentType,
        'posts.file.original.hash': {
          $ne: null,
        },
      })
      .project({
        id: '$posts.id',
        source: '$posts.source',
        hash: '$posts.file.original.hash',
      })
      .cursor();
  }

  async addPost(objectId: string, post: Post): Promise<void> {
    await Submission.Model.updateOne(
      { _id: objectId },
      { $push: { posts: post } },
    );
  }
}

export interface GetAllIdleCursorOptions {
  contentType: ContentType;
}

export interface HashCursorItem {
  _id: ObjectId;
  id: string;
  hash: string;
  source: WeakEnum<ContentType>;
}
