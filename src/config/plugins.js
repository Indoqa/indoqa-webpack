const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

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

  if (isLibrary && !isDevelopment) {
    return [
      definePlugin,
      ...compilePlugins,
      ignoreMomentJsLocaleResourcesPlugin,
    ]
  }

  if (isDevelopment) {
    return [
      definePlugin,
      createIndexHTMLPlugin,
      new webpack.NamedModulesPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      ignoreMomentJsLocaleResourcesPlugin,
    ]
  }

  if (options.createIndexHtml) {
    return [
      definePlugin,
      createIndexHTMLPlugin,
      ...compilePlugins,
    ]
  }

  return [
    definePlugin,
    ...compilePlugins,
  ]
}

module.exports = createPlugins
