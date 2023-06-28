import imgHash from 'imghash';

import { downloadSubmissionFile } from './downloadSubmissionFile';
import * as downloadImage from './downloadImage';
import { processImage } from './processing';
import { ContentType } from '../../../enums';
import env from '../../../env';

const mocks = {
  useTempDir: jest.fn(),
  downloadFile: jest.fn(),
  moveToDir: jest.fn(),
  getFileMetadata: jest.fn(),
  getContentType: jest.fn(),
};

jest.mock('../../../utils', () => {
  return {
    useTempDir: (...args: any[]) => mocks.useTempDir(...args),
    downloadFile: (...args: any[]) => mocks.downloadFile(...args),
    moveToDir: (...args: any[]) => mocks.moveToDir(...args),
    getFileMetadata: (...args: any[]) => mocks.getFileMetadata(...args),
    getContentType: (...args: any[]) => mocks.getContentType(...args),
  };
});

describe('downloadSubmissionFile', () => {
  afterEach(() => {
    mocks.downloadFile.mockReset();
    mocks.getFileMetadata.mockReset();
    mocks.moveToDir.mockReset();
    mocks.useTempDir.mockReset();
    mocks.getContentType.mockReset();
    jest.clearAllMocks();
  })

  describe('when the file is a static image', () => {
    it('should return the result of the download', async () => {
      const url = 'https://d.furaffinity.net/ioprseghsieoujhgferi.png';

      jest.spyOn(downloadImage, 'downloadImage').mockResolvedValue({
        original: {
          path: 'path/to/original.png',
          size: 69420,
          height: 500,
          width: 500,
        },
        sample: {
          webp: {
            path: 'path/to/sample.webp',
            size: 42069,
            height: 300,
            width: 300,
          },
          avif: {
            path: 'path/to/sample.avif',
            size: 690,
            height: 300,
            width: 300,
          },
        },
      });
      jest.spyOn(imgHash, 'hash').mockResolvedValue('dfuosghuyisdr');
      mocks.getContentType.mockReturnValue(ContentType.StaticImage);

      const result = await downloadSubmissionFile(url);

      expect(result).toEqual({
        original: {
          path: 'path/to/original.png',
          size: 69420,
          height: 500,
          width: 500,
          hash: 'dfuosghuyisdr',
        },
        sample: {
          webp: {
            path: 'path/to/sample.webp',
            size: 42069,
            height: 300,
            width: 300,
          },
          avif: {
            path: 'path/to/sample.avif',
            size: 690,
            height: 300,
            width: 300,
          },
        },
      });

      expect(mocks.getContentType).toBeCalledWith(url, { strict: true });

      expect(downloadImage.downloadImage).toBeCalledWith(url, {
        process: processImage,
        tempDir: env.processing.tempDir,
        originalDir: env.processing.submissionDir,
        sampleDir: env.processing.submissionSampleDir,
      });
      expect(imgHash.hash).toBeCalledWith(
        'path/to/original.png',
        Math.round(env.processing.hashLength / 4),
      );
    });
  });

  describe('when the file is not a static image', () => {
    it('should return the result of the download', async () => {
      const url = 'https://d.furaffinity.net/ioprseghsieoujhgferi.docx';

      mocks.getContentType.mockReturnValue(ContentType.Text);
      mocks.useTempDir.mockImplementation(async (tempDir, callback) => {
        return await callback('path/to/tempDir/generated-name', 'generated-name');
      });
      mocks.downloadFile.mockResolvedValue(undefined);
      mocks.moveToDir.mockResolvedValue('final/path.docx');
      mocks.getFileMetadata.mockResolvedValue({
        size: 564,
        wordCount: 1454,
      });

      const result = await downloadSubmissionFile(url);

      expect(result).toEqual({
        original: {
          path: 'final/path.docx',
          size: 564,
          wordCount: 1454,
        },
      });

      expect(mocks.getContentType).toBeCalledWith(url, { strict: true });
      expect(mocks.useTempDir).toBeCalledWith(env.processing.tempDir, expect.any(Function));
      expect(mocks.downloadFile).toBeCalledWith(
        url,
        'path/to/tempDir/generated-name/generated-name.docx',
      );
      expect(mocks.moveToDir).toBeCalledWith(
        'path/to/tempDir/generated-name/generated-name.docx',
        env.processing.submissionDir,
      );
      expect(mocks.getFileMetadata).toBeCalledWith('final/path.docx');
    });
  });
});
