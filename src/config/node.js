const NODE = {
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
}

const addNode = (config, options, isDevelopment) => {
  if (isDevelopment) {
    return config
  }
  return Object.assign({}, config, NODE)
}

module.exports = addNode
