import * as React from 'react'
import App, { Container } from 'next/app'
//
import { withSPARouter } from './../routes'

export default withSPARouter(
  class extends App {
    static async getInitialProps({ Component, ctx }: any) {
      let pageProps = {}
  
      if (Component.getInitialProps) {
        pageProps = await Component.getInitialProps(ctx)
      }
  
      return { pageProps }
    }
  
    render () {
      const { Component, pageProps } = this.props
  
      return (
        <Container>
          <Component {...pageProps} />
        </Container>
      )
    }
  }
)