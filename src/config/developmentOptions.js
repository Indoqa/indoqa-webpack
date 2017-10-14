const addDevelopmentOptions = (config, options, isDevelopment) => {
  if (isDevelopment) {
    const developmentOptions = {
      devtool: options.createSourceMap ? 'cheap-module-source-map' : false,
    }
    return Object.assign({}, config, developmentOptions)
  }

  const prodOptions = {
    devtool: options.createSourceMap ? 'source-map' : false,
  }

  return Object.assign({}, config, prodOptions)
}

module.exports = exports = addDevelopmentOptions
