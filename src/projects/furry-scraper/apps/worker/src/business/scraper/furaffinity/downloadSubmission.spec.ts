import { downloadSubmission } from './downloadSubmission';
import { client } from './client';
import * as findOrCreateAuthor from './findOrCreateAuthor';
import * as createSubmission from './createSubmission';
import { FuraffinitySubmission, User } from '../../../database';
import { Source } from '../../../enums';

describe('downloadSubmission', () => {
  const source = Source.Furaffinity;

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('when could not find the submission', () => {
    it('should do nothing', async () => {
      const id = 69;

      jest.spyOn(client.submission, 'findOne').mockResolvedValue(undefined);
      jest.spyOn(FuraffinitySubmission.Query, 'findOneByUrl').mockResolvedValue(undefined);
      jest.spyOn(findOrCreateAuthor, 'findOrCreateAuthor').mockResolvedValue({} as any);
      jest.spyOn(createSubmission, 'createSubmission').mockResolvedValue({} as any);

      const result = await downloadSubmission(id);

      expect(result).toBeUndefined();
      expect(client.submission.findOne).toBeCalledWith(id);
      expect(FuraffinitySubmission.Query.findOneByUrl).not.toBeCalled();
      expect(findOrCreateAuthor.findOrCreateAuthor).not.toBeCalled();
      expect(createSubmission.createSubmission).not.toBeCalled();
    });
  });

  describe('when the submission was found but a duplicate was also found', () => {
    it('should do nothing', async () => {
      const id = 69;

      jest.spyOn(client.submission, 'findOne').mockResolvedValue({
        id,
        url: 'https://furaffinity.net/view/69',
        downloadUrl: 'https://d.furaffinity.net/lsdngkfhsdkofhbsu',
      } as any);
      jest.spyOn(FuraffinitySubmission.Query, 'findOneByUrl').mockResolvedValue({
        _id: 'pisdxjhfguirdsèçy_fgh',
      } as FuraffinitySubmission.Object);
      jest.spyOn(findOrCreateAuthor, 'findOrCreateAuthor').mockResolvedValue({} as any);
      jest.spyOn(createSubmission, 'createSubmission').mockResolvedValue({} as any);

      const result = await downloadSubmission(id);

      expect(result).toBeUndefined();
      expect(client.submission.findOne).toBeCalledWith(id);
      expect(FuraffinitySubmission.Query.findOneByUrl).toBeCalledWith({
        url: 'https://furaffinity.net/view/69',
        downloadUrl: 'https://d.furaffinity.net/lsdngkfhsdkofhbsu',
      });
      expect(findOrCreateAuthor.findOrCreateAuthor).not.toBeCalled();
      expect(createSubmission.createSubmission).not.toBeCalled();
    });
  });

  describe('when the submission was found but no duplicate was found', () => {
    it('should do nothing', async () => {
      const id = 69;

      jest.spyOn(client.submission, 'findOne').mockResolvedValue({
        id,
        url: 'https://furaffinity.net/view/69',
        downloadUrl: 'https://d.furaffinity.net/lsdngkfhsdkofhbsu',
        author: {
          _id: 'shdqsxghbrsuifghes',
          id: 'zougui',
          name: 'Zougui',
          url: 'https://furaffinity.net/user/zougui',
        },
      } as any);
      jest.spyOn(FuraffinitySubmission.Query, 'findOneByUrl').mockResolvedValue(undefined);
      jest.spyOn(findOrCreateAuthor, 'findOrCreateAuthor').mockResolvedValue({
        _id: 'shdqsxghbrsuifghes',
        id: 'zougui',
        name: 'Zougui',
        profileUrl: 'https://furaffinity.net/user/zougui',
        source,
      } as User.Object);
      jest.spyOn(createSubmission, 'createSubmission').mockResolvedValue({
        _id: 'izehfgybvsdfu',
        id: '69',
        url: 'https://furaffinity.net/view/69',
        downloadUrl: 'https://d.furaffinity.net/lsdngkfhsdkofhbsu',
      } as FuraffinitySubmission.Object);

      const result = await downloadSubmission(id);

      expect(result).toEqual({
        _id: 'izehfgybvsdfu',
        id: '69',
        url: 'https://furaffinity.net/view/69',
        downloadUrl: 'https://d.furaffinity.net/lsdngkfhsdkofhbsu',
      });
      expect(client.submission.findOne).toBeCalledWith(id);
      expect(FuraffinitySubmission.Query.findOneByUrl).toBeCalledWith({
        url: 'https://furaffinity.net/view/69',
        downloadUrl: 'https://d.furaffinity.net/lsdngkfhsdkofhbsu',
      });
      expect(findOrCreateAuthor.findOrCreateAuthor).toBeCalledWith({
        _id: 'shdqsxghbrsuifghes',
        id: 'zougui',
        name: 'Zougui',
        url: 'https://furaffinity.net/user/zougui',
      });
      expect(createSubmission.createSubmission).toBeCalledWith(
        {
          id,
          url: 'https://furaffinity.net/view/69',
          downloadUrl: 'https://d.furaffinity.net/lsdngkfhsdkofhbsu',
          author: {
            _id: 'shdqsxghbrsuifghes',
            id: 'zougui',
            name: 'Zougui',
            url: 'https://furaffinity.net/user/zougui',
          },
        },
        {
          _id: 'shdqsxghbrsuifghes',
          id: 'zougui',
          name: 'Zougui',
          profileUrl: 'https://furaffinity.net/user/zougui',
          source,
        },
      );
    });
  });
});
