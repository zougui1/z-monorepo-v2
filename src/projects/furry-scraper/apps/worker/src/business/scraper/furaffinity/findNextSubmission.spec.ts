import { findNextSubmission } from './findNextSubmission';
import * as getCursor from './getCursor';
import * as downloadSubmission from './downloadSubmission';
import { FuraffinitySubmission, Cursor } from '../../../database';
import { Source } from '../../../enums';

describe('findNextSubmission', () => {
  const source = Source.Furaffinity;

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('when the cursor is running', () => {
    it('should do nothing', async () => {
      jest.spyOn(Cursor.Query, 'updateStatus').mockResolvedValue(undefined);
      jest.spyOn(Cursor.Query, 'advance').mockResolvedValue(undefined);
      jest.spyOn(getCursor, 'getCursor').mockResolvedValue({
        status: Cursor.Status.Running,
      } as Cursor.Object);
      jest.spyOn(downloadSubmission, 'downloadSubmission').mockResolvedValue(undefined);

      const result = await findNextSubmission();

      expect(result).toBeUndefined();
      expect(Cursor.Query.updateStatus).not.toBeCalled();
      expect(Cursor.Query.advance).not.toBeCalled();
      expect(downloadSubmission.downloadSubmission).not.toBeCalled();
    });
  });

  describe('when an error occured while trying to find a submission', () => {
    it('should report the error to the cursor', async () => {
      jest.spyOn(Cursor.Query, 'updateStatus').mockResolvedValue(undefined);
      jest.spyOn(Cursor.Query, 'advance').mockResolvedValue(undefined);
      jest.spyOn(getCursor, 'getCursor').mockResolvedValue({
        lastSubmissionId: '68',
        status: Cursor.Status.Idle,
      } as Cursor.Object);
      jest
        .spyOn(downloadSubmission, 'downloadSubmission')
        .mockRejectedValue(new Error('Too kinky'));

      const result = await findNextSubmission();

      expect(result).toBeUndefined();
      expect(Cursor.Query.updateStatus).toBeCalledTimes(2);
      expect(Cursor.Query.updateStatus).toBeCalledWith(source, Cursor.Status.Running);
      expect(downloadSubmission.downloadSubmission).toBeCalledWith(69);
      expect(Cursor.Query.updateStatus).toBeCalledWith(
        source,
        Cursor.Status.Error,
        { error: 'Too kinky' },
      );
      expect(Cursor.Query.advance).not.toBeCalled();
    });
  });

  describe('when the submission was found', () => {
    it('should report the error to the cursor', async () => {
      jest.spyOn(Cursor.Query, 'updateStatus').mockResolvedValue(undefined);
      jest.spyOn(Cursor.Query, 'advance').mockResolvedValue(undefined);
      jest.spyOn(getCursor, 'getCursor').mockResolvedValue({
        lastSubmissionId: '68',
        status: Cursor.Status.Idle,
      } as Cursor.Object);
      jest.spyOn(downloadSubmission, 'downloadSubmission').mockResolvedValue({
        _id: 'oduhfgydsbnfvou',
        id: '69',
        url: 'https://furaffinity.net/view/69',
      } as FuraffinitySubmission.Object);

      const result = await findNextSubmission();

      expect(result).toEqual({
        _id: 'oduhfgydsbnfvou',
        id: '69',
        url: 'https://furaffinity.net/view/69',
      });
      expect(Cursor.Query.updateStatus).toBeCalledTimes(1);
      expect(Cursor.Query.updateStatus).toBeCalledWith(source, Cursor.Status.Running);
      expect(downloadSubmission.downloadSubmission).toBeCalledWith(69);
      expect(Cursor.Query.advance).toBeCalledWith(source, '69');
    });
  });
});
