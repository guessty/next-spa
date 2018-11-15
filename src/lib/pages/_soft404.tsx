import * as React from 'react'
import ErrorPage from 'next/error'
//

export default class Soft404 extends React.PureComponent {
  state = {
    ready: false,
  }
  componentDidMount() {
    this.setState({
      ready: true,
    })
  }
  render() {
    const { isPageLoading, PageLoader }: any = this.props
    const { ready } = this.state

    return !isPageLoading && ready ? (
      <ErrorPage statusCode={404} />
    ) : (
      <PageLoader />
    )
  }
}
