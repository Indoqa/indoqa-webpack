const addDevelopmentOptions = (config, options, isDevelopment) => {
  if (isDevelopment) {
    const developmentOptions = {
      devtool: options.createSourceMap ? 'cheap-module-source-map' : false,
    }
    return Object.assign({}, config, developmentOptions)
  }

  return config
}

module.exports = exports = addDevelopmentOptions
