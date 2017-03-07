// see https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/scripts/utils/createJestConfig.js
module.exports = (resolve) => {
  const config = {
    collectCoverageFrom: ['src/**/*.{js,jsx}'],
    setupFiles: [resolve('src/polyfills.js')],
    testPathIgnorePatterns: [
      '<rootDir>[/\\\\](build|docs|node_modules|node|scripts)[/\\\\]'
    ],
    coverageDirectory: '<rootDir>/target/coverage-jest',
    testEnvironment: 'node',
    testURL: 'http://localhost',
    transform: {
      '^.+\\.(js|jsx)$': resolve('src/jest/babelTransform.js'),
      '^.+\\.css$': resolve('src/jest/cssTransform.js'),
      '^(?!.*\\.(js|jsx|css|json)$)': resolve('src/jest/fileTransform.js'),
    },
    transformIgnorePatterns: [
      '[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'
    ]
  }
  return config
}
