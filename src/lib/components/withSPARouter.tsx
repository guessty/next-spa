import * as React from 'react'

import Routes, { Router } from './../routes'
import Loader from './pageLoader'


export default (App: any) => class extends React.Component {
  static async getInitialProps(appContext: any) {
    console.log('HOC Context: ', Object.keys(appContext))
    const appProps = (typeof App.getInitialProps === 'function') ?
      await App.getInitialProps(appContext) : {}

    console.log('Init App Props: ', appProps)
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

    console.log('HOC Props: ', appProps)

    return <App {...appProps} />
  }
}
