const path = require('path')
const chalk = require('chalk')

const DEFAULT_OPTIONS = {
  appName: 'app',

  outputPath: './target/webpack/assets/',
  outputPublicPath: '/assets/',
  srcPath: './src',
  entry: './src/main/index.js',
  playgroundEntry: './src/playground/index.js',

  devPort: 3000,
  uglify: true,
  createSourceMap: true,
  createIndexHtml: true,
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

  if (options.hasOwnProperty('mainJs')) {
    console.log(chalk.red('The property mainJs was replaced by entry. Please change it.'))
  }
  
  if (options.hasOwnProperty('playgroundJs')) {
    console.log(chalk.red('The property playgroundJs was replaced by playgroundEntry. Please change it.'))
  }
}

const createOptions = (userOptions) => {
  userOptions.isLibrary = userOptions.isLibrary || userOptions.isReactLibrary
  userOptions.tsconfigPath = path.join(process.cwd(), 'tsconfig.json')
  userOptions.tslintPath = path.join(process.cwd(), 'tslint.json')
  userOptions.srcPath = path.join(process.cwd(), 'src')
  const options = Object.assign({}, DEFAULT_OPTIONS, userOptions)

  validate(options)

  return options
}

module.exports = createOptions
