const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const createPlugins = (options, isDevelopment, isLibrary) => {
  console.log('options', options)
  const definePlugin = new webpack.DefinePlugin({
    'process.env': {
      IS_BROWSER: true,
      IS_SERVERLESS: JSON.stringify(process.env.IS_SERVERLESS || false),
      NODE_ENV: JSON.stringify(isDevelopment ? 'development' : 'production'),
      SERVER_URL: JSON.stringify(process.env.SERVER_URL || ''),
    },
  })

  const createIndexHTMLPlugin = new HtmlWebpackPlugin({
    title: options.appName,
    inject: true,
    template: path.join(__dirname, 'index.html'),
  })

  const hotRunPlugins = [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]

  const extractTextProdPlugin = new ExtractTextPlugin(`${options.appName}-[hash].css`, {allChunks: true})
  const extractTextLibraryPlugin = new ExtractTextPlugin(`${options.appName}.css`, {allChunks: true})

  const compilePlugins = [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(),
  ]

  if (options.uglify) {
    compilePlugins.push(
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          screw_ie8: true,
          warnings: false,
        },
        mangle: {
          screw_ie8: true,
        },
        output: {
          comments: false,
          screw_ie8: true,
        },
      })
    )
  }

  if (options.createSourceMap) {
    compilePlugins.push(
      new webpack.SourceMapDevToolPlugin({
        filename: '[file].map',
      })
    )
  }

  if (isLibrary && !isDevelopment) {
    return [extractTextLibraryPlugin, ...compilePlugins]
  }

  if (isDevelopment) {
    return [definePlugin, createIndexHTMLPlugin, ...hotRunPlugins]
  }

  if (options.createIndexHtml) {
    return [definePlugin, extractTextProdPlugin, createIndexHTMLPlugin, ...compilePlugins]
  }

  return [definePlugin, extractTextProdPlugin, ...compilePlugins]
}

module.exports = exports = createPlugins
