const path = require('path')
const polyfills = require.resolve('../polyfills.js')

const createEntry = (options, isDevelopment, isLibrary) => {
  const mainJsPath = path.join(process.cwd(), options.mainJs)
  const playgroundJsPath = path.join(process.cwd(), options.playgroundJs)
  const appName = options.appName

  if (isDevelopment) {
    const jsPath = options.isLibrary ? playgroundJsPath : mainJsPath
    const webpackHmr = `webpack-hot-middleware/client?path=http://localhost:${options.hotReloadPort}/__webpack_hmr`
    return {
      [appName]: [webpackHmr, polyfills, jsPath]
    }
  }

  if (isLibrary) {
    return [mainJsPath]
  }

  return {
    [appName]: [polyfills, mainJsPath]
  }
}

module.exports = exports = createEntry
