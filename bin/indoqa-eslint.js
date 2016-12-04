#! /usr/bin/env node

const spawn = require('cross-spawn')

const args = process.argv.slice(2)

const result = spawn.sync(
  'node',
  ['./node_modules/eslint/bin/eslint.js'].concat(args),
  {stdio: 'inherit'}
)

process.exit(result.status)
