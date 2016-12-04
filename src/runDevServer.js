/* eslint-disable no-console */
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const webpack = require('webpack')
const chalk = require('chalk')
const express = require('express')
const proxy = require('express-http-proxy')
const createConfig = require('./createConfig.js')
const createOptions = require('./createOptions.js')
const version = require('../package.json').version
const name = require('../package.json').name

const runDevServer = (devServerConfig) => {
  const {options: customOptions, routesCallback: customRoutesCallback} = devServerConfig
  const options = createOptions(customOptions)
  const config = createConfig(options)
  const compiler = webpack(config)

  const app = express()

  app.use(webpackDevMiddleware(compiler, {
    headers: {'Access-Control-Allow-Origin': '*'},
    noInfo: true,
    publicPath: '/',
  }))

  app.use(webpackHotMiddleware(compiler))

  if (typeof customRoutesCallback === 'function') {
    customRoutesCallback({app, proxy})
  }

  app.use('*', proxy(`http://localhost:${options.devPort}`, {
    forwardPath: () => '/'
  }))

  app.listen(options.hotReloadPort, () => {
    console.log(`${name} v${version} started a hot-server at port ${options.hotReloadPort}`)
  })

  app.listen(options.devPort, (error) => {
    if (error) {
      console.error(error)
    } else {
      console.info(chalk.green(`Listening on port ${options.devPort}.`)
      )
    }
  })
}

module.exports = exports = runDevServer
