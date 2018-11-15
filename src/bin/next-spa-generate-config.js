#!/usr/bin/env node
const path = require('path')
const parseArgs = require('minimist')
//
import { loadConfig } from './../lib/build/config'

async function generateConfig () {
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
  const config = loadConfig(dir)

  
  
}

generateConfig()
