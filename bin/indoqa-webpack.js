#! /usr/bin/env node

const path = require('path')
const build = require('../src/webpackBuild.js')

build(require(path.join(process.cwd(), process.argv[2])))
