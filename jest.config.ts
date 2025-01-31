import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  collectCoverage: true,
  moduleNameMapper: {
    '^@api$': '<rootDir>/src/utils/burger-api'
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        // Здесь можно добавить настройки для ts-jest
      }
    ]
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  roots: ['<rootDir>/src'],
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
  preset: 'ts-jest',
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  testEnvironment: 'jsdom'
};

export default config;
