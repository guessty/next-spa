const path = require('path')
const fs = require('fs')
const findUp = require('find-up')
const parseArgs = require('minimist')
const requireFoolWebpack = require('require-fool-webpack')
//

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
    } else if (page === '/404' || page === '/404/index') {
      const route = {
        pattern: '/404.html',
        page: '/404',
      }
      routes.push(route)
    } else if (page !== '/_app' && page !== '/_document' && page !== '/_error' && page !== '/soft-404') {
      const route = {
        pattern: page.replace('/index', '').replace('/_', '/:'),
        page: page.replace('/index', ''),
      }
      routes.push(route)
    }
  }
  return routes
} 

const generateExportPathMap = (routes: any, nextSPAConfig: any) => {
  const allRoutes = [
    { pattern: '/404.html', page: '/404' },
    ...routes,
    ...nextSPAConfig.fallback
      ? [{ pattern: `/${nextSPAConfig.fallback}`, page: 'soft-404' }]
      : [{ pattern: '/404.html', page: '/soft-404' }] ,
  ]
  
  return allRoutes.reduce((routeMap, route) => {
    const pattern = route.pattern.includes('/:') ? `/_next-spa${route.pattern}`: route.pattern
    routeMap[pattern] = { page: route.page }

    return routeMap
  }, {})
}

const withSPA = (config: any = {}) => {
  const argv = parseArgs(process.argv.slice(2), {
    alias: {
      h: 'help'
    },
    boolean: ['h']
  })

  const argvPath = argv._[0] || '.'

  const baseNextConfig: any = {
    publicRuntimeConfig: {},
    assetPrefix: '',
    webpack: (config: any) => config,
    ...config,
    distDir: config.distDir && config.distDir !== '.' && config.distDir !== './'
      ? config.distDir : './.next',
  }

  const nextSPAConfig = config.nextSPA || {}

  let pagesDir = path.join(path.resolve(argvPath), 'pages')
  if (argvPath === config.distDir) {
    const buildId = fs.readFileSync(`${argvPath}/BUILD_ID`, 'utf8')
    pagesDir = path.join(path.resolve(argvPath), `static/${buildId}/pages`)
  }
  const routes = generateDirRoutes(pagesDir)

  const exportPathMap = generateExportPathMap(routes, nextSPAConfig)

  const nextConfig = {
    ...baseNextConfig,
    distDir: path.relative(path.resolve(argvPath), path.resolve(baseNextConfig.distDir)),
    exportPathMap: () => exportPathMap,
    publicRuntimeConfig: {
      ...baseNextConfig.publicRuntimeConfig,
      routes,
    },
    generateBuildId: async () => {
      return 'build'
    },
    webpack: async (config:any, options:any) => {
      const coreEntry = config.entry
      const entry = async () => {
        return {
          ... await coreEntry(),
          'static/build/pages/404.js': [ path.join(__dirname, '..', '..', 'lib/pages/404.js') ],
          'static/build/pages/soft-404.js': [ path.join(__dirname, '..', '..', 'lib/pages/soft-404.js') ]
        }
      }
      config.entry = entry
      return baseNextConfig.webpack(config, options)
    },
  }

  return nextConfig
}

export const loadConfig = (dir: string, dev: boolean = false) => {
  const nextConfigSource: string = findUp.sync('next.config.js', {
    cwd: dir
  })

  let nextConfig = {}

  if (nextConfigSource && nextConfigSource.length) {
    try {
      nextConfig = dev ? requireFoolWebpack(nextConfigSource) : require(`${nextConfigSource}`)
    } catch {
      console.log('Using default next.js config')
    }
  }

  return nextConfig
}

export default withSPA
