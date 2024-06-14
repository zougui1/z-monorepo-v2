import { DateTime } from 'luxon';

import { Metadata } from './Metadata';
import { MetadataObject } from './IMetadata';

const fileMetadataKeys: ReadonlyArray<keyof MetadataObject> = [
  'atime',
  'atimeMs',
  'birthtime',
  'birthtimeMs',
  'blksize',
  'blocks',
  'bytes',
  'ctime',
  'ctimeMs',
  'dev',
  'gid',
  'ino',
  'isBlockDevice',
  'isCharacterDevice',
  'isDirectory',
  'isFIFO',
  'isFile',
  'isSocket',
  'isSymbolicLink',
  'mode',
  'mtime',
  'nlink',
  'rdev',
  'size',
  'uid',
];

const mocks = {
  stat: jest.fn(),
  getFormat: jest.fn(),
  readBytes: jest.fn(),
  pickFieldsFromResolvedObject: jest.fn(),
};

jest.mock('fs-extra', () => {
  return {
    stat: (...args: any[]) => mocks.stat(...args),
  };
});

jest.mock('../utils', () => {
  return {
    getFormat: (...args: any[]) => mocks.getFormat(...args),
    pickFieldsFromResolvedObject: (...args: any[]) => mocks.pickFieldsFromResolvedObject(...args),
    readBytes: (...args: any[]) => mocks.readBytes(...args),
  };
});

afterEach(() => {
  mocks.stat.mockReset();
  mocks.getFormat.mockReset();
  mocks.pickFieldsFromResolvedObject.mockReset();
  mocks.readBytes.mockReset();
  jest.clearAllMocks();
});

describe('Metadata', () => {
  const minimumHeaderBytes = 4100;

  describe('get', () => {
    it('should only return the selected stats fields', async () => {
      const file = 'path/to/file.txt';
      const stats = {
        isFile: () => false,
        isDirectory: () => false,
        isBlockDevice: () => false,
        isCharacterDevice: () => false,
        isSymbolicLink: () => false,
        isFIFO: () => false,
        isSocket: () => false,
        dev: 14255142,
        ino: 142545142,
        mode: 1424512,
        nlink: 14245142,
        uid: 14255142,
        gid: 1425542,
        rdev: 14545142,
        size: 14255142,
        blksize: 425142,
        blocks: 14254542,
        atimeMs: 145141455,
        mtimeMs: 1451441455,
        ctimeMs: 1141455,
        birthtimeMs: 1441455,
        atime: new Date(145141455),
        mtime: new Date(1451441455),
        ctime: new Date(1141455),
        birthtime: new Date(1441455),
      };

      mocks.stat.mockResolvedValue(stats);
      mocks.pickFieldsFromResolvedObject.mockResolvedValue({
        isFile: expect.any(Function),
        dev: 14255142,
        atimeMs: 145141455,
        atime: DateTime.fromMillis(145141455),
        bytes: '14.3 MB',
      });

      const metadata = new Metadata(file);
      const result = await metadata.get({
        fields: ['atime', 'bytes', 'atimeMs', 'isFile', 'dev'],
      });

      expect(result).toEqual({
        isFile: expect.any(Function),
        dev: 14255142,
        atimeMs: 145141455,
        atime: DateTime.fromMillis(145141455),
        bytes: '14.3 MB',
      });
      expect(mocks.pickFieldsFromResolvedObject).toBeCalledWith(
        expect.any(Function),
        fileMetadataKeys,
        ['atime', 'bytes', 'atimeMs', 'isFile', 'dev'],
      );
    });
  });
});
