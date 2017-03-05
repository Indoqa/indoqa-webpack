#! /usr/bin/env node
const jest = require('jest')
const path = require('path')
const createJestConfig = require('../src/jest/createJestConfig.js')

const argv = process.argv.slice(2)
argv.push('--config', JSON.stringify(createJestConfig(
  (relativePath) => path.resolve(__dirname, '..', relativePath)
)))

jest.run(argv)
