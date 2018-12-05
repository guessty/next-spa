import * as React from 'react'
import getConfig from 'next/config'
//
import Loader from './pageLoader'
const buildRoutes = require('./../build/routes')
//

export default (App: any) => class extends React.Component {
  static async getInitialProps(appContext: any) {
    const appProps = (typeof App.getInitialProps === 'function') ?
      await App.getInitialProps(appContext) : {}

    return {
      ...appProps,
    }
  }
  state = {
    ready: this.isReady()
  }
  componentDidMount() {
    this.checkPath()
  }
  async checkPath() {
    const { router }: any = this.props
    if (this.isSPAPath()) {
      await router.pushRoute(router.asPath)
      this.setState({
        isReady: true
      })
    }
  }
  isSPAPath() {
    const { publicRuntimeConfig: { routes } } = getConfig()
    const Routes = buildRoutes(routes)
    const { router }: any = this.props
    const staticRoutes = Routes.routes.filter((route: any) => !route.pattern.includes('/:'))
    const potentialStaticMatches = staticRoutes.filter((route: any) => route.regex.test(router.asPath))
    if (potentialStaticMatches.length) {
      return false;
    }
    const dynamicRoutes = Routes.routes.filter((route: any) => route.pattern.includes('/:'))
    const potentialDynamicMatches = dynamicRoutes.filter((route: any) => route.regex.test(router.asPath))
    return !!potentialDynamicMatches.length
  }
  isReady() {
    const { router }: any = this.props
    return !this.isSPAPath() && router.pathname !== '/404'
  }
  render() {
    const { pageProps }: any = this.props
    const { isReady }: any = this.state
    const isPageLoading = this.isSPAPath() && !isReady

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
