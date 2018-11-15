import getConfig from 'next/config'
const path = require('path')
const parseArgs = require('minimist')

import buildRoutes from './routes'
import { loadConfig } from './config'

export default (opts: any) => {
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
  const config: any = loadConfig(dir)

  const conf = {
    ...config,
    ...opts.dev ? { distDir: path.relative(dir, path.resolve('./tmp/.next')) } : {}
  }

  const Server = opts.dev
    ? require('next/dist/server/next-dev-server').default
    : require('next/dist/server/next-server').default

  const ServerInstance = new Server({ ...opts, dir, conf, })

  const { publicRuntimeConfig = { routes: [] } } = getConfig() || {};
  const { routes } = publicRuntimeConfig
  const Routes = buildRoutes(routes)
  const handler = Routes.getRequestHandler(ServerInstance)

  ServerInstance.getRequestHandler = () => handler

  return ServerInstance
}
