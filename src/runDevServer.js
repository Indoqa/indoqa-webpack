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
  const app = express()
  const {options: customOptions, routesCallback} = devServerConfig
  const options = createOptions(customOptions)
  const config = createConfig(options)
  const compiler = webpack(config)

  app.use(webpackDevMiddleware(compiler, {
    headers: {'Access-Control-Allow-Origin': '*'},
    noInfo: true,
    publicPath: '/',
  }))

  app.use(webpackHotMiddleware(compiler))

  if (typeof(routesCallback) === 'function') {
    routesCallback({app, proxy})
  }

  app.listen(config.hotPort, () => {
    console.log(`${name} v${version} started a hot-server at port ${config.hotPort}`)
  })

  app.listen(config.devPort, (error) => {
    if (error) {
      console.error(error)
    } else {
      console.info(chalk.green(`Listening on port ${config.devPort}.`)
      )
    }
  })
}

module.exports = exports = runDevServer
