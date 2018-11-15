#!/usr/bin/env node
const path = require('path')
const parseArgs = require('minimist')
//
import { loadConfig } from './../lib/build/config'
import buildServeDeploymentConfig from './../lib/build/deployment/serve'

async function generateConfig () {
  const argv = parseArgs(process.argv.slice(2), {
    alias: {
      f: 'fullrewrite',
      o: 'outdir'
    },
    boolean: ['f'],
    default: { o: null }
  })

  const dir = path.resolve(argv._[0] || '.')
  const config = loadConfig(dir)
  const outdir = argv.outdir ? path.resolve(argv.outdir) : path.resolve(dir, 'out')

  buildServeDeploymentConfig(config, outdir, argv.fullrewrite)
}

generateConfig()
