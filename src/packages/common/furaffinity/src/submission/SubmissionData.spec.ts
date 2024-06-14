import {
  ISubmission,
  Rating as FurAffinityRating,
  Category as FurAffinityCategory,
  Gender as FurAffinityGender,
  Species as FurAffinitySpecies,
} from 'furaffinity-api';
import { DateTime } from 'luxon';

import { convertSubmission } from './SubmissionData';
import { Category, Gender, Rating, Species } from './enums';

describe('convertSubmission', () => {
  it('should return the submission converted', () => {
    const data: ISubmission = {
      id: '69',
      url: 'https://furaffinity.net/view/69',
      downloadUrl: 'https://d.furaffinity.net/69',
      previewUrl: 'https://t.furraffinity.net/69',
      title: 'Nice dragon',
      posted: 694054541245,
      rating: FurAffinityRating.Adult,
      keywords: ['dragon', 'rawr'],
      author: {
        id: 'zougui',
        name: 'Zougui',
        url: 'https://furaffinity.net/user/zougui',
        avatar: 'https://a.furaffinity.net/user/zougui',
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

    const result = convertSubmission(data);

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
  });

  it('should turn all the URLs to HTTPS if they are in HTTP', () => {
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

    const result = convertSubmission(data);

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
  });

  it('should return undefined for the URL that are not defined', () => {
    const data: ISubmission = {
      id: '69',
      url: 'http://furaffinity.net/view/69',
      downloadUrl: 'http://d.furaffinity.net/69',
      previewUrl: undefined,
      title: 'Nice dragon',
      posted: 694054541245,
      rating: FurAffinityRating.Adult,
      keywords: ['dragon', 'rawr'],
      author: {
        id: 'zougui',
        name: 'Zougui',
        url: 'http://furaffinity.net/user/zougui',
        avatar: undefined,
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

    const result = convertSubmission(data);

    expect(result).toEqual({
      id: 69,
      url: 'https://furaffinity.net/view/69',
      downloadUrl: 'https://d.furaffinity.net/69',
      previewUrl: undefined,
      title: 'Nice dragon',
      postedDate: DateTime.fromMillis(data.posted),
      rating: Rating.Adult,
      keywords: ['dragon', 'rawr'],
      author: {
        id: 'zougui',
        name: 'Zougui',
        url: 'https://furaffinity.net/user/zougui',
        avatar: undefined,
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
  });

  it('should return a default value for the properties of type enum when they are not defined in their respective enum', () => {
    const data: ISubmission = {
      id: '69',
      url: 'http://furaffinity.net/view/69',
      downloadUrl: 'http://d.furaffinity.net/69',
      previewUrl: undefined,
      title: 'Nice dragon',
      posted: 694054541245,
      rating: 'unknown rating' as any,
      keywords: ['dragon', 'rawr'],
      author: {
        id: 'zougui',
        name: 'Zougui',
        url: 'http://furaffinity.net/user/zougui',
        avatar: undefined,
        shinies: false,
      },
      description: 'Dragons are superior',
      content: {
        category: 'unknown category' as any,
        species: 'unknown species' as any,
        gender: 'unknown gender' as any,
      },
      stats: {
        favorites: 96,
        comments: 83,
        views: 64,
      },
    };

    const result = convertSubmission(data);

    expect(result).toEqual({
      id: 69,
      url: 'https://furaffinity.net/view/69',
      downloadUrl: 'https://d.furaffinity.net/69',
      previewUrl: undefined,
      title: 'Nice dragon',
      postedDate: DateTime.fromMillis(data.posted),
      rating: Rating.Any,
      keywords: ['dragon', 'rawr'],
      author: {
        id: 'zougui',
        name: 'Zougui',
        url: 'https://furaffinity.net/user/zougui',
        avatar: undefined,
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
        category: Category.Other,
        species: Species['Unspecified / Any'],
        gender: Gender['Other / Not Specified'],
      },
      stats: {
        favoriteCount: 96,
        commentCount: 83,
        viewCount: 64,
      },
    });
  });
});
