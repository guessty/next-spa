#!/usr/bin/env node
const path = require('path')
const parseArgs = require('minimist')
//
import { loadConfig } from './../lib/build/config'

async function generateConfig () {
  const argv = parseArgs(process.argv.slice(2), {
    alias: {
      t: 'type',
    },
    string: ['t'],
    default: { t: 'type' }
  })
  const dir = path.resolve(argv._[0] || '.')
  const config = loadConfig(dir)

  
  
}

generateConfig()
