
import getConfig from 'next/config'
//
const buildRoutes = require('./build/routes')
//

const { publicRuntimeConfig = { routesConfig: [] } } = getConfig() || {};
const { routes } = publicRuntimeConfig
const Routes = buildRoutes(routes)
const Link = Routes.Link
const Router = Routes.Router

export { Link, Router }

export default Routes
