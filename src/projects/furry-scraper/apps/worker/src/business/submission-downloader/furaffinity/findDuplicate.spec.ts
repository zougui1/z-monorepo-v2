import { findDuplicate } from './findDuplicate';
import { Submission } from '../../../database';

describe('findDuplicate', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return undefined when no duplicate was found', async () => {
    const file = 'path/to/file.png';
    const hash = 'sdohjfigdwxuikgsdhuiofghgusoiefguoqsehfguisevbchsdgf';

    const cursorClose = jest.fn().mockResolvedValue(undefined);

    jest.spyOn(Submission.Query, 'getManyHashCursor').mockImplementation(async () => {
      const cursor = async function* () {
        yield { _id: 'rsuohg', hash: 'dsfghuo' };
      }();
      (cursor as any).close = cursorClose;
      return cursor as any;
    });

    const result = await findDuplicate(file, hash);

    expect(result).toBeUndefined();
    expect(cursorClose).toBeCalled();
  });

  it('should return the IDs of the doc computed as duplicate', async () => {
    const file = 'path/to/file.png';
    const hash = 'sdohjfigdwxuikgsdhuiofghgusoiefguoqsehfguisevbchsdgf';

    const cursorClose = jest.fn().mockResolvedValue(undefined);

    jest.spyOn(Submission.Query, 'getManyHashCursor').mockImplementation(async () => {
      const cursor = async function* () {
        yield {
          _id: 'rsuohg',
          id: '69',
          hash: 'sdohjfigdwxuigshuioghgusoiefguoqsehfguisevbchsdg',
        };
      }();
      (cursor as any).close = cursorClose;
      return cursor as any;
    });

    const result = await findDuplicate(file, hash);

    expect(result).toEqual({
      _id: 'rsuohg',
      id: '69',
    });
    expect(cursorClose).toBeCalled();
  });
});
