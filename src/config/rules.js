const ExtractTextPlugin = require('extract-text-webpack-plugin')

const createInlineableResourcesRule = options => {
  return {
    test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
    loader: require.resolve('url-loader'),
    options: {
      limit: 10000,
      name: options.outputPath + '[name].[hash:8].[ext]',
    },
  }
}

const createJavascriptRule = () => {
  return {
    test: /\.js$/,
    exclude: /(node_modules)/,
    use: {
      loader: 'babel-loader',
      options: {
        babelrc: false,
        presets: [require.resolve('babel-preset-react-app')],
        compact: true,
      },
    },
  }
}

const createCssRule = options => {
  return {
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
                sourceMap: options.createSourceMap,
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
            },
          ],
        },
        {}
      )
    )
  }
}

const createFallbackRule = options => {
  return {
    loader: require.resolve('file-loader'),
    exclude: [/\.js$/, /\.html$/, /\.json$/],
    options: {
      name: options.outputPath + '[name].[hash:8].[ext]',
    },
  }
}

const createRules = (options, isDevelopment) => {
  return [
    {
      oneOf: [
        createInlineableResourcesRule(options),
        createJavascriptRule(),
        createCssRule(options),
        createFallbackRule(options),
        // ** STOP ** Are you adding a new loader?
        // Make sure to add the new loader(s) before the "file" loader.
      ],
    },
  ]
}

module.exports = exports = createRules
