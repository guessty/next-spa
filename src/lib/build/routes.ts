const nextRoutes = require('next-routes')
//

const buildRoutes = (routes: any = []) => {
  const appRoutes = nextRoutes()
  
  routes.forEach((route: any) => {
    appRoutes.add({ pattern: route.pattern, page: route.page });
  })

  return appRoutes
}

module.exports = buildRoutes
export default buildRoutes
