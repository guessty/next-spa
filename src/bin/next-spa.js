#!/usr/bin/env node

const commander = require('commander')
const pkg = require('./../package.json')

commander
  .version(pkg.version)
  .description(pkg.description)
  .command('dev', 'start the development server')
  .command('build', 'build and export the project to static html')
  .parse(process.argv)
