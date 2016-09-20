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

module.exports = exports = addDevelopmentOptions
