const DEFAULT_OPTIONS = {
  appName: 'app',

  outputPath: './target/webpack/',
  outputPublicPath: '/',
  srcPath: './src',
  mainJs: './src/main/index.js',
  playgroundJs: './src/playground/index.js',

  devPort: 3000,
  hotReloadPort: 3001,
  devtool: 'cheap-module-eval-source-map',
  createIndexHtml: false,
  babelLoaderProdPlugins: [
    'transform-react-constant-elements',
    // 'transform-react-inline-elements',
    // 'transform-react-remove-prop-types',
    // 'transform-react-pure-class-to-function',
  ],
  autoprefixerBrowser: 'last 2 version',

  isLibrary: false,
  outputLibraryPath: './dist/'
}

const createOptions = (userOptions) => {
  userOptions.isLibrary = userOptions.isLibrary || userOptions.isReactLibrary
  return Object.assign({}, DEFAULT_OPTIONS, userOptions)
}

module.exports = exports = createOptions
