module.exports = {
  verbose: true,
  testEnvironment: 'node',
  coverageDirectory: './coverage',
  collectCoverage: true,
  coveragePathIgnorePatterns: [
    '<rootDir>/examples'
  ],
  coverageReporters: [
    'lcov',
    'text',
    'text-summary'
  ],
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85
    }
  }
};
