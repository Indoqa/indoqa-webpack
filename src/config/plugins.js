const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

const createPlugins = (options, isDevelopment, isLibrary) => {
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
    new webpack.HotModuleReplacementPlugin()
  ]

  const extractTextProdPlugin = new ExtractTextPlugin(`${options.appName}-[hash].css`, {allChunks: true})
  const extractTextLibraryPlugin = new ExtractTextPlugin(`${options.appName}.css`, {allChunks: true})

  const compilePlugins = []

  if (options.uglify) {
    compilePlugins.push(
      new UglifyJSPlugin({
        sourceMap: options.createSourceMap,
        parallel: true,
        cache: true,
        uglifyOptions: {
          output: {
            comments: false,
            ascii_only: true,
          },
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
