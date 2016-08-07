const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const autoprefixer = require('autoprefixer')
const path = require('path')
const webpack = require('webpack')

function createConfig(options) {
  const isDevelopment = process.env.NODE_ENV !== 'production'

  const loaders = {
    css: '',
    styl: '!stylus-loader',
  }
  const stylesLoaders = Object.keys(loaders).map(ext => {
    const prefix = 'css-loader!postcss-loader'
    const extLoaders = prefix + loaders[ext]
    const loader = isDevelopment
      ? `style-loader!${extLoaders}`
      : ExtractTextPlugin.extract('style-loader', extLoaders)
    return {
      loader,
      test: new RegExp(`\\.(${ext})$`),
    }
  })

  return {
    devPort: options.devPort,
    hotPort: options.hotReloadPort,
    devtool: isDevelopment ? options.devtool : '',
    entry: {
      [options.appName]: isDevelopment ? [
        `webpack-hot-middleware/client?path=http://localhost:${options.hotReloadPort}/__webpack_hmr`,
        path.join(process.cwd(), options.mainJs)
      ] : [
        path.join(process.cwd(), options.mainJs)
      ]
    },
    output: {
      path: path.join(process.cwd(), options.outputPath),
      filename: isDevelopment ? '[name].js' : '[name]-[hash].js',
      chunkFilename: '[name]-[chunkhash].js',
      publicPath: isDevelopment ? '/' : options.outputPublicPath,
    },
    plugins: (() => {
      const plugins = [new webpack.DefinePlugin({
        'process.env': {
          IS_BROWSER: true, // Because webpack is used only for browser code.
          IS_SERVERLESS: JSON.stringify(process.env.IS_SERVERLESS || false),
          NODE_ENV: JSON.stringify(isDevelopment ? 'development' : 'production'),
          SERVER_URL: JSON.stringify(process.env.SERVER_URL || ''),
        },
      })]

      if (isDevelopment) {
        plugins.push(
          new HtmlWebpackPlugin({
            title: options.appName,
            inject: true,
            template: path.join(__dirname, 'index.html'),
          }),
          new webpack.optimize.OccurenceOrderPlugin(),
          new webpack.HotModuleReplacementPlugin())
      } else {
        plugins.push(
          new ExtractTextPlugin(`${options.appName}-[hash].css`, {
            allChunks: true,
          }),
          new webpack.optimize.DedupePlugin(),
          new webpack.optimize.OccurrenceOrderPlugin(),
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
          }),
          new webpack.SourceMapDevToolPlugin({
            filename: '[file].map',
          })
        )
      }
      return plugins
    })(),
    module: {
      loaders: [
        {
          test: /\.js$/,
          loader: 'babel',
          exclude: /node_modules/,
          include: path.join(process.cwd(), options.srcPath),
          query: {
            babelrc: false,
            cacheDirectory: true,
            presets: ['es2015', 'react', 'stage-1'],
            env: {
              development: {
                presets: ['react-hmre'],
              },
              production: {
                plugins: [
                  'transform-react-constant-elements',
                ],
              },
            },
          },
        }, {
          test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'url?limit=10000&mimetype=application/font-woff'
        }, {
          test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'url?limit=10000&mimetype=application/font-woff'
        }, {
          test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'url?limit=10000&mimetype=application/octet-stream'
        }, {
          test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'url?limit=10000&mimetype=application/octet-stream'
        }, {
          test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'url?limit=10000&mimetype=image/svg+xml'
        }, {
          test: /\.(gif|jpg|png)$/,
          loader: 'url-loader?limit=10000',
        }, {
          loader: 'url-loader?limit=1',
          test: /favicon\.ico$/
        },
        ...stylesLoaders,
      ]
    },
    postcss: () => [autoprefixer({browsers: options.autoprefixerBrowser})]
  }
}

module.exports = exports = createConfig
