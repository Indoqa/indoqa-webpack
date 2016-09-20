const path = require('path')

const createOutput = (options, isDevelopment, isLibrary) => {
  if (isLibrary) {
    return {
      path: path.join(process.cwd(), options.outputLibraryPath),
      filename: `${options.appName}.min.js`,
      libraryTarget: 'umd',
      library: options.appName,
    }
  }

  if (isDevelopment) {
    return {
      path: path.join(process.cwd(), options.outputPath),
      filename: '[name].js',
      chunkFilename: '[name]-[chunkhash].js',
      publicPath: '/',
    }
  }

  return {
    path: path.join(process.cwd(), options.outputPath),
    filename: '[name]-[hash].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: options.outputPublicPath,
  }
}

module.exports = exports = createOutput
