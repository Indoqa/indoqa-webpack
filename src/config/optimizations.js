const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const OPTIMIZATIONS = {
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          parse: {
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
          },
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
          },
        },
        parallel: true,
        cache: true,
        sourceMap: true,
      }),
    ],
    splitChunks: {
      chunks: 'all',
      name: 'vendors',
    },
    runtimeChunk: true,
  },
}

const addOptimizations = (config, options, isDevelopment) => {
  if (isDevelopment) {
    return config
  }
  return Object.assign({}, config, OPTIMIZATIONS)
}

module.exports = addOptimizations
