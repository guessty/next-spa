#!/usr/bin/env node

const commander = require('commander')
const pkg = require('./../package.json')

commander
  .version(pkg.version)
  .description(pkg.description)
  .command('dev', 'start the development server')
  .command('start', 'start the production server')
  .command('generate-config', 'generate deployment config for serve.js/Now.sh')
  .parse(process.argv)
