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
          presets: [require.resolve('babel-preset-react-app'), 'react-hmre'],
          plugins: [
            require.resolve('babel-plugin-transform-react-constant-elements')
          ],
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
        plugins: [
          require.resolve('babel-plugin-transform-react-constant-elements')
        ],
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
        // createCssRule(options),
        // createStylusRule(options),
        createFallbackRule(),
        // ** STOP ** Are you adding a new loader?
        // Make sure to add the new loader(s) before the "file" loader.
      ],
    },
  ]
}

module.exports = createRules
