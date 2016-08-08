const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const autoprefixer = require('autoprefixer')
const path = require('path')
const webpack = require('webpack')
const polyfills = require.resolve('./polyfills')

const REACT_EXTERNALS = {
  react: 'react',
  'react-dom': 'react-dom'
}

const createOutput = (options, isDevelopment, isLibrary) => {
  if (isLibrary) {
    return {
      path: path.join(process.cwd(), options.outputLibraryPath),
      filename: `${options.appName}.min.js`,
      libraryTarget: 'umd',
      library: options.appName,
    }
  }

  if (isDevelopment) {
    return {
      path: path.join(process.cwd(), options.outputPath),
      filename: '[name].js',
      chunkFilename: '[name]-[chunkhash].js',
      publicPath: '/',
    }
  }

  return {
    path: path.join(process.cwd(), options.outputPath),
    filename: '[name]-[hash].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: options.outputPublicPath,
  }
}

const createLoaders = (options, isDevelopment) => {
  const styleLoaderMappings = {
    css: '',
    styl: '!stylus-loader',
  }

  const stylesLoaders = Object.keys(styleLoaderMappings).map(ext => {
    const prefix = 'css-loader!postcss-loader'
    const extLoaders = prefix + styleLoaderMappings[ext]
    const loader = isDevelopment
      ? `style-loader!${extLoaders}`
      : ExtractTextPlugin.extract('style-loader', extLoaders)
    return {
      loader,
      test: new RegExp(`\\.(${ext})$`),
    }
  })

  return [
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
}

const createPlugins = (options, isDevelopment, isLibrary) => {
  const definePlugin = new webpack.DefinePlugin({
    'process.env': {
      IS_BROWSER: true,
      IS_SERVERLESS: JSON.stringify(process.env.IS_SERVERLESS || false),
      NODE_ENV: JSON.stringify(isDevelopment ? 'development' : 'production'),
      SERVER_URL: JSON.stringify(process.env.SERVER_URL || ''),
    },
  })

  const hotRunPlugins = [
    new HtmlWebpackPlugin({
      title: options.appName,
      inject: true,
      template: path.join(__dirname, 'index.html'),
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]

  const extractTextProdPlugin = new ExtractTextPlugin(`${options.appName}-[hash].css`, {allChunks: true})
  const extractTextLibraryPlugin = new ExtractTextPlugin(`${options.appName}.css`, {allChunks: true})

  const compilePlugins = [
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
  ]

  if (isLibrary && !isDevelopment) {
    return [extractTextLibraryPlugin, ...compilePlugins]
  }

  if (isDevelopment) {
    return [definePlugin, ...hotRunPlugins]
  }

  return [definePlugin, extractTextProdPlugin, ...compilePlugins]
}

const createModules = (options, isDevelopment) => {
  return {
    loaders: createLoaders(options, isDevelopment),
  }
}

const createEntry = (options, isDevelopment, isLibrary) => {
  const mainJsPath = path.join(process.cwd(), options.mainJs)
  const playgroundJsPath = path.join(process.cwd(), options.playgroundJs)
  const appName = options.appName

  if (isDevelopment) {
    const jsPath = options.isLibrary ? playgroundJsPath : mainJsPath
    const webpackHmr = `webpack-hot-middleware/client?path=http://localhost:${options.hotReloadPort}/__webpack_hmr`
    return {
      [appName]: [webpackHmr, polyfills, jsPath]
    }
  }

  if (isLibrary) {
    return [mainJsPath]
  }

  return {
    [appName]: [polyfills, mainJsPath]
  }
}

const addDevelopmentOptions = (config, options, isDevelopment) => {
  if (isDevelopment) {
    const portOptions = {
      devPort: options.devPort,
      hotPort: options.hotReloadPort,
      devtool: options.devtool,
    }
    return Object.assign({}, config, portOptions)
  }
  return config
}

const addExternals = (config, options, isDevelopment, isLibrary) => {
  if (isDevelopment || !isLibrary) {
    return config
  }
  config.externals = Object.assign({}, REACT_EXTERNALS, options.externals)
  return config
}

const createAutoPrefixer = (options) => {
  return () => [autoprefixer({browsers: options.autoprefixerBrowser})]
}

const createConfig = (options) => {
  const isDevelopment = process.env.NODE_ENV !== 'production'
  const isLibrary = options.isLibrary

  let config = {
    entry: createEntry(options, isDevelopment, isLibrary),
    output: createOutput(options, isDevelopment, isLibrary),
    plugins: createPlugins(options, isDevelopment, isLibrary),
    module: createModules(options, isDevelopment),
    postcss: createAutoPrefixer(options)
  }
  config = addDevelopmentOptions(config, options, isDevelopment)
  config = addExternals(config, options, isDevelopment, isLibrary)

  return config
}

module.exports = exports = createConfig
