const ExtractTextPlugin = require('extract-text-webpack-plugin')
const autoprefixer = require('autoprefixer')

const createInlineableResourcesRule = options => {
  return {
    test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
    loader: require.resolve('url-loader'),
    options: {
      limit: 10000,
      name: 'res/' + '[name].[hash:8].[ext]',
    },
  }
}

const createJavascriptRule = isDevelopment => {
  if (isDevelopment) {
    return {
      test: /\.js$/,
      exclude: /(node_modules)/,
      use: {
        loader: 'babel-loader',
        options: {
          babelrc: false,
          presets: [require.resolve('babel-preset-react-app'), 'react-hmre'],
          compact: true,
        },
      },
    }
  }

  return {
    test: /\.js$/,
    exclude: /(node_modules)/,
    use: {
      loader: 'babel-loader',
      options: {
        babelrc: false,
        presets: [require.resolve('babel-preset-react-app')],
        cacheDirectory: true,
      },
    },
  }
}

const createStyleLoader = isDevelopment => {
  return {
    loader: require.resolve('style-loader'),
    options: {
      hmr: isDevelopment,
    },
  }
}

const createCssLoader = options => {
  return {
    loader: require.resolve('css-loader'),
    options: {
      importLoaders: 1,
      minimize: true,
      sourceMap: options.createSourceMap,
    },
  }
}

const createPostCssLoader = options => {
  return {
    loader: require.resolve('postcss-loader'),
    options: {
      // Necessary for external CSS imports to work
      // https://github.com/facebookincubator/create-react-app/issues/2677
      ident: 'postcss',
      plugins: () => [
        // require('postcss-flexbugs-fixes'),
        autoprefixer({
          browsers: options.autoprefixerBrowser,
          flexbox: 'no-2009',
        }),
      ],
      sourceMap: options.createSourceMap,
    },
  }
}

const createCssRule = (options, isDevelopment) => {
  return {
    test: /\.css$/,
    loader: ExtractTextPlugin.extract({
      fallback: createStyleLoader(isDevelopment),
      use: [createCssLoader(options), createPostCssLoader(options)],
    }),
  }
}

const createStylusRule = (options, isDevelopment) => {
  return {
    test: /\.styl$/,
    loader: ExtractTextPlugin.extract({
      fallback: createStyleLoader(isDevelopment),
      use: [
        createCssLoader(options),
        createPostCssLoader(options),
        {
          loader: require.resolve('stylus-loader'),
        },
      ],
    }),
  }
}

const createFallbackRule = options => {
  return {
    loader: require.resolve('file-loader'),
    exclude: [/\.js$/, /\.html$/, /\.json$/],
    options: {
      name: 'res/' + '[name].[hash:8].[ext]',
    },
  }
}

const createRules = (options, isDevelopment) => {
  return [
    {
      oneOf: [
        createInlineableResourcesRule(options),
        createJavascriptRule(isDevelopment),
        createCssRule(options),
        createStylusRule(options),
        createFallbackRule(options),
        // ** STOP ** Are you adding a new loader?
        // Make sure to add the new loader(s) before the "file" loader.
      ],
    },
  ]
}

module.exports = exports = createRules
