import { writeFileSync } from 'fs'
import * as path from 'path'
//
import getRewrites from './getRewrites'
//

export default async function buildServeDeploymentConfig (config: any, outdir?: string) {
  const routes = config.publicRuntimeConfig.routes
  const { staticRewrites, dynamicRewrites } = await getRewrites(routes, config)
  const serveJSONConfig = JSON.stringify({
    trailingSlash: true,
    rewrites: [
      ...staticRewrites,
      ...dynamicRewrites,
    ]
  }, null, 2)

  await writeFileSync(path.join(outdir, '/serve.json'), serveJSONConfig, 'utf8')
  console.log(`serve.json was created in ${outdir}`)
}