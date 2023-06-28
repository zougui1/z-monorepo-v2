import leven from 'fast-levenshtein';

import { ContentType } from '@zougui/common.fs';

import { Submission } from '../../../database';
import env from '../../../env';

export const findDuplicate = async (contentType: ContentType, hash: string): Promise<{ _id: string, id: string } | undefined> => {
  const cursor = await Submission.Query.getManyHashCursor({
    contentType,
  });

  for await (const doc of cursor) {
    const distance = leven.get(doc.hash, hash);

    if (distance <= env.processing.similarityThreshold) {
      await cursor.close();
      return {
        _id: String(doc._id),
        id: doc.id,
      };
    }
  }

  await cursor.close();
}
