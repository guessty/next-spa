import { writeFileSync } from 'fs'
import * as path from 'path'
//

const getDynamicSource = (route: any) => {
  const splitRoute = route.split('/')
  return splitRoute.map((element: any) => {
    return element.includes(':') ? '**' : element
  }).join('/')
}


const getRewrites = async (routes: any, config: any) => {
  const nextSPAConfig = config.nextSPA || {}

  const staticRewrites = routes.filter((route: any) =>
    !route.pattern.includes('/:')).map((route: any) => {
      const source = route.pattern
      return {
        source,
        destination: `${route.page === '/' ? '/index.html' : `${route.page}.html`}`,
      }
    })
  
  const dynamicRewrites = routes.filter((route: any) =>
    route.pattern.includes('/:')).map((route: any) => {
      const fallback = nextSPAConfig.fallback ? path.join('./', nextSPAConfig.fallback) : '/404.html'
      const source = getDynamicSource(route.pattern)
      return {
        source,
        destination: nextSPAConfig.exportDynamicPages ? `${route.page}.html` : fallback,
      }
    })

  return [
    ...staticRewrites,
    ...dynamicRewrites,
  ]
}

export default async function buildServeDeploymentConfig (config: any, outdir?: string) {
  const routes = config.publicRuntimeConfig.routes
  const serveRewrites = await getRewrites(routes, config)
  const serveJSONConfig = JSON.stringify({
    trailingSlash: true,
    rewrites: serveRewrites
  }, null, 2)

  await writeFileSync(path.join(outdir, '/serve.json'), serveJSONConfig, 'utf8')
  console.log(`serve.json was created in ${outdir}`)
}