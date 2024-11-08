/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest';
import nextJest from 'next/jest';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

const config: Config = {
  // Map module paths to align with TypeScript paths
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1', // Matches the alias used in tsconfig.json
  },
  testEnvironment: 'jsdom',
  coverageProvider: 'v8',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  // You can add other Jest configurations here as needed
};

export default createJestConfig(config);
