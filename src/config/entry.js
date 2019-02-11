const path = require('path')

const createEntry = (options, isDevelopment, isLibrary) => {
  const mainJsPath = path.join(process.cwd(), options.mainJs)
  const playgroundJsPath = path.join(process.cwd(), options.playgroundJs)
  const appName = options.appName

  if (isDevelopment) {
    const jsPath = options.isLibrary ? playgroundJsPath : mainJsPath
    const webpackHmr = require.resolve('react-dev-utils/webpackHotDevClient')
    return {
      [appName]: [webpackHmr, jsPath],
    }
  }

  if (isLibrary) {
    return [mainJsPath]
  }

  return {
    [appName]: [mainJsPath],
  }
}

module.exports = exports = createEntry
