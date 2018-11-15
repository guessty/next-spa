import { writeFileSync } from 'fs'
import path from 'path'
const requireFoolWebpack = require('require-fool-webpack')

export default async function buildDeploymentConfig (config: any) {

  const getDynamicSource = (route: any) => {
    const splitRoute = route.split('/')
    return splitRoute.map((element: any) => {
      return element.includes(':') ? '**' : element
    }).join('/')
  }

  const getRewrites = async () => {
    const staticRewrites: any = []
    const dynamicRewrites: any = []

    config.routes.forEach((route: any) => {
      if (route.pattern.includes('/:')) {
        const source = getDynamicSource(route.pattern)

        if (config.nextSPA.fallback)

        dynamicRewrites.push({
          source,
          destination: `/_next-spa${route.page.replace('/_', '/:')}/index.html`
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

    return {
      staticRewrites,
      dynamicRewrites,
    }
  }

}