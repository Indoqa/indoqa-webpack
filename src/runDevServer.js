/* eslint-disable no-console */
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const webpack = require('webpack')
const path = require('path')
const chalk = require('chalk')
const express = require('express')
const proxy = require('express-http-proxy')
const createConfig = require('./createConfig.js')
const createOptions = require('./createOptions.js')

const runDevServer = (devServerConfig) => {
  const app = express()
  const {options: customOptions, routesCallback, indexHtml: customIndexHtml} = devServerConfig
  const config = createConfig(createOptions(customOptions))
  const compiler = webpack(config)

  app.use(webpackDevMiddleware(compiler, {
    headers: {'Access-Control-Allow-Origin': '*'},
    noInfo: true,
    publicPath: config.output.publicPath
  }))

  app.use(webpackHotMiddleware(compiler))

  routesCallback({app, proxy})

  const indexHtml = customIndexHtml || path.resolve(`${__dirname}/index.html`)
  app.get('**', (req, res) => {
    res.sendFile(indexHtml)
  })

  app.listen(config.hotPort, () => {
    console.log(`Hot-server started at port ${config.hotPort}`)
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
