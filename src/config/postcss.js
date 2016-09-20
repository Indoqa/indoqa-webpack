const autoprefixer = require('autoprefixer')

const createPostCSS = (options) => {
  return () => [autoprefixer({browsers: options.autoprefixerBrowser})]
}

module.exports = exports = createPostCSS
