const DEFAULT_OPTIONS = {
  appName: 'app',

  outputPath: './target/assets/',
  outputPublicPath: '/',
  srcPath: './src',
  mainJs: './src/main/index.js',
  playgroundJs: './src/playground/index.js',

  devPort: 3000,
  hotReloadPort: 3001,
  devtool: 'cheap-eval-source-map',
  uglify: true,
  createSourceMap: true,
  createIndexHtml: false,
  // babelLoaderProdPlugins: [
  //   'transform-react-constant-elements',
  //   // 'transform-react-inline-elements',
  //   // 'transform-react-remove-prop-types',
  //   // 'transform-react-pure-class-to-function',
  // ],
  autoprefixerBrowser: ['>1%', 'last 4 versions', 'Firefox ESR', 'not ie < 11'],

  isLibrary: false,
  outputLibraryPath: './dist/',
}

const createOptions = (userOptions) => {
  userOptions.isLibrary = userOptions.isLibrary || userOptions.isReactLibrary
  return Object.assign({}, DEFAULT_OPTIONS, userOptions)
}

module.exports = exports = createOptions
