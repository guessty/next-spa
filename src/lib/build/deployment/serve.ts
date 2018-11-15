import { writeFileSync } from 'fs'
import * as path from 'path'
//

const getDynamicSource = (route: any) => {
  const splitRoute = route.split('/')
  return splitRoute.map((element: any) => {
    return element.includes(':') ? '**' : element
  }).join('/')
}

const getRewrites = async (routes: any, config: any, fullRewrite: boolean) => {
  const staticRewrites: any = []
  const dynamicRewrites: any = []

  if (fullRewrite) {
    routes.forEach((route: any) => {
      if (route.pattern.includes('/:')) {
        const source = getDynamicSource(route.pattern)
        dynamicRewrites.push({
          source,
          destination: `/_next-spa${route.page}/index.html`
        })
      } else {
        const source = route.pattern
        const expression = /(.html|.json)/
        const destination = expression.test(source) ? source : path.join(source, 'index.html')
        staticRewrites.push({
          source,
          destination,
        })
      
      }
    })
  } else {
    routes.forEach((route: any) => {
      if (!route.pattern.includes('/:')) {
        const source = route.pattern
        const expression = /(.html|.json)/
        const destination = expression.test(source) ? source : path.join(source, 'index.html')
        staticRewrites.push({
          source,
          destination,
        }) 
      }
    })
    const nextSPAConfig = config.nextSPA || {}
    dynamicRewrites.push({
      source: '**',
      destination: nextSPAConfig.fallback ? path.join('.', nextSPAConfig.fallback) : '/404.html',
    })
  }

  return [
    ...staticRewrites,
    ...dynamicRewrites,
  ]
}

export default async function buildServeDeploymentConfig (config: any, outdir: string, fullRewrite: boolean) {
  const routes = config.publicRuntimeConfig.routes
  const serveRewrites = await getRewrites(routes, config, fullRewrite)
  const serveJSONConfig = JSON.stringify({
    rewrites: serveRewrites
  }, null, 2)

  await writeFileSync(path.join(outdir, '/serve.json'), serveJSONConfig, 'utf8')
  console.log(`serve.json was created in ${outdir}`)
}