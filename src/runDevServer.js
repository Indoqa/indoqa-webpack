/* eslint-disable no-console */
const fs = require('fs')
const path = require('path')
const WebpackDevServer = require('webpack-dev-server')
const errorOverlayMiddleware = require('react-dev-utils/errorOverlayMiddleware')
const noopServiceWorkerMiddleware = require('react-dev-utils/noopServiceWorkerMiddleware')
const webpack = require('webpack')
const chalk = require('chalk')

const VERSION = require('../package.json').version
const NAME = require('../package.json').name
const HOST = process.env.HOST || '0.0.0.0'

const createConfig = require('./createConfig.js')
const createOptions = require('./createOptions.js')

const createServerConfig = proxy => {
  return {
    compress: true,
    clientLogLevel: 'none',
    hot: true,
    publicPath: '/',
    quiet: true,
    overlay: false,
    proxy,
    before(app) {
      app.use(errorOverlayMiddleware())
      app.use(noopServiceWorkerMiddleware())
    },
  }
}

const getAppPackageJson = () => {
  const appDirectory = fs.realpathSync(process.cwd());
  const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
  return resolveApp('package.json')
}

const runDevServer = devServerConfig => {
  process.env.BABEL_ENV = 'development'
  process.env.NODE_ENV = 'development'

  process.on('unhandledRejection', err => {
    throw err
  })

  const {
    options: customOptions,
    routesCallback: customRoutesCallback,
  } = devServerConfig

  if (customRoutesCallback) {
    console.log(chalk.red(`The config value 'routesCallback' is not supported any more. Configure the proxy in package.json.`))
    process.exit(0)
  }

  const options = createOptions(customOptions)
  const config = createConfig(options)
  const compiler = webpack(config)
  const proxy = require(getAppPackageJson()).proxy;

  const devServer = new WebpackDevServer(compiler, createServerConfig(proxy))
  devServer.listen(options.devPort, HOST, err => {
    if (err) {
      return console.log(err)
    }

    console.log(
      chalk.green(`${NAME} v${VERSION} started at port ${options.devPort}.`)
    )
  })
}

module.exports = exports = runDevServer
