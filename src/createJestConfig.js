// see https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/scripts/utils/createJestConfig.js
module.exports = (resolve) => {
  const config = {
    collectCoverageFrom: ['src/**/*.{js,jsx}'],
    setupFiles: [resolve('src/polyfills.js')],
    testPathIgnorePatterns: [
      '<rootDir>[/\\\\](build|docs|node_modules|node|scripts)[/\\\\]'
    ],
    testEnvironment: 'node',
    testURL: 'http://localhost',
    transform: {
      '^.+\\.(js|jsx)$': '<rootDir>/node_modules/babel-jest'
    },
    transformIgnorePatterns: [
      '[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'
    ]
  }
  return config
}
