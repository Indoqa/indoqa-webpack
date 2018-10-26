const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

const createResolve = (options) => {
  const plugins = []
  if (options.isTypescript) {
    plugins.push(new TsconfigPathsPlugin({
      configFile: options.tsconfigPath,
    }))
  }

  return {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    plugins,
  }
}

module.exports = createResolve
