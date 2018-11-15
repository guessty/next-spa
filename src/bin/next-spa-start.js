#!/usr/bin/env node
const path = require('path')
const parseArgs = require('minimist')
//
import server from './../lib/server'

async function start () {
  const argv = parseArgs(process.argv.slice(2), {
    alias: {
      h: 'help',
      H: 'hostname',
      p: 'port'
    },
    boolean: ['h'],
    string: ['H'],
    default: { p: 3000 }
  })
  const dir = path.resolve(argv._[0] || '.')
  server({ dir }, argv.port, argv.hostname)
}

start()
