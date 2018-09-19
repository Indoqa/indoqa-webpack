const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ManifestPlugin = require('webpack-manifest-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

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

  const compilePlugins = []
  if (options.createSourceMap) {
    compilePlugins.push(
      new webpack.SourceMapDevToolPlugin({
        filename: '[file].map',
      })
    )
  }

  const ignoreMomentJsLocaleResourcesPlugin = new webpack.IgnorePlugin(
    /^\.\/locale$/,
    /moment$/
  )
  compilePlugins.push(ignoreMomentJsLocaleResourcesPlugin)

  const extractCssPlugin = new MiniCssExtractPlugin({
    filename: isDevelopment ? '[name].css' : `${options.appName}-[hash].css`,
    chunkFilename: isDevelopment ? '[id].css' : `${options.appName}-[id]-[hash].css`,
  })

  const manifestPlugin = new ManifestPlugin({
    fileName: 'asset-manifest.json',
    publicPath: options.outputPublicPath,
  })
  compilePlugins.push(manifestPlugin)

  if
  (isLibrary && !isDevelopment) {
    return [
      definePlugin,
      extractCssPlugin,
      ...compilePlugins
    ]
  }

  if (isDevelopment) {
    return [
      definePlugin,
      extractCssPlugin,
      createIndexHTMLPlugin,
      new webpack.NamedModulesPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      ignoreMomentJsLocaleResourcesPlugin,
      manifestPlugin
    ]
  }

  if (options.createIndexHtml) {
    return [
      definePlugin,
      extractCssPlugin,
      createIndexHTMLPlugin,
      ...compilePlugins,
    ]
  }

  return [
    definePlugin,
    extractCssPlugin,
    ...compilePlugins,
  ]
}

module.exports = createPlugins
