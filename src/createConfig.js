const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const createOutput = require('./config/output.js')
const createLoaders = require('./config/loaders.js')
const createPlugins = require('./config/plugins.js')
const createEntry = require('./config/entry.js')
const createPostCSS = require('./config/postcss.js')
const addExternals = require('./config/externals.js')
const addDevelopmentOptions = require('./config/developmentOptions.js')

const createConfig = (options) => {
  const isDevelopment = process.env.NODE_ENV !== 'production'
  const isLibrary = options.isLibrary
  const shouldUseSourceMap = true

  const config = {
    entry: createEntry(options, isDevelopment, isLibrary),
    output: createOutput(options, isDevelopment, isLibrary),
    devtool: 'source-map',
    module: {
      rules: [{
        oneOf: [
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve('url-loader'),
            options: {
              limit: 10000,
              name: options.outputPath + '[name].[hash:8].[ext]',
            },
          },
          {
            test: /\.js$/,
            exclude: /(node_modules)/,
            use: {
              loader: 'babel-loader',
              options: {
                babelrc: false,
                presets: [require.resolve('babel-preset-react-app')],
                compact: true
              }
            }
          },
          {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract(
              Object.assign(
                {
                  fallback: {
                    loader: require.resolve('style-loader'),
                    options: {
                      hmr: false,
                    },
                  },
                  use: [
                    {
                      loader: require.resolve('css-loader'),
                      options: {
                        importLoaders: 1,
                        minimize: true,
                        sourceMap: shouldUseSourceMap,
                      },
                    },
                    {
                      loader: require.resolve('postcss-loader'),
                      options: {
                        // Necessary for external CSS imports to work
                        // https://github.com/facebookincubator/create-react-app/issues/2677
                        ident: 'postcss',
                        plugins: () => [
                          require('postcss-flexbugs-fixes'),
                          autoprefixer({
                            browsers: [
                              '>1%',
                              'last 4 versions',
                              'Firefox ESR',
                              'not ie < 11',
                            ],
                            flexbox: 'no-2009',
                          }),
                        ],
                      },
                    }
                  ]
                },
                {}
              )
            ),
          },
          {
            loader: require.resolve('file-loader'),
            exclude: [/\.js$/, /\.html$/, /\.json$/],
            options: {
              name: options.outputPath + '[name].[hash:8].[ext]',
            },
          },
          // ** STOP ** Are you adding a new loader?
          // Make sure to add the new loader(s) before the "file" loader.
        ]
      }]
    },
    plugins: [
      new UglifyJSPlugin({
        sourceMap: shouldUseSourceMap,
        parallel: true,
        cache: true,
        uglifyOptions: {
          output: {
            comments: false,
            ascii_only: true
          }
        }
      })
    ]
  }
  console.log('config=', JSON.stringify(config, null, 2))
  return config
}

const createConfig1 = (options) => {
  const isDevelopment = process.env.NODE_ENV !== 'production'
  const isLibrary = options.isLibrary

  let config = {
    entry: createEntry(options, isDevelopment, isLibrary),
    output: createOutput(options, isDevelopment, isLibrary),
    plugins: createPlugins(options, isDevelopment, isLibrary),
    module: {
      loaders: createLoaders(options, isDevelopment),
    },
    postcss: createPostCSS(options),
  }
  config = addDevelopmentOptions(config, options, isDevelopment)
  config = addExternals(config, options, isDevelopment, isLibrary)

  return config
}

module.exports = exports = createConfig
