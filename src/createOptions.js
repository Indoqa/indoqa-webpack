const path = require('path')
const chalk = require('chalk')

const DEFAULT_OPTIONS = {
  appName: 'app',

  outputPath: './target/assets/',
  outputPublicPath: '/assets/',
  srcPath: './src',
  mainJs: './src/main/index.js',
  playgroundJs: './src/playground/index.js',

  devPort: 3000,
  uglify: true,
  createSourceMap: true,
  createIndexHtml: false,
  autoprefixerBrowser: ['>1%', 'last 4 versions', 'Firefox ESR', 'not ie < 11'],

  isLibrary: false,
  outputLibraryPath: './dist/',
}

const validate = options => {
  if (options.hasOwnProperty('hotReloadPort')) {
    console.log(chalk.red('The property hotReloadPort is not needed any more. Please remove it.'))
  }

  if (options.hasOwnProperty('devtool')) {
    console.log(chalk.red('The property devtool is not supported any longer. Please remove it.'))
  }

  if (options.hasOwnProperty('babelLoaderProdPlugins')) {
    console.log(chalk.red('The property babelLoaderProdPlugins is not supported any longer. Please remove it.'))
  }
}

const createOptions = (userOptions) => {
  userOptions.isLibrary = userOptions.isLibrary || userOptions.isReactLibrary
  userOptions.tsconfigPath = path.join(process.cwd(), 'tsconfig.json')
  const options = Object.assign({}, DEFAULT_OPTIONS, userOptions)

  validate(options)

  return options
}

module.exports = createOptions
