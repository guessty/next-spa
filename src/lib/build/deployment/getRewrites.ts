import * as path from 'path'

export const getDynamicSource = (route: any) => {
  const splitRoute = route.split('/')
  return splitRoute.map((element: any) => {
    return element.includes(':') ? '**' : element
  }).join('/')
}

export default async (routes: any, config: any) => {
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
      const fallback = nextSPAConfig.fallback ? `/${nextSPAConfig.fallback}` : '/404.html'
      const source = getDynamicSource(route.pattern)
      return {
        source,
        destination: nextSPAConfig.exportDynamicPages ? `${route.page}.html` : fallback,
      }
    })

  return {
    staticRewrites,
    dynamicRewrites,
  }
}