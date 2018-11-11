#!/usr/bin/env node
import path from 'path'
//
import validate from './../lib/build/validate'
import { buildConfig } from './../lib/build/config'
import buildApp from './../lib/build/build'
import exportApp from './../lib/build/export'
//

const currentPath = path.resolve('.')

async function build (currentPath) {
  const config = await buildConfig()
  console.log('|---- Checking Build Configuration...')
  await validate(currentPath, config)
  console.log('|---> Done!')
  console.log('|')
  console.log('|---- Building App...')
  await buildApp(currentPath, config)
  console.log('|---> Done!')
  console.log('|')
  console.log('|---- Exporting App...')
  await exportApp(currentPath, config)
  console.log('|---> Done!')
}

build(currentPath)
