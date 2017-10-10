const createOutput = require('./config/output.js')
const createLoaders = require('./config/loaders.js')
const createPlugins = require('./config/plugins.js')
const createEntry = require('./config/entry.js')
const createPostCSS = require('./config/postcss.js')
const addExternals = require('./config/externals.js')
const addDevelopmentOptions = require('./config/developmentOptions.js')

const createConfig = (options) => {
  const isDevelopment = process.env.NODE_ENV !== 'production'
  const isLibrary = options.isLibrary
  const config = {
    entry: createEntry(options, isDevelopment, isLibrary),
    output: createOutput(options, isDevelopment, isLibrary)
  }
  return config
}

const createConfig1 = (options) => {
  const isDevelopment = process.env.NODE_ENV !== 'production'
  const isLibrary = options.isLibrary

  let config = {
    entry: createEntry(options, isDevelopment, isLibrary),
    output: createOutput(options, isDevelopment, isLibrary),
    plugins: createPlugins(options, isDevelopment, isLibrary),
    module: {
      loaders: createLoaders(options, isDevelopment),
    },
    postcss: createPostCSS(options),
  }
  config = addDevelopmentOptions(config, options, isDevelopment)
  config = addExternals(config, options, isDevelopment, isLibrary)

  return config
}

module.exports = exports = createConfig
