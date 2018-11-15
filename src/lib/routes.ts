import getConfig from 'next/config'
//
import withSPARouter from './components/withSPARouter'
const buildRoutes = require('./build/routes')
//

const { publicRuntimeConfig = { routes: [] } } = getConfig() || {};
const { routes } = publicRuntimeConfig
const Routes = buildRoutes(routes)
const Link = Routes.Link
const Router = Routes.Router

export { Link, Router, withSPARouter }

export default Routes
