const addDevelopmentOptions = (config, options, isDevelopment) => {
  if (isDevelopment) {
    const developmentOptions = {
      devtool: options.createSourceMap ? 'source-map' : false,
    }
    return Object.assign({}, config, developmentOptions)
  }

  return config
}

module.exports = addDevelopmentOptions
