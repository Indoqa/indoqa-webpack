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

const createJavascriptRuleProd = () => {
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

const createJavascriptRuleDev = () => {
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

const createStyleLoader = () => {
  return {
    loader: require.resolve('style-loader'),
    options: {
      hmr: false,
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
        require('postcss-flexbugs-fixes'),
        autoprefixer({
          browsers: options.autoprefixerBrowser,
          flexbox: 'no-2009',
        }),
      ],
    },
  }
}

const createCssRule = options => {
  return {
    test: /\.css$/,
    loader: ExtractTextPlugin.extract(
      Object.assign(
        {
          fallback: createStyleLoader(),
          use: [createCssLoader(options), createPostCssLoader(options)],
        },
        {}
      )
    ),
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
        isDevelopment ? createJavascriptRuleDev() : createJavascriptRuleProd(),
        createCssRule(options),
        createFallbackRule(options),
        // ** STOP ** Are you adding a new loader?
        // Make sure to add the new loader(s) before the "file" loader.
      ],
    },
  ]
}

module.exports = exports = createRules
