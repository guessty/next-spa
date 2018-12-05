const nextRoutes = require('next-routes')
//

const buildRoutes = (routes: any = []) => {
  const appRoutes = nextRoutes()

  routes.filter((route: any) => !route.pattern.includes('/:'))
    .forEach((route: any) => {
      appRoutes.add({ pattern: route.pattern, page: route.page });
    })
  
  routes.filter((route: any) => route.pattern.includes('/:'))
    .forEach((route: any) => {
      appRoutes.add({ pattern: route.pattern, page: route.page });
    })

  return appRoutes
}

module.exports = buildRoutes
export default buildRoutes
