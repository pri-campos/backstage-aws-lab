const baseConfig = require('@backstage/cli/config/jest');

module.exports = {
  ...baseConfig,
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest'],
  },
  testMatch: [
    '<rootDir>/src/**/?(*.)+(spec|test).(ts|tsx|js|jsx)',
    '<rootDir>/conformance-tests/**/?(*.)+(spec|test).(ts|tsx|js|jsx)',
  ],
};
