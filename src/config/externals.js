const REACT_EXTERNALS = {
  react: 'react',
  'react-dom': 'react-dom',
}

const addExternals = (config, options, isDevelopment, isLibrary) => {
  if (isDevelopment || !isLibrary) {
    return config
  }
  config.externals = Object.assign({}, REACT_EXTERNALS, options.externals)
  return config
}

module.exports = addExternals
