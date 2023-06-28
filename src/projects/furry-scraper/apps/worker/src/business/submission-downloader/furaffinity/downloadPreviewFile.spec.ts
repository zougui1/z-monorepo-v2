import { downloadPreviewFile } from './downloadPreviewFile';
import * as downloadImage from './downloadImage';
import { processImage } from './processing';
import env from '../../../env';

describe('downloadPreviewFile', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('when the file is not a static image', () => {
    it('should throw an error', async () => {
      const url = 'https://d.furaffnity.net/klsdjnghfjers.docx';

      jest.spyOn(downloadImage, 'downloadImage').mockResolvedValue({} as any);
      const getResult = () => downloadPreviewFile(url);

      await expect(getResult).rejects.toThrowError();
      expect(downloadImage.downloadImage).not.toBeCalled();
    });
  });

  describe('when the file is a static image', () => {
    it('should download the image', async () => {
      const url = 'https://d.furaffnity.net/klsdjnghfjers.png';

      jest.spyOn(downloadImage, 'downloadImage').mockResolvedValue({
        path: 'path/to/image.png',
      } as any);

      const result = await downloadPreviewFile(url);

      expect(result).toEqual({
        path: 'path/to/image.png',
      });
      expect(downloadImage.downloadImage).toBeCalledWith(url, {
        process: processImage,
        tempDir: env.processing.tempDir,
        originalDir: env.processing.previewDir,
        sampleDir: env.processing.previewDir,
      });
    });
  });
});
