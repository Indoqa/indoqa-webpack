const addDevelopmentOptions = (config, options, isDevelopment) => {
  if (isDevelopment) {
    const developmentOptions = {
      devPort: options.devPort,
      hotPort: options.hotReloadPort,
      devtool: options.devtool,
    }
    return Object.assign({}, config, developmentOptions)
  }
  return config
}

module.exports = exports = addDevelopmentOptions
