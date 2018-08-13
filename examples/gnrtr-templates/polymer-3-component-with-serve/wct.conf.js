module.exports = {
  suites: [
    'test',
  ],
  expanded: true,
  plugins: {
    local: {
      browsers: [
        'chrome',
        'firefox',
      ],
      browserOptions: {
        chrome: [
          'headless',
          'disable-gpu',
          'no-sandbox',
        ],
        firefox: [
          '-headless',
        ],
      },
    },
    istanbul: {
      reporters: [
        'text',
        'text-summary',
        'lcov',
        'json',
      ],
      include: [
        '**/*.js',
      ],
      exclude: [],
      thresholds: {
        global: {
          statements: 80,
          branches: 80,
          functions: 80,
          lines: 80,
        },
      },
    },
  },
};
