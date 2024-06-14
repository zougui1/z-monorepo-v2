import fileType from 'file-type';

import { getFileFormat, GetFileFormatOptions } from './getFileFormat';
import * as getAnimatedImageMetadata from './getAnimatedImageMetadata';
import { FileType, ContentType } from '../enums';

describe('getFileFormat', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('when not strict', () => {
    describe('invalid', () => {
      afterEach(() => {
        jest.clearAllMocks();
      });
      it('should return undefined when no extension is found', async () => {
        const filePath = '.bashrc';
        const buffer = Buffer.from('dfsiohugfgzer');
        const options: GetFileFormatOptions = {
          buffer,
        };

        jest.spyOn(fileType, 'fromBuffer').mockResolvedValue(undefined);
        jest.spyOn(getAnimatedImageMetadata, 'getAnimatedImageMetadata');

        const result = await getFileFormat(filePath, options);

        expect(result).toBeUndefined();
        expect(fileType.fromBuffer).toBeCalledWith(buffer);
        expect(getAnimatedImageMetadata.getAnimatedImageMetadata).not.toBeCalled();
      });

      it('should return undefined when no file-type is found', async () => {
        const filePath = 'path/to/dragon.conf';

        jest.spyOn(fileType, 'fromBuffer');
        jest.spyOn(getAnimatedImageMetadata, 'getAnimatedImageMetadata');

        const result = await getFileFormat(filePath);

        expect(result).toBeUndefined();
        expect(fileType.fromBuffer).not.toBeCalled();
        expect(getAnimatedImageMetadata.getAnimatedImageMetadata).not.toBeCalled();
      });

      it('should return undefined when no content-type is found', async () => {
        const filePath = 'path/to/dragon.conf';

        jest.spyOn(fileType, 'fromBuffer');
        jest.spyOn(getAnimatedImageMetadata, 'getAnimatedImageMetadata');

        jest
          .spyOn(Map.prototype, 'get')
          .mockReturnValueOnce(FileType.Image)
          .mockReturnValueOnce(undefined);

        const result = await getFileFormat(filePath);

        expect(result).toBeUndefined();
        expect(fileType.fromBuffer).not.toBeCalled();
        expect(getAnimatedImageMetadata.getAnimatedImageMetadata).not.toBeCalled();
      });
    });

    describe('without buffer', () => {
      describe('text file', () => {
        const extensions = ['.txt', '.doc', '.docx', '.pdf', '.rtf', '.odt', '.odp', '.ods'];

        test.each(extensions)('should return the file\'s format for the extension %p', async extension => {
          const filePath = `path/to/text${extension}`;

          jest.spyOn(fileType, 'fromBuffer');
          jest.spyOn(getAnimatedImageMetadata, 'getAnimatedImageMetadata');

          const result = await getFileFormat(filePath);

          expect(result).toEqual({
            fileExtension: extension,
            mimeExtension: undefined,
            mimeType: undefined,
            fileType: FileType.Text,
            contentType: ContentType.Text,
            extension,
          });
          expect(fileType.fromBuffer).not.toBeCalled();
          expect(getAnimatedImageMetadata.getAnimatedImageMetadata).not.toBeCalled();
        });
      });

      describe('audio file', () => {
        const extensions = ['.mp3', '.wav', '.ogg'];

        test.each(extensions)('should return the file\'s format for the extension %p', async extension => {
          const filePath = `path/to/text${extension}`;

          jest.spyOn(fileType, 'fromBuffer');
          jest.spyOn(getAnimatedImageMetadata, 'getAnimatedImageMetadata');

          const result = await getFileFormat(filePath);

          expect(result).toEqual({
            fileExtension: extension,
            mimeExtension: undefined,
            mimeType: undefined,
            fileType: FileType.Audio,
            contentType: ContentType.Audio,
            extension,
          });
          expect(fileType.fromBuffer).not.toBeCalled();
          expect(getAnimatedImageMetadata.getAnimatedImageMetadata).not.toBeCalled();
        });
      });

      describe('flash file', () => {
        const extensions = ['.swf'];

        test.each(extensions)('should return the file\'s format for the extension %p', async extension => {
          const filePath = `path/to/text${extension}`;

          jest.spyOn(fileType, 'fromBuffer');
          jest.spyOn(getAnimatedImageMetadata, 'getAnimatedImageMetadata');

          const result = await getFileFormat(filePath);

          expect(result).toEqual({
            fileExtension: extension,
            mimeExtension: undefined,
            mimeType: undefined,
            fileType: FileType.Flash,
            contentType: ContentType.Flash,
            extension,
          });
          expect(fileType.fromBuffer).not.toBeCalled();
          expect(getAnimatedImageMetadata.getAnimatedImageMetadata).not.toBeCalled();
        });
      });

      describe('static image file', () => {
        describe('when animations are not supported', () => {
          const extensions = ['.jpeg', '.jpg', '.avif', '.bmp'];

          test.each(extensions)('should return the file\'s format for the extension %p', async extension => {
            const filePath = `path/to/text${extension}`;

            jest.spyOn(fileType, 'fromBuffer');
            jest.spyOn(getAnimatedImageMetadata, 'getAnimatedImageMetadata');

            const result = await getFileFormat(filePath);

            expect(result).toEqual({
              fileExtension: extension,
              mimeExtension: undefined,
              mimeType: undefined,
              fileType: FileType.Image,
              contentType: ContentType.StaticImage,
              extension,
            });
            expect(fileType.fromBuffer).not.toBeCalled();
            expect(getAnimatedImageMetadata.getAnimatedImageMetadata).not.toBeCalled();
          });
        });

        describe('when animations are supported', () => {
          const extensions = ['.png', '.apng', '.gif', '.webp'];

          test.each(extensions)('should return the file\'s format for the extension %p', async extension => {
            const filePath = `path/to/text${extension}`;

            jest.spyOn(fileType, 'fromBuffer');
            jest.spyOn(getAnimatedImageMetadata, 'getAnimatedImageMetadata').mockResolvedValue({
              frameCount: 1,
            } as any);

            const result = await getFileFormat(filePath);

            expect(result).toEqual({
              fileExtension: extension,
              mimeExtension: undefined,
              mimeType: undefined,
              fileType: FileType.Image,
              contentType: ContentType.StaticImage,
              extension,
            });
            expect(fileType.fromBuffer).not.toBeCalled();
            expect(getAnimatedImageMetadata.getAnimatedImageMetadata).toBeCalledWith(
              filePath,
              extension,
            );
          });
        });
      });

      describe('animated file', () => {
        describe('video formats', () => {
          const extensions = ['.mp4', '.webm', '.mkv', '.mov'];

          test.each(extensions)('should return the file\'s format for the extension %p', async extension => {
            const filePath = `path/to/text${extension}`;

            jest.spyOn(fileType, 'fromBuffer');
            jest.spyOn(getAnimatedImageMetadata, 'getAnimatedImageMetadata');

            const result = await getFileFormat(filePath);

            expect(result).toEqual({
              fileExtension: extension,
              mimeExtension: undefined,
              mimeType: undefined,
              fileType: FileType.Video,
              contentType: ContentType.Animation,
              extension,
            });
            expect(fileType.fromBuffer).not.toBeCalled();
            expect(getAnimatedImageMetadata.getAnimatedImageMetadata).not.toBeCalled();
          });
        });

        describe('image formats', () => {
          const extensions = ['.png', '.apng', '.gif', '.webp'];

          test.each(extensions)('should return the file\'s format for the extension %p', async extension => {
            const filePath = `path/to/text${extension}`;

            jest.spyOn(fileType, 'fromBuffer');
            jest.spyOn(getAnimatedImageMetadata, 'getAnimatedImageMetadata').mockResolvedValue({
              frameCount: 2,
            } as any);

            const result = await getFileFormat(filePath);

            expect(result).toEqual({
              fileExtension: extension,
              mimeExtension: undefined,
              mimeType: undefined,
              fileType: FileType.Image,
              contentType: ContentType.Animation,
              extension,
            });
            expect(fileType.fromBuffer).not.toBeCalled();
            expect(getAnimatedImageMetadata.getAnimatedImageMetadata).toBeCalledWith(
              filePath,
              extension,
            );
          });
        });
      });
    });

    describe('with buffer', () => {
      describe('text file', () => {
        const extensions = ['.txt', '.doc', '.docx', '.pdf', '.rtf', '.odt', '.odp', '.ods'];

        test.each(extensions)('should return the file\'s format for the extension %p', async extension => {
          const filePath = 'path/to/text';
          const buffer = Buffer.from('dfsiohugfgzer');
          const options: GetFileFormatOptions = {
            buffer,
          };

          jest.spyOn(fileType, 'fromBuffer').mockResolvedValue({
            ext: extension.slice(1),
            mime: 'image/',
          } as any);
          jest.spyOn(getAnimatedImageMetadata, 'getAnimatedImageMetadata');

          const result = await getFileFormat(filePath, options);

          expect(result).toEqual({
            fileExtension: undefined,
            mimeExtension: extension,
            mimeType: 'image/',
            fileType: FileType.Text,
            contentType: ContentType.Text,
            extension,
          });
          expect(fileType.fromBuffer).toBeCalledWith(buffer);
          expect(getAnimatedImageMetadata.getAnimatedImageMetadata).not.toBeCalled();
        });
      });

      describe('audio file', () => {
        const extensions = ['.mp3', '.wav', '.ogg'];

        test.each(extensions)('should return the file\'s format for the extension %p', async extension => {
          const filePath = 'path/to/text';
          const buffer = Buffer.from('dfsiohugfgzer');
          const options: GetFileFormatOptions = {
            buffer,
          };

          jest.spyOn(fileType, 'fromBuffer').mockResolvedValue({
            ext: extension.slice(1),
            mime: 'audio/',
          } as any);
          jest.spyOn(getAnimatedImageMetadata, 'getAnimatedImageMetadata');

          const result = await getFileFormat(filePath, options);

          expect(result).toEqual({
            fileExtension: undefined,
            mimeExtension: extension,
            mimeType: 'audio/',
            fileType: FileType.Audio,
            contentType: ContentType.Audio,
            extension,
          });
          expect(fileType.fromBuffer).toBeCalledWith(buffer);
          expect(getAnimatedImageMetadata.getAnimatedImageMetadata).not.toBeCalled();
        });
      });

      describe('flash file', () => {
        const extensions = ['.swf'];

        test.each(extensions)('should return the file\'s format for the extension %p', async extension => {
          const filePath = 'path/to/text';
          const buffer = Buffer.from('dfsiohugfgzer');
          const options: GetFileFormatOptions = {
            buffer,
          };

          jest.spyOn(fileType, 'fromBuffer').mockResolvedValue({
            ext: extension.slice(1),
            mime: 'flash/',
          } as any);
          jest.spyOn(getAnimatedImageMetadata, 'getAnimatedImageMetadata');

          const result = await getFileFormat(filePath, options);

          expect(result).toEqual({
            fileExtension: undefined,
            mimeExtension: extension,
            mimeType: 'flash/',
            fileType: FileType.Flash,
            contentType: ContentType.Flash,
            extension,
          });
          expect(fileType.fromBuffer).toBeCalledWith(buffer);
          expect(getAnimatedImageMetadata.getAnimatedImageMetadata).not.toBeCalled();
        });
      });

      describe('static image file', () => {
        describe('when animations are not supported', () => {
          const extensions = ['.jpeg', '.jpg', '.avif', '.bmp'];

          test.each(extensions)('should return the file\'s format for the extension %p', async extension => {
            const filePath = 'path/to/text';
            const buffer = Buffer.from('dfsiohugfgzer');
            const options: GetFileFormatOptions = {
              buffer,
            };

            jest.spyOn(fileType, 'fromBuffer').mockResolvedValue({
              ext: extension.slice(1),
              mime: 'image/',
            } as any);
            jest.spyOn(getAnimatedImageMetadata, 'getAnimatedImageMetadata');

            const result = await getFileFormat(filePath, options);

            expect(result).toEqual({
              fileExtension: undefined,
              mimeExtension: extension,
              mimeType: 'image/',
              fileType: FileType.Image,
              contentType: ContentType.StaticImage,
              extension,
            });
            expect(fileType.fromBuffer).toBeCalledWith(buffer);
            expect(getAnimatedImageMetadata.getAnimatedImageMetadata).not.toBeCalled();
          });
        });

        describe('when animations are supported', () => {
          const extensions = ['.png', '.apng', '.gif', '.webp'];

          test.each(extensions)('should return the file\'s format for the extension %p', async extension => {
            const filePath = 'path/to/text';
            const buffer = Buffer.from('dfsiohugfgzer');
            const options: GetFileFormatOptions = {
              buffer,
            };

            jest.spyOn(fileType, 'fromBuffer').mockResolvedValue({
              ext: extension.slice(1),
              mime: 'image/',
            } as any);
            jest.spyOn(getAnimatedImageMetadata, 'getAnimatedImageMetadata').mockResolvedValue({
              frameCount: 1,
            } as any);

            const result = await getFileFormat(filePath, options);

            expect(result).toEqual({
              fileExtension: undefined,
              mimeExtension: extension,
              mimeType: 'image/',
              fileType: FileType.Image,
              contentType: ContentType.StaticImage,
              extension,
            });
            expect(fileType.fromBuffer).toBeCalledWith(buffer);
            expect(getAnimatedImageMetadata.getAnimatedImageMetadata).toBeCalledWith(
              filePath,
              extension,
            );
          });
        });
      });

      describe('animated file', () => {
        describe('video formats', () => {
          const extensions = ['.mp4', '.webm', '.mkv', '.mov'];

          test.each(extensions)('should return the file\'s format for the extension %p', async extension => {
            const filePath = 'path/to/text';
            const buffer = Buffer.from('dfsiohugfgzer');
            const options: GetFileFormatOptions = {
              buffer,
            };

            jest.spyOn(fileType, 'fromBuffer').mockResolvedValue({
              ext: extension.slice(1),
              mime: 'video/',
            } as any);
            jest.spyOn(getAnimatedImageMetadata, 'getAnimatedImageMetadata');

            const result = await getFileFormat(filePath, options);

            expect(result).toEqual({
              fileExtension: undefined,
              mimeExtension: extension,
              mimeType: 'video/',
              fileType: FileType.Video,
              contentType: ContentType.Animation,
              extension,
            });
            expect(fileType.fromBuffer).toBeCalledWith(buffer);
            expect(getAnimatedImageMetadata.getAnimatedImageMetadata).not.toBeCalled();
          });
        });

        describe('image formats', () => {
          const extensions = ['.png', '.apng', '.gif', '.webp'];

          test.each(extensions)('should return the file\'s format for the extension %p', async extension => {
            const filePath = 'path/to/text';
            const buffer = Buffer.from('dfsiohugfgzer');
            const options: GetFileFormatOptions = {
              buffer,
            };

            jest.spyOn(fileType, 'fromBuffer').mockResolvedValue({
              ext: extension.slice(1),
              mime: 'image/',
            } as any);
            jest.spyOn(getAnimatedImageMetadata, 'getAnimatedImageMetadata').mockResolvedValue({
              frameCount: 2,
            } as any);

            const result = await getFileFormat(filePath, options);

            expect(result).toEqual({
              fileExtension: undefined,
              mimeExtension: extension,
              mimeType: 'image/',
              fileType: FileType.Image,
              contentType: ContentType.Animation,
              extension,
            });
            expect(fileType.fromBuffer).toBeCalledWith(buffer);
            expect(getAnimatedImageMetadata.getAnimatedImageMetadata).toBeCalledWith(
              filePath,
              extension,
            );
          });
        });
      });
    });
  });

  describe('when strict', () => {
    describe('invalid', () => {
      it('should return undefined when no extension is found', async () => {
        const filePath = '.bashrc';
        const buffer = Buffer.from('dfsiohugfgzer');
        const options: GetFileFormatOptions = {
          buffer,
          strict: true,
        };

        jest.spyOn(fileType, 'fromBuffer').mockResolvedValue(undefined);
        jest.spyOn(getAnimatedImageMetadata, 'getAnimatedImageMetadata');

        const getResult = () => getFileFormat(filePath, options);

        await expect(getResult).rejects.toThrowError();
        expect(fileType.fromBuffer).toBeCalledWith(buffer);
        expect(getAnimatedImageMetadata.getAnimatedImageMetadata).not.toBeCalled();
      });

      it('should return undefined when no file-type is found', async () => {
        const filePath = 'path/to/dragon.conf';
        const options: GetFileFormatOptions = {
          strict: true,
        };

        jest.spyOn(fileType, 'fromBuffer');
        jest.spyOn(getAnimatedImageMetadata, 'getAnimatedImageMetadata');

        const getResult = () => getFileFormat(filePath, options);

        await expect(getResult).rejects.toThrowError();
        expect(fileType.fromBuffer).not.toBeCalled();
        expect(getAnimatedImageMetadata.getAnimatedImageMetadata).not.toBeCalled();
      });

      it('should return undefined when no content-type is found', async () => {
        const filePath = 'path/to/dragon.conf';
        const options: GetFileFormatOptions = {
          strict: true,
        };

        jest.spyOn(fileType, 'fromBuffer');
        jest.spyOn(getAnimatedImageMetadata, 'getAnimatedImageMetadata');

        jest
          .spyOn(Map.prototype, 'get')
          .mockReturnValueOnce(FileType.Image)
          .mockReturnValueOnce(undefined);

        const getResult = () => getFileFormat(filePath, options);

        expect(getResult).rejects.toThrowError();
        expect(fileType.fromBuffer).not.toBeCalled();
        expect(getAnimatedImageMetadata.getAnimatedImageMetadata).not.toBeCalled();
      });
    });
  });
});
