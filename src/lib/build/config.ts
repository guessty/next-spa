const path = require('path')
const fs = require('fs')
const requireFoolWebpack = require('require-fool-webpack')
//

const dir = path.resolve('.')

const normalizePath = (path: any) => path.replace(/\\/g, '/')

const generateDirRoutes = (dir: any, pathString:string = undefined, routes: any = []) => {
  const normalizedPath = normalizePath(dir)
  const stats = fs.statSync(normalizedPath);
  const baseName = path.basename(dir)
  if (stats.isDirectory()) {
    let nextPathString = ''
    if (pathString !== undefined) {
      nextPathString = `${pathString}/${baseName}`
    }
    const children = fs.readdirSync(normalizedPath)

    children.forEach((child: any) => {
      generateDirRoutes(path.join(dir, child), nextPathString, routes)
    })
  } else if (stats.isFile()) {
    const fileString = `${pathString}/${baseName}`
    const page = fileString.replace(/\.[^/.]+$/, '')

    if (page === '/index') {
      const route = {
        pattern: '/',
        page: '/',
      }
      routes.push(route)
    } else if (page !== '/_app' && page !== '/_document') {
      const route = {
        pattern: page.replace('/index', '').replace('/_', '/:'),
        page: page.replace('/index', ''),
      }
      routes.push(route)
    }
  }
  return routes
} 

const generateExportPathMap = async (routes: any) => {
  const allRoutes = [
    ...routes,
    { pattern: '/404.html', page: '/404' },
    { pattern: '/spa-fallback.html', page: '/spa-fallback' },
  ]
  return allRoutes.reduce((routeMap, route) => {
    routeMap[route.pattern] = { page: route.page }
    return routeMap
  }, {})
}

const withSPAFallback = async (config: any = {}) => {
  console.log(config)
  const baseNextConfig: any = {
    publicRuntimeConfig: {},
    assetPrefix: '',
    dir: './',
    distDir: './dist',
    ...config,
  }

  const routes = generateDirRoutes(path.join(baseNextConfig.dir, 'pages'))

  const exportPathMap = await generateExportPathMap(routes)

  const nextConfig = {
    ...baseNextConfig,
    distDir: path.relative(
      path.resolve(baseNextConfig.dir),
      path.resolve(path.join(baseNextConfig.distDir, 'build'))
    ),
    exportPathMap: () => exportPathMap,
    publicRuntimeConfig: {
      ...baseNextConfig.publicRuntimeConfig,
      routes,
    },
    webpack: (config:any, options:any) => {
      const coreEntry = config.entry
      const entry = async () => {
        return {
          ... await coreEntry(),
          'static/build/pages/spa-fallback.js': [ path.join(__dirname, '..', '..', 'lib/pages/spa-fallback.js') ],
          'static/build/pages/404.js': [ path.join(__dirname, '..', '..', 'lib/pages/404.js') ]
        }
      }
      config.entry = entry
      return baseNextConfig.webpack(config, options)
    },
  }

  console.log(nextConfig)

  return nextConfig
}

export const buildConfig = async () => {
  const nextConfigSource = path.join(dir, 'next.config')
  let nextConfig = {}
  try {
    nextConfig = requireFoolWebpack(nextConfigSource)
  } catch {
    console.log('Using default next.js config')
  }
  return withSPAFallback(nextConfig)
}

export default withSPAFallback
