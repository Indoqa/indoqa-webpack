const path = require('path')

const polyfills = require.resolve('../polyfills.js')

const createEntry = (options, isDevelopment, isLibrary) => {
  const entryPath = path.join(process.cwd(), options.entry)
  const playgroundEntryPath = path.join(process.cwd(), options.playgroundEntry)
  const appName = options.appName

  if (isDevelopment) {
    const jsPath = options.isLibrary ? playgroundEntryPath : entryPath
    const webpackHmr = require.resolve('react-dev-utils/webpackHotDevClient')
    return {
      [appName]: [webpackHmr, polyfills, jsPath],
    }
  }

  if (isLibrary) {
    return [entryPath]
  }

  return {
    [appName]: [polyfills, entryPath],
  }
}

module.exports = createEntry
