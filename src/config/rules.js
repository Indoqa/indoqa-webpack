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
      },
    },
  }
}

const createTypescriptRule = (options) => {
  return {
    test: /\.tsx?$/,
    exclude: /node_modules/,
    use: {
      loader: 'ts-loader',
      options: {
        transpileOnly: true,
        configFile: options.tsconfigPath,
      },
    },
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
