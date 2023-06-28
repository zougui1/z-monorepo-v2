import { SubmissionQuery } from './SubmissionQuery';
import { Submission } from './Submission';

describe('SubmissionQuery', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a document and return it', async () => {
      const submission = {
        posts: [
          {
            id: '69',
            url: 'https://furaffinity/view/69',
          },
        ],
      };

      // @ts-ignore
      jest.spyOn(Submission.Model, 'create').mockResolvedValue({
        toObject: () => ({
          ...submission,
          _id: 'kfdbnjrufhguiodr',
        }),
      });

      const result = await new SubmissionQuery().create(submission as any);

      expect(result).toEqual({
        ...submission,
        _id: 'kfdbnjrufhguiodr',
      });
      expect(Submission.Model.create).toBeCalledWith(submission);
    });
  });

  describe('addPost', () => {
    it('should create a document and return it', async () => {
      const objectId = 'dlfkhgbnudjir';
      const post = {
        id: '69',
        url: 'https://furaffinity/view/69',
      };

      // @ts-ignore
      jest.spyOn(Submission.Model, 'updateOne').mockResolvedValue(undefined);

      await new SubmissionQuery().addPost(objectId, post as any);

      expect(Submission.Model.updateOne).toBeCalledWith(
        { _id: objectId },
        { $push: { posts: post } },
      );
    });
  });
});
