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

  routes.forEach((route: any) => {
    if (route.pattern.includes('/:')) {
      const source = getDynamicSource(route.pattern)
      const nextSPAConfig = config.nextSPA || {}
      const fallback = nextSPAConfig.fallback ? path.join('.', nextSPAConfig.fallback) : '/404.html';
      dynamicRewrites.push({
        source,
        destination: fullRewrite ? `/_next-spa${route.page}.html` : fallback
      })
    } else {
      const source = route.pattern
      staticRewrites.push({
        source,
        destination: `${route.page}.html`,
      })
    }
  })

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