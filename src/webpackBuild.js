/* eslint-disable no-console  */
process.env.NODE_ENV = 'production'

const chalk = require('chalk')
const fs = require('fs')
const path = require('path')
const filesize = require('filesize')
const gzipSize = require('gzip-size').sync
const webpack = require('webpack')
const stripAnsi = require('strip-ansi')

function printFileSizes(buildDir, stats) {
  const assets = stats.toJson().assets
    .filter(asset => /\.(js|css)$/.test(asset.name))
    .map(asset => {
      const fileContents = fs.readFileSync(`${buildDir}/${asset.name}`)
      const size = gzipSize(fileContents)
      return {
        folder: path.join(buildDir, path.dirname(asset.name)),
        name: path.basename(asset.name),
        size,
        sizeLabel: filesize(size)
      }
    })
  assets.sort((a, b) => b.size - a.size)
  const longestSizeLabelLength = Math.max.apply(null,
    assets.map(a => stripAnsi(a.sizeLabel).length)
  )
  assets.forEach(asset => {
    let sizeLabel = asset.sizeLabel
    const sizeLength = stripAnsi(sizeLabel).length
    if (sizeLength < longestSizeLabelLength) {
      const rightPadding = ' '.repeat(longestSizeLabelLength - sizeLength)
      sizeLabel += rightPadding
    }
    console.log(`  ${sizeLabel}  ${chalk.dim(asset.folder + path.sep)}${chalk.cyan(asset.name)}`)
  })
}

function build(config, options) {
  console.log('Creating an optimized production build...')

  webpack(config).run((err, stats) => {
    if (err) {
      console.error('Failed to create a production build. Reason:')
      console.error(err.message || err)
      process.exit(1)
    }

    console.log(chalk.green('Compiled successfully.'))
    console.log()

    console.log('File sizes:')
    console.log()
    printFileSizes(options.outputPath, stats)
    console.log()
  })
}

module.exports = build
