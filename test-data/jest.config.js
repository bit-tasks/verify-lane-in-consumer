module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest', // Transpile JavaScript/TypeScript and JSX files using Babel
  },
  transformIgnorePatterns: [
    'node_modules/(?!@learnbit-react)', // Ignore all node_modules EXCEPT @learnbit-react
  ],
  moduleNameMapper: {
    '\\.(scss|css)$': 'identity-obj-proxy', // Mock SCSS/CSS files
    '^.+\\.svg$': '<rootDir>/svgTransform.js',
  },
  resolver: null, // Use Jest's default resolver
};
