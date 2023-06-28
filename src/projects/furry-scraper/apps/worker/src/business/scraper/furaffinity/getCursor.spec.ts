import { getCursor } from './getCursor';
import { Cursor } from '../../../database';
import { Source } from '../../../enums';

describe('getCursor', () => {
  const source = Source.Furaffinity;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find a cursor furaffinity or create it', async () => {
    jest.spyOn(Cursor.Query, 'findOrCreate').mockResolvedValue({
      _id: 'dfsjghysdub',
      lastSubmissionId: '0',
      status: Cursor.Status.Idle,
      source,
    } as any);

    const result = await getCursor();

    expect(result).toEqual({
      _id: 'dfsjghysdub',
      lastSubmissionId: '0',
      status: Cursor.Status.Idle,
      source,
    });
    expect(Cursor.Query.findOrCreate).toBeCalledWith(source, {
      lastSubmissionId: '0',
      status: Cursor.Status.Idle,
    });
  });
});
