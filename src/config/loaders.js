const ExtractTextPlugin = require('extract-text-webpack-plugin')
const path = require('path')

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
            // see https://github.com/thejameskyle/babel-react-optimize
            plugins: options.babelLoaderProdPlugins,
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
      test: /favicon\.ico$/,
      loader: 'url-loader?limit=1',
    },
    ...stylesLoaders,
  ]
}

module.exports = exports = createLoaders
