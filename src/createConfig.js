const createOutput = require('./config/output.js')
const createPlugins = require('./config/plugins.js')
const createRules = require('./config/rules.js')
const createEntry = require('./config/entry.js')
const addExternals = require('./config/externals.js')
const addDevelopmentOptions = require('./config/developmentOptions.js')

const createConfig = options => {
  const isDevelopment = process.env.NODE_ENV !== 'production'
  const isLibrary = options.isLibrary

  let config = {
    mode: isDevelopment ? "development" : "production",
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx']
    },
    entry: createEntry(options, isDevelopment, isLibrary),
    output: createOutput(options, isDevelopment, isLibrary),
    module: {
      rules: createRules(options, isDevelopment),
    },
    plugins: createPlugins(options, isDevelopment, isLibrary),
  }

  config = addExternals(config, options, isDevelopment, isLibrary)
  config = addDevelopmentOptions(config, options, isDevelopment)

  // console.log('config=', JSON.stringify(config, null, 2))
  return config
}

module.exports = exports = createConfig
