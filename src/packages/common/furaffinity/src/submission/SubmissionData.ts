import {
  ISubmission,
  Rating as FurAffinityRating,
  Category as FurAffinityCategory,
  Gender as FurAffinityGender,
  Species as FurAffinitySpecies,
} from 'furaffinity-api';
import { DateTime } from 'luxon';

import { secureHttpProtocol } from '@zougui/common.url-utils';

import { Category, Gender, Rating, Species } from './enums';
import { parseDescription, DescriptionTree } from './description';

export const convertSubmission = (submission: ISubmission): SubmissionData => {
  const rating = Rating[FurAffinityRating[submission.rating] as keyof typeof Rating];
  const category = Category[FurAffinityCategory[submission.content.category] as keyof typeof Category];
  const species = Species[FurAffinitySpecies[submission.content.species] as keyof typeof Species];
  const gender = Gender[FurAffinityGender[submission.content.gender] as keyof typeof Gender];

  return {
    id: Number(submission.id),
    url: secureHttpProtocol(submission.url),
    downloadUrl: secureHttpProtocol(submission.downloadUrl),
    previewUrl: submission.previewUrl && secureHttpProtocol(submission.previewUrl),
    title: submission.title,
    postedDate: DateTime.fromMillis(submission.posted),
    rating: rating || Rating.Any,
    keywords: submission.keywords,
    author: {
      id: submission.author.id,
      name: submission.author.name,
      url: secureHttpProtocol(submission.author.url),
      avatar: submission.author.avatar && secureHttpProtocol(submission.author.avatar),
      shinies: submission.author.shinies,
    },
    description: parseDescription(submission.description),
    content: {
      category: category || Category.Other,
      species: species || Species['Unspecified / Any'],
      gender: gender || Gender['Other / Not Specified'],
    },
    stats: {
      // `Number` is required because those properties have the type
      // 'Number' instead of 'number'
      favoriteCount: Number(submission.stats.favorites),
      commentCount: Number(submission.stats.comments),
      viewCount: Number(submission.stats.views),
    },
  };
}

export interface SubmissionData {
  id: number;
  url: string;
  downloadUrl: string;
  previewUrl?: string;
  title: string;
  postedDate: DateTime;
  rating: Rating;
  keywords: string[];
  author: {
    id: string;
    name: string;
    url: string;
    avatar?: string;
    shinies?: boolean;
  };
  description: DescriptionTree;
  content: {
    category: Category;
    species: Species;
    gender: Gender;
  };
  stats: {
    favoriteCount: number;
    commentCount: number;
    viewCount: number;
  };
}
