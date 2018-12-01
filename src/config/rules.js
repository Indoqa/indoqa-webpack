const autoprefixer = require('autoprefixer')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const createInlineableResourcesRule = () => {
  return {
    test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
    loader: require.resolve('url-loader'),
    options: {
      limit: 10000,
      name: 'res/[name].[hash:8].[ext]',
    },
  }
}

const createJavascriptRule = (isDevelopment) => {
  if (isDevelopment) {
    return {
      test: /\.js$/,
      exclude: /(node_modules)/,
      use: {
        loader: 'babel-loader',
        options: {
          babelrc: false,
          configFile: false,
          presets: [require.resolve('babel-preset-react-app')],
          plugins: ['react-hot-loader/babel'],
          compact: true,
          cacheDirectory: true
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
        customize: require.resolve(
          'babel-preset-react-app/webpack-overrides'
        ),
      },
    },
  }
}

const createTypescriptRule = (options) => {
  if (options.tsAwesomeTypescriptLoader) {
    return {
      test: /\.tsx?$/,
      exclude: /node_modules/,
      use: {
        loader: 'awesome-typescript-loader',
        options: {
          transpileOnly: true,
          useCache: true,
        },
      },
    }
  }

  // see https://github.com/TypeStrong/ts-loader/tree/master/examples
  return {
    test: /\.tsx?$/,
    exclude: /node_modules/,
    use: [
      {
        loader: 'cache-loader'
      },
      // does not currently work with ts-loader@5.3.1 and typescript@3.2.1
      // {
      //   loader: 'thread-loader',
      //   options: {
      //     // there should be 1 cpu for the fork-ts-checker-webpack-plugin
      //     workers: require('os').cpus().length - 1,
      //   },
      // },
      {
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
          configFile: options.tsconfigPath,
        },
      }
    ],
  }
}

const createPostCssLoader = (options) => {
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
    use: [
      isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
      'css-loader',
      createPostCssLoader(options),
    ],
  }
}

const createFallbackRule = () => {
  return {
    loader: require.resolve('file-loader'),
    exclude: [/\.js$/, /\.html$/, /\.json$/],
    options: {
      name: 'res/[name].[hash:8].[ext]',
    },
  }
}

const createRules = (options, isDevelopment) => {
  return [
    {
      oneOf: [
        createInlineableResourcesRule(options),
        createJavascriptRule(isDevelopment),
        createTypescriptRule(options),
        createCssRule(options, isDevelopment),
        createFallbackRule(),
        // ** STOP ** Are you adding a new loader?
        // Make sure to add the new loader(s) before the "file" loader.
      ],
    },
  ]
}

module.exports = createRules
