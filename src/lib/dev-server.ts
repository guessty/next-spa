import * as path from 'path'
const express = require('express')
const next = require('next')
//
import buildRoutes from './build/routes'

export default async (currentPath: string, config: any) => {
  const devDistDir = path.join(currentPath, 'tmp')
  const nextDir = path.join(currentPath, config.dir)
  const devNextDistDir = path.relative(nextDir, devDistDir)
  const routes = await buildRoutes(config.publicRuntimeConfig.routes)
  const port = parseInt(process.env.PORT, 10) || 3000
  const app = next({
    dev: true,
    dir: config.dir,
    conf: {...config, distDir: devNextDistDir},
  })
  const handler = routes.getRequestHandler(app)

  app.prepare()
    .then(() => {
      const server = express()

      server.get('*', (req: any, res: any) => {
        return handler(req, res)
      })

      server.listen(port, (err: any) => {
        if (err) throw err
        console.log(`> Ready on http://localhost:${port}`)
      })
    })
    .catch((error: any) => {
      console.log('error', error)
    })
}
