import path from 'node:path';

import { config } from 'dotenv';
import env from 'env-var';

config({
  path: path.join(__dirname, '../.env'),
});

export default {
  database: {
    uri: env.get('DATABASE.URI').required().asUrlString(),
  },

  furaffinity: {
    cookieA: env.get('FURAFFINITY.COOKIE_A').required().asString(),
    cookieB: env.get('FURAFFINITY.COOKIE_B').required().asString(),
  },

  scraper: {
    throttle: {
      min: env.get('SCRAPER.THROTTLE.MIN').required().asIntPositive(),
      max: env.get('SCRAPER.THROTTLE.MAX').required().asIntPositive(),
    },
  },

  processing: {
    tempDir: env.get('PROCESSING.TEMP_DIR').required().asString(),
    submissionDir: env.get('PROCESSING.SUBMISSION_DIR').required().asString(),
    submissionSampleDir: env.get('PROCESSING.SUBMISSION_SAMPLE_DIR').required().asString(),
    previewDir: env.get('PROCESSING.PREVIEW_DIR').required().asString(),
    hashLength: env.get('PROCESSING.HASH_LENGTH').required().asIntPositive(),
    similarityThreshold: env.get('PROCESSING.SIMILARITY_THRESHOLD').required().asIntPositive(),

    image: {
      resize: {
        width: '70%' as const,
        maxHeight: 800,
        maxWidth: 1800,
        minHeight: 300,
        minWidth: 500,
      },
    },

    preview: {
      resize: {
        height: 150,
        maxHeight: 150,
        maxWidth: 300,
      },

      jpeg: {
        quality: 40,
        progressive: true,
      },

      webp: {
        quality: 40,
      },

      avif: {
        quality: 30,
      },
    },
  },
};
