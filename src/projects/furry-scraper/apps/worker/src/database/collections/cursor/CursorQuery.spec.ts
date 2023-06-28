import { CursorQuery } from './CursorQuery';
import { Cursor, CursorStatus } from './Cursor';
import { Source } from '../../../enums';

describe('CursorQuery', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findOrCreate', () => {
    describe('when a cursor was found', () => {
      it('should return the cursor', async () => {
        const source = Source.Furaffinity;
        const defaultCursor: Omit<Cursor, 'source'> = {
          lastSubmissionId: '0',
          status: 'idle',
        };

        jest.spyOn(Cursor.Model, 'findOne').mockResolvedValue({
          toObject: () => ({
            _id: 'dfsbhuigfyisuefrui',
            lastSubmissionId: '69',
            status: 'idle',
          }),
        });
        jest.spyOn(Cursor.Model, 'create');

        const result = await new CursorQuery().findOrCreate(source, defaultCursor);

        expect(result).toEqual({
          _id: 'dfsbhuigfyisuefrui',
          lastSubmissionId: '69',
          status: 'idle',
        });
        expect(Cursor.Model.findOne).toBeCalledWith({ source });
        expect(Cursor.Model.create).not.toBeCalled();
      });
    });

    describe('when no cursor was found', () => {
      it('should create a new cursor and return it', async () => {
        const source = Source.Furaffinity;
        const defaultCursor: Omit<Cursor, 'source'> = {
          lastSubmissionId: '0',
          status: 'idle',
        };

        jest.spyOn(Cursor.Model, 'findOne').mockResolvedValue(undefined);
        // @ts-ignore
        jest.spyOn(Cursor.Model, 'create').mockResolvedValue({
          toObject: () => ({
            _id: 'dfkbojhdjuri',
            lastSubmissionId: '0',
            status: 'idle',
            source,
          }),
        });

        const result = await new CursorQuery().findOrCreate(source, defaultCursor);

        expect(result).toEqual({
          _id: 'dfkbojhdjuri',
          lastSubmissionId: '0',
          status: 'idle',
          source,
        });
        expect(Cursor.Model.findOne).toBeCalledWith({ source });
        expect(Cursor.Model.create).toBeCalledWith({
          lastSubmissionId: '0',
          status: 'idle',
          source,
        });
      });
    });
  });

  describe('advance', () => {
    it('should update the cursor to the next submission ID', async () => {
      const source = Source.Furaffinity;
      const lastSubmissionId = '69';

      jest.spyOn(Cursor.Model, 'updateOne').mockResolvedValue(undefined as any);

      await new CursorQuery().advance(source, lastSubmissionId);

      expect(Cursor.Model.updateOne).toBeCalledWith(
        { source },
        {
          lastSubmissionId,
          status: CursorStatus.Idle,
        },
      );
    });
  });

  describe('updateStatus', () => {
    it('should update the status of the cursor', async () => {
      const source = Source.Furaffinity;
      const status = CursorStatus.Error;
      const report: Cursor.Report = {
        error: 'oh no',
      };

      jest.spyOn(Cursor.Model, 'updateOne').mockResolvedValue(undefined as any);

      await new CursorQuery().updateStatus(source, status, report);

      expect(Cursor.Model.updateOne).toBeCalledWith(
        { source },
        {
          status,
          report,
        },
      );
    });
  });
});
