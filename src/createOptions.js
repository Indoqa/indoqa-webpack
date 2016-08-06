const DEFAULT_OPTIONS = {
  appName: 'app',
  outputPath: './target/webpack/',
  outputPublicPath: '/assets/',
  srcPath: './src',
  devPort: 3000,
  hotReloadPort: 3001,
  mainJs: './src/main/index.js',
  autoprefixerBrowser: 'last 2 version',
  devtool: 'cheap-module-eval-source-map',
}

function createOptions(userOptions) {
  return Object.assign({}, DEFAULT_OPTIONS, userOptions)
}

module.exports = exports = createOptions
