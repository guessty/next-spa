import * as React from 'react'
import getConfig from 'next/config'
//
import Loader from './pages/page-loader'
const buildRoutes = require('./build/routes')
//

const { publicRuntimeConfig = { routes: [] } } = getConfig() || {};
const { routes } = publicRuntimeConfig
const Routes = buildRoutes(routes)
const Link = Routes.Link
const Router = Routes.Router

const withSPARouter = (App: any) => class extends React.Component {
  static async getInitialProps(appContext: any) {
    const appProps = (typeof App.getInitialProps === 'function') ?
      await App.getInitialProps(appContext) : {}
    return {
      ...appProps,
    }
  }
  state = {
    isSPAPath: this.isSPAPath(),
    ready: this.isReady()
  }
  componentDidMount() {
    this.checkPath()
  }
  async checkPath() {
    const { router }: any = this.props
    if (this.isSPAPath()) {
      await Router.pushRoute(router.asPath)
      this.setState({
        isReady: true
      })
    }
  }
  isSPAPath() {
    const { router }: any = this.props
    const routes = Routes.routes.filter((route: any) => route.pattern.includes('/:'))
    const potentialMatches = routes.filter((route: any) => route.regex.test(router.asPath))
    return !!potentialMatches.length
  }
  isReady() {
    const { router }: any = this.props
    return !this.isSPAPath() && router.pathname !== '/soft-404'
  }
  render() {
    const { pageProps }: any = this.props
    const { isSPAPath, isReady }: any = this.state

    const isPageLoading = isSPAPath && !isReady

    const appProps = {
      ...this.props,
      pageProps: {
        PageLoader: Loader,
        isPageLoading,
        ...pageProps,
      }
    }

    return <App {...appProps} />
  }
}

export { Link, Router, withSPARouter }

export default Routes
