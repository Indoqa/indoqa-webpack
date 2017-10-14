#! /usr/bin/env node

const path = require('path')
const runDevServer = require('../src/runDevServer.js')

runDevServer(require(path.join(process.cwd(), process.argv[2])))

