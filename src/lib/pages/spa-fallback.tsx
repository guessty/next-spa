import * as React from 'react'
import Routes, { Router } from './../routes'
//
import Loader from './page-loader'

interface IClientRedirectProps {
  pageLoader?: React.PureComponent
}

export default class extends React.PureComponent<IClientRedirectProps> {
  componentDidMount() {
    const routes = Routes.routes
    const asPath = Router.asPath
    const potentialMatches = routes.filter((route: any) => route.regex.test(asPath))
    if (potentialMatches.length) {
      Router.pushRoute(asPath)
    } else {
      Router.pushRoute('/')
    }
  }

  render() {
    const { pageLoader } = this.props
    return pageLoader ? (pageLoader) : (
      <Loader />
    )
  }
}
