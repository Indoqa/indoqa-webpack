const DEFAULT_OPTIONS = {
  appName: 'app',
  outputPath: './target/webpack/',
  outputPublicPath: '/',
  srcPath: './src',
  devPort: 3000,
  hotReloadPort: 3001,
  mainJs: './src/main/index.js',
}

function createOptions(userOptions) {
  return Object.assign({}, DEFAULT_OPTIONS, userOptions)
}

module.exports = exports = createOptions
