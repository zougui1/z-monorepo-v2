import decompress from 'decompress';

import { parseOpenOffice } from './parseOpenOffice';

let decompressDocPath: string;

jest.mock('decompress', () => {
  return jest.fn().mockImplementation(async (buffer, options) => {
    const doc = {
      path: decompressDocPath,
      data: Buffer.from('some data'),
    };

    return options.filter(doc) ? [doc] : [];
  });
});

const mockXmlParse = jest.fn().mockImplementation(() => [
  {
    key: {
      val: 'Dragons',
      arbitrary: '',
    },
  },
  {
    vals: [
      'are',
      {
        truth: 'superior',
      },
    ],
  },
]);

jest.mock('fast-xml-parser', () => {
  return {
    XMLParser: jest.fn().mockImplementation(() => ({
      parse: mockXmlParse,
    })),
  };
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('parseOpenOffice', () => {
  describe('when the filter matches a file named "content.xml"', () => {
    it('should return the string from the buffer', async () => {
      decompressDocPath = 'content.xml';

      const string = 'Dragons are superior';
      const buffer = Buffer.from(string);

      const result = await parseOpenOffice(buffer);

      expect(result).toBe(string);
      expect(decompress).toHaveBeenCalledTimes(1);
      expect(decompress).toHaveBeenCalledWith(buffer, {
        filter: expect.any(Function),
      });
      expect(mockXmlParse).toHaveBeenCalledTimes(1);
      expect(mockXmlParse).toHaveBeenCalledWith(Buffer.from('some data'));
    });
  });

  describe('when the filter does not match any file named "content.xml"', () => {
    it('should return the string from the buffer', async () => {
      decompressDocPath = 'styles.xml';

      const string = 'Dragons are superior';
      const buffer = Buffer.from(string);

      const getResult = () => parseOpenOffice(buffer);

      await expect(getResult).rejects.toThrowError(/could not parse/i);
      expect(decompress).toHaveBeenCalledTimes(1);
      expect(decompress).toHaveBeenCalledWith(buffer, {
        filter: expect.any(Function),
      });
    });
  });
});
