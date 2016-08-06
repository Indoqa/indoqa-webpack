#! /usr/bin/env node

const path = require('path')
const createOptions = require('../src/createOptions.js')
const options = createOptions(require(path.join(process.cwd(), process.argv[2])))
const createConfig = require('../src/createConfig.js')
const build = require('../src/webpackBuild.js')
const config = createConfig(options)

build(config, options)
