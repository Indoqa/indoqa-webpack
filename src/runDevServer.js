/* eslint-disable no-console */
const WebpackDevServer = require('webpack-dev-server')
const webpack = require('webpack')
const chalk = require('chalk')

const createConfig = require('./createConfig.js')
const createOptions = require('./createOptions.js')
const version = require('../package.json').version
const name = require('../package.json').name

const runDevServer = devServerConfig => {
  process.env.BABEL_ENV = 'development'
  process.env.NODE_ENV = 'development'

  // Makes the script crash on unhandled rejections instead of silently
  // ignoring them. In the future, promise rejections that are not handled will
  // terminate the Node.js process with a non-zero exit code.
  process.on('unhandledRejection', err => {
    throw err
  })

  const {
    options: customOptions,
    routesCallback: customRoutesCallback,
  } = devServerConfig
  const options = createOptions(customOptions)
  const config = createConfig(options)
  const compiler = webpack(config)

  const HOST = process.env.HOST || '0.0.0.0'

  const devServer = new WebpackDevServer(compiler, serverConfig)
  // Launch WebpackDevServer.
  devServer
    .listen(options.devPort, HOST, err => {
      if (err) {
        return console.log(err)
      }

      console.log(chalk.green(`${name} v${version} started a dev-server at port ${options.devPort}.`))
    })
    [('SIGINT', 'SIGTERM')].forEach(function(sig) {
      process.on(sig, function() {
        devServer.close()
        process.exit()
      })
    })

  /*
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
    proxyReqPathResolver: () => '/',
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
  })*/
}

module.exports = exports = runDevServer
