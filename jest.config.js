/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  rootDir: 'src',
  coverageThreshold: {
    'global': {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  coverageDirectory: '../coverage',
  collectCoverageFrom: [
    '<rootDir>/packages/*/src/**/*.ts',
    '!<rootDir>/packages/*/src/**/index.ts',
    '!<rootDir>/packages/*/src/**/*.d.ts',

    '<rootDir>/projects/*/*/*/src/**/*.ts',
    '!<rootDir>/projects/*/*/*/src/**/index.ts',
    '!<rootDir>/projects/*/*/*/src/**/*.d.ts',
  ],
  projects: [
    {
      preset: 'ts-jest',
      testEnvironment: 'node',
      rootDir: 'src',
      testMatch: [
        '<rootDir>/packages/*/src/**/*.spec.ts',
        '<rootDir>/projects/*/*/*/src/**/*.spec.ts',
      ],
    },
  ],
};
