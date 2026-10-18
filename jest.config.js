export default {
  testEnvironment: 'node',
  transform: {},
  extensionsToTreatAsEsm: [],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testMatch: ['**/server/tests/**/*.test.js'],
  collectCoverageFrom: [
    'server/modules/**/*.js',
  ],
};
