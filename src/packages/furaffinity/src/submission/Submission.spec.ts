import {
  ISubmission,
  Rating as FurAffinityRating,
  Category as FurAffinityCategory,
  Gender as FurAffinityGender,
  Species as FurAffinitySpecies,
} from 'furaffinity-api';
import { DateTime } from 'luxon';

import { Submission } from './Submission';
import * as query from './Query';
import { Category, Gender, Rating, Species } from './enums';
import * as account from '../Account';

describe('Submission', () => {
  const cookieA = '1445454124';
  const cookieB = '415';

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('browse', () => {
    it('should log in before browsing', async () => {
      const mockLogin = jest.fn().mockImplementation(async () => {});
      jest.spyOn(account, 'Account').mockImplementation((): any => {
        return {
          login: mockLogin,
        };
      });

      const mockBrowse = jest.fn().mockImplementation(async () => {});
      jest.spyOn(query, 'Query').mockImplementation((): any => {
        return {
          browse: mockBrowse,
        };
      });

      const options: query.BrowseOptions = {
        page: 69,
      };

      const submission = new Submission({ cookieA, cookieB });
      await submission.browse(options);

      expect(mockLogin).toBeCalledTimes(1);
      expect(mockBrowse).toBeCalledTimes(1);
      expect(mockBrowse).toBeCalledWith(options);
    });
  });

  describe('search', () => {
    it('should log in before searching', async () => {
      const mockLogin = jest.fn().mockImplementation(async () => {});
      jest.spyOn(account, 'Account').mockImplementation((): any => {
        return {
          login: mockLogin,
        };
      });

      const mockSearch = jest.fn().mockImplementation(async () => {});
      jest.spyOn(query, 'Query').mockImplementation((): any => {
        return {
          search: mockSearch,
        };
      });

      const queryString = 'dragon';
      const options: query.SearchOptions = {
        page: 69,
      };

      const submission = new Submission({ cookieA, cookieB });
      await submission.search(queryString, options);

      expect(mockLogin).toBeCalledTimes(1);
      expect(mockSearch).toBeCalledTimes(1);
      expect(mockSearch).toBeCalledWith(queryString, options);
    });
  });

  describe('findOne', () => {
    it('should log in before finding a submission by a string ID', async () => {
      const mockLogin = jest.fn().mockImplementation(async () => {});
      jest.spyOn(account, 'Account').mockImplementation((): any => {
        return {
          login: mockLogin,
        };
      });

      const mockFindById = jest.fn().mockImplementation(async () => {});
      jest.spyOn(query, 'Query').mockImplementation((): any => {
        return {
          findById: mockFindById,
        };
      });

      const id = '69';

      const submission = new Submission({ cookieA, cookieB });
      const result = await submission.findOne(id);

      expect(result).toBeUndefined();
      expect(mockLogin).toBeCalledTimes(1);
      expect(mockFindById).toBeCalledTimes(1);
      expect(mockFindById).toBeCalledWith(id);
    });

    it('should log in before finding a submission by a number ID', async () => {
      const mockLogin = jest.fn().mockImplementation(async () => {});
      jest.spyOn(account, 'Account').mockImplementation((): any => {
        return {
          login: mockLogin,
        };
      });

      const mockFindById = jest.fn().mockImplementation(async () => {});
      jest.spyOn(query, 'Query').mockImplementation((): any => {
        return {
          findById: mockFindById,
        };
      });

      const id = 69;

      const submission = new Submission({ cookieA, cookieB });
      const result = await submission.findOne(id);

      expect(result).toBeUndefined();
      expect(mockLogin).toBeCalledTimes(1);
      expect(mockFindById).toBeCalledTimes(1);
      expect(mockFindById).toBeCalledWith(String(id));
    });

    it('should log in before finding a submission by an ID extracted from the URL', async () => {
      const mockLogin = jest.fn().mockImplementation(async () => {});
      jest.spyOn(account, 'Account').mockImplementation((): any => {
        return {
          login: mockLogin,
        };
      });

      const mockFindById = jest.fn().mockImplementation(async () => {});
      jest.spyOn(query, 'Query').mockImplementation((): any => {
        return {
          findById: mockFindById,
        };
      });

      const url = 'https://furaffinity.net/view/69';

      const submission = new Submission({ cookieA, cookieB });
      const result = await submission.findOne(url);

      expect(result).toBeUndefined();
      expect(mockLogin).toBeCalledTimes(1);
      expect(mockFindById).toBeCalledTimes(1);
      expect(mockFindById).toBeCalledWith('69');
    });

    it('should return a reformatted submission when found', async () => {
      const data: ISubmission = {
        id: '69',
        url: 'http://furaffinity.net/view/69',
        downloadUrl: 'http://d.furaffinity.net/69',
        previewUrl: 'http://t.furraffinity.net/69',
        title: 'Nice dragon',
        posted: 694054541245,
        rating: FurAffinityRating.Adult,
        keywords: ['dragon', 'rawr'],
        author: {
          id: 'zougui',
          name: 'Zougui',
          url: 'http://furaffinity.net/user/zougui',
          avatar: 'http://a.furaffinity.net/user/zougui',
          shinies: false,
        },
        description: 'Dragons are superior',
        content: {
          category: FurAffinityCategory['Artwork (Digital)'],
          species: FurAffinitySpecies['Western Dragon'],
          gender: FurAffinityGender.Male,
        },
        stats: {
          favorites: 96,
          comments: 83,
          views: 64,
        },
      };

      const mockLogin = jest.fn().mockImplementation(async () => {});
      jest.spyOn(account, 'Account').mockImplementation((): any => {
        return {
          login: mockLogin,
        };
      });

      const mockFindById = jest.fn().mockImplementation(async () => data);
      jest.spyOn(query, 'Query').mockImplementation((): any => {
        return {
          findById: mockFindById,
        };
      });

      const url = 'https://furaffinity.net/view/69';

      const submission = new Submission({ cookieA, cookieB });
      const result = await submission.findOne(url);

      expect(result).toEqual({
        id: 69,
        url: 'https://furaffinity.net/view/69',
        downloadUrl: 'https://d.furaffinity.net/69',
        previewUrl: 'https://t.furraffinity.net/69',
        title: 'Nice dragon',
        postedDate: DateTime.fromMillis(data.posted),
        rating: Rating.Adult,
        keywords: ['dragon', 'rawr'],
        author: {
          id: 'zougui',
          name: 'Zougui',
          url: 'https://furaffinity.net/user/zougui',
          avatar: 'https://a.furaffinity.net/user/zougui',
          shinies: false,
        },
        description: {
          type: 'root',
          textAlign: 'left',
          text: 'Dragons are superior',
          children: [
            {
              type: 'text',
              text: 'Dragons are superior',
            },
          ],
        },
        content: {
          category: Category['Artwork (Digital)'],
          species: Species['Western Dragon'],
          gender: Gender.Male,
        },
        stats: {
          favoriteCount: 96,
          commentCount: 83,
          viewCount: 64,
        },
      });
      expect(mockLogin).toBeCalledTimes(1);
      expect(mockFindById).toBeCalledTimes(1);
      expect(mockFindById).toBeCalledWith('69');
    });
  });
});
