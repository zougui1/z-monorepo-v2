import { downloadSubmission } from './downloadSubmission';
import * as downloadSubmissionFile from './downloadSubmissionFile';
import * as downloadPreviewFile from './downloadPreviewFile';
import * as findDuplicate from './findDuplicate';
import { FuraffinitySubmission, Submission } from '../../../database';
import { Source, ContentType } from '../../../enums';

describe('downloadSubmission', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('not found as duplicate', () => {
    it('should download the submission file with a preview image', async () => {
      const submission: FuraffinitySubmission.Object = {
        _id: 'ojshwrfgfvysd',
        id: '69',
        url: 'https://furaffinity.net/view/69',
        downloadUrl: 'https://d.furaffinity.net/69kfdshfjeqs.png',
        previewUrl: 'https://t.furaffinity.net/lldfsjgjhsd.png',
        rating: 'General',
        keywords: ['dragon', 'sexy'],
        author: {
          _id: 'jsdehngsehges',
          id: 'zougui',
          name: 'Zougui',
          profileUrl: 'https://furaffinity.net/user/zougui',
          source: 'furaffinity',
        },
        content: {
          category: 'Artwork (Digital)',
          gender: 'Male',
          species: 'Western Dragon',
        },
        description: {
          type: 'root',
          text: 'grez',
        },
        postedDate: new Date(41574457),
        stats: {
          commentCount: 45,
          favoriteCount: 485,
          viewCount: 41475,
        },
        status: 'downloading',
        title: 'Dragons are sexy',
      };

      jest.spyOn(downloadSubmissionFile, 'downloadSubmissionFile').mockResolvedValue({
        original: {
          path: 'path/to/file.png',
          hash: 'ouxhdfvusdghh_u',
          size: 69420,
          width: 4253,
          height: 1244,
        },
        sample: {
          webp: {
            path: 'path/to/sample/file.webp',
            size: 1456,
            width: 1247,
            height: 324,
          },
          avif: {
            path: 'path/to/sample/file.avif',
            size: 856,
            width: 1247,
            height: 324,
          },
        },
      });
      jest.spyOn(downloadPreviewFile, 'downloadPreviewFile').mockResolvedValue({
        original: {
          path: 'path/to/preview.png',
          size: 6920,
          width: 154,
          height: 102,
        },
        sample: {
          webp: {
            path: 'path/to/sample/preview.webp',
            size: 4501,
            width: 150,
            height: 100,
          },
          avif: {
            path: 'path/to/sample/preview.avif',
            size: 1452,
            width: 150,
            height: 100,
          },
        },
      });
      jest.spyOn(findDuplicate, 'findDuplicate').mockResolvedValue(undefined);

      const result = await downloadSubmission(submission);

      expect(result).toEqual({
        status: FuraffinitySubmission.Status.Success,
        post: {
          id: submission.id,
          url: submission.url + '/',
          downloadUrl: submission.downloadUrl,
          title: submission.title,
          source: Source.Furaffinity,
          postedDate: submission.postedDate,
          rating: Submission.Rating.SFW,
          tags: [
            ...submission.keywords,
            submission.content.category,
            submission.content.gender,
            submission.content.species,
          ],
          author: submission.author,
          description: submission.description.text,
          file: {
            type: ContentType.StaticImage,
            original: {
              path: 'path/to/file.png',
              name: 'file.png',
              hash: 'ouxhdfvusdghh_u',
              size: 69420,
              width: 4253,
              height: 1244,
            },
            samples: [
              {
                path: 'path/to/sample/file.webp',
                name: 'file.webp',
                size: 1456,
                width: 1247,
                height: 324,
              },
              {
                path: 'path/to/sample/file.avif',
                name: 'file.avif',
                size: 856,
                width: 1247,
                height: 324,
              },
            ],
          },
          preview: {
            original: {
              path: 'path/to/preview.png',
              name: 'preview.png',
              size: 6920,
              width: 154,
              height: 102,
            },
            samples: [
              {
                path: 'path/to/sample/preview.webp',
                name: 'preview.webp',
                size: 4501,
                width: 150,
                height: 100,
              },
              {
                path: 'path/to/sample/preview.avif',
                name: 'preview.avif',
                size: 1452,
                width: 150,
                height: 100,
              },
            ],
          },
        },
      });

      expect(downloadSubmissionFile.downloadSubmissionFile).toBeCalledWith(submission.downloadUrl);
      expect(downloadPreviewFile.downloadPreviewFile).toBeCalledWith(submission.previewUrl);
      expect(findDuplicate.findDuplicate).toBeCalledWith('path/to/file.png', 'ouxhdfvusdghh_u');
    });

    it('should download the submission file without a preview image', async () => {
      const submission: FuraffinitySubmission.Object = {
        _id: 'ojshwrfgfvysd',
        id: '69',
        url: 'https://furaffinity.net/view/69',
        downloadUrl: 'https://d.furaffinity.net/69kfdshfjeqs.docx',
        rating: 'Any',
        keywords: ['dragon', 'sexy'],
        author: {
          _id: 'jsdehngsehges',
          id: 'zougui',
          name: 'Zougui',
          profileUrl: 'https://furaffinity.net/user/zougui',
          source: 'furaffinity',
        },
        content: {
          category: 'Story',
          gender: 'Male',
          species: 'Western Dragon',
        },
        description: {
          type: 'root',
          text: 'grez',
        },
        postedDate: new Date(41574457),
        stats: {
          commentCount: 45,
          favoriteCount: 485,
          viewCount: 41475,
        },
        status: 'downloading',
        title: 'Dragons are sexy',
      };

      jest.spyOn(downloadSubmissionFile, 'downloadSubmissionFile').mockResolvedValue({
        original: {
          path: 'path/to/file.docx',
          size: 69420,
          width: 4253,
          height: 1244,
        },
      });
      jest.spyOn(downloadPreviewFile, 'downloadPreviewFile').mockResolvedValue({} as any);
      jest.spyOn(findDuplicate, 'findDuplicate').mockResolvedValue(undefined);

      const result = await downloadSubmission(submission);

      expect(result).toEqual({
        status: FuraffinitySubmission.Status.Success,
        post: {
          id: submission.id,
          url: submission.url + '/',
          downloadUrl: submission.downloadUrl,
          title: submission.title,
          source: Source.Furaffinity,
          postedDate: submission.postedDate,
          rating: Submission.Rating.SFW,
          tags: [
            ...submission.keywords,
            submission.content.category,
            submission.content.gender,
            submission.content.species,
          ],
          author: submission.author,
          description: submission.description.text,
          file: {
            type: ContentType.Text,
            original: {
              path: 'path/to/file.docx',
              name: 'file.docx',
              size: 69420,
              width: 4253,
              height: 1244,
            },
            samples:  [],
          },
          preview: undefined,
        },
      });

      expect(downloadSubmissionFile.downloadSubmissionFile).toBeCalledWith(submission.downloadUrl);
      expect(downloadPreviewFile.downloadPreviewFile).not.toBeCalled();
      expect(findDuplicate.findDuplicate).not.toBeCalled();
    });
  });

  describe('found as duplicate', () => {
    it('should download the submission file with a preview image', async () => {
      const submission: FuraffinitySubmission.Object = {
        _id: 'ojshwrfgfvysd',
        id: '69',
        url: 'https://furaffinity.net/view/69',
        downloadUrl: 'https://d.furaffinity.net/69kfdshfjeqs.png',
        previewUrl: 'https://t.furaffinity.net/lldfsjgjhsd.png',
        rating: 'Adult',
        keywords: ['dragon', 'sexy'],
        author: {
          _id: 'jsdehngsehges',
          id: 'zougui',
          name: 'Zougui',
          profileUrl: 'https://furaffinity.net/user/zougui',
          source: 'furaffinity',
        },
        content: {
          category: 'Artwork (Digital)',
          gender: 'Male',
          species: 'Western Dragon',
        },
        description: {
          type: 'root',
          text: 'grez',
        },
        postedDate: new Date(41574457),
        stats: {
          commentCount: 45,
          favoriteCount: 485,
          viewCount: 41475,
        },
        status: 'downloading',
        title: 'Dragons are sexy',
      };

      jest.spyOn(downloadSubmissionFile, 'downloadSubmissionFile').mockResolvedValue({
        original: {
          path: 'path/to/file.png',
          hash: 'ouxhdfvusdghh_u',
          size: 69420,
          width: 4253,
          height: 1244,
        },
        sample: {
          webp: {
            path: 'path/to/sample/file.webp',
            size: 1456,
            width: 1247,
            height: 324,
          },
          avif: {
            path: 'path/to/sample/file.avif',
            size: 856,
            width: 1247,
            height: 324,
          },
        },
      });
      jest.spyOn(downloadPreviewFile, 'downloadPreviewFile').mockResolvedValue({
        original: {
          path: 'path/to/preview.png',
          size: 6920,
          width: 154,
          height: 102,
        },
        sample: {
          webp: {
            path: 'path/to/sample/preview.webp',
            size: 4501,
            width: 150,
            height: 100,
          },
          avif: {
            path: 'path/to/sample/preview.avif',
            size: 1452,
            width: 150,
            height: 100,
          },
        },
      });
      jest.spyOn(findDuplicate, 'findDuplicate').mockResolvedValue({
        _id: 'ufsdigh',
        id: '42',
      });

      const result = await downloadSubmission(submission);

      expect(result).toEqual({
        status: FuraffinitySubmission.Status.Duplicate,
        post: {
          id: submission.id,
          url: submission.url + '/',
          downloadUrl: submission.downloadUrl,
          title: submission.title,
          source: Source.Furaffinity,
          postedDate: submission.postedDate,
          rating: Submission.Rating.NSFW,
          tags: [
            ...submission.keywords,
            submission.content.category,
            submission.content.gender,
            submission.content.species,
          ],
          author: submission.author,
          description: submission.description.text,
          file: {
            type: ContentType.StaticImage,
            original: {
              path: 'path/to/file.png',
              name: 'file.png',
              hash: 'ouxhdfvusdghh_u',
              size: 69420,
              width: 4253,
              height: 1244,
            },
            samples: [
              {
                path: 'path/to/sample/file.webp',
                name: 'file.webp',
                size: 1456,
                width: 1247,
                height: 324,
              },
              {
                path: 'path/to/sample/file.avif',
                name: 'file.avif',
                size: 856,
                width: 1247,
                height: 324,
              },
            ],
          },
          preview: {
            original: {
              path: 'path/to/preview.png',
              name: 'preview.png',
              size: 6920,
              width: 154,
              height: 102,
            },
            samples: [
              {
                path: 'path/to/sample/preview.webp',
                name: 'preview.webp',
                size: 4501,
                width: 150,
                height: 100,
              },
              {
                path: 'path/to/sample/preview.avif',
                name: 'preview.avif',
                size: 1452,
                width: 150,
                height: 100,
              },
            ],
          },
        },
        duplicate: {
          _id: 'ufsdigh',
          id: '42',
        },
      });
    });
  });
});
