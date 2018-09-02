const fs = require('fs')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

const createResolve = (options) => {
  const plugins = []
  if (fs.existsSync(options.tsconfigPath)) {
    plugins.push(new TsconfigPathsPlugin({
      configFile: options.tsconfigPath,
    }))
  }

  return {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    plugins,
  }
}

module.exports = exports = createResolve
