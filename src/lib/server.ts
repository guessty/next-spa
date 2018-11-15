const express = require('express')
//
import buildServer from './build/server'

export default (opts: any, port: number, hostname: 'string') => {
  const app = buildServer(opts)
  const handler = app.getRequestHandler()

  app.prepare()
    .then(() => {
      const server = express()

      server.get('*', (req: any, res: any) => {
        return handler(req, res)
      })

      server.listen(port, hostname, (err: any) => {
        if (err) throw err
        console.log(`> Ready on http://${hostname ? hostname : 'localhost'}:${port}`)
      })
    })
    .catch((error: any) => {
      console.log('error', error)
    })
}
