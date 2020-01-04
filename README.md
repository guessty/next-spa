# next-spa

SPA functionality with dynamic file-system routing for NextJS


## Aim

This project was created with one simple goal in mind:

"To add dynamic route handling to static sites built with NextJS"


## Features

1) Dynamic file-system routing. __You can even make use of this if you're developing an SSR app!__

2) Client-side SPA route handling of dynamic routes.

3) Generate hosting config for serve.js and Now.sh 


## How to use


### Installation:

1) `npm i --save next-spa` or `yarn add next-spa`

2) Add `next-spa` dev script to package.json: `"spa:dev": "next-spa dev"`


### Add 'withSPA' to 'next.config.js':

```javascript
const withSPA = require('next-spa').withSPA

module.exports = withSPA({
  ...your-config...
})
```

### SPA fallback - 404.html:

By default `next-spa` is configured to export a `404.html` file as the default SPA fallback. This fallback file handles the client redirecting for your dynamic routes.

You can change the name of the fallback file in your `next.config.js` file:

```javascript
const withSPA = require('next-spa').withSPA

module.exports = withSPA({
  ...your-config...,
  nextSPA: {
    fallback: 'spa-fallback.html'
  }
})
```

### Add 'withSPARouter' to 'pages/_app.js':

Create custom `_app.js` file and connect the SPA Router. This file will also be required if you wish to use a custom PageLoader (see next step).

```javascript
import App, { Container } from 'next/app'
import { withSPARouter } from 'next-spa/router'

class _App extends App {
  render () {
    const { Component, pageProps } = this.props

    return (
      <Container>
        <Component {...pageProps} />
      </Container>
    )
  }
}

export default withSPARouter(_App)
```

### Custom 'PageLoader':

`next-spa` comes with a default PageLoader that is displayed on dynamic routes while the client is loading.

You can override the default PageLoader in `_app.js`:

```javascript
import App, { Container } from 'next/app'
import { withSPRouter } from 'next-spa/router'

import MyCustomLoader from '../components/MyCustomLoader'

class _App extends App {
  static async getInitialProps({ Component, ctx }) {
    ...
  }
  render() {
    const { Component, pageProps } = this.props
    return (
      <Container>
        <Component {...pageProps} PageLoader={MyCustomLoader} />
      </Container>
    )
  }
}

export default withSPARouter(_App)
```


### Add your first dynamic route:

Dynamic file-system routes require their names to be prefixed with an underscore (`_`) eg:

```bash
- pages
  |
  - index.js
  |
  - products
    |
    - _id.js

```

The file name that you use will be the key that gets passed to the `query` object at runtime.

**Note:**
For static sites, the slug value (or `id` in the above example) won't be available in the query object until the component has mounted on the client. 


### Replace next/link & next/router

Under the hood `next-spa` uses `next-routes` for its dynamic routing; also exposing the `Link` and `Router` apis. 

Be sure to replace any `next/link` or `next/router` import with `next-spa/link` or `next-spa/router` equivalent.

Refer to the `next-routes` documentation for guidence on `Link` and `Router`.


### Run the dev environment:

To run a dev environment you have to replace your the `next dev` command with `next-spa dev`.

**Note:**
If you are using `next-spa` in a SSR app you will also need to replace the `next start` command with `next-spa start`.

**Note:**
If you are using a custom server then you will also need to add `next-spa` configutation your server file:

```javascript
const express = require('express')
const nextSPA = require('next-spa').default  // Replace require('next').

const dev = process.env.NODE_ENV !== 'production'
const port = parseInt(process.env.PORT, 10) || 3000
const app = nextSPA({ dev })  // And use nextSPA instead to create the app.
const handler = app.getRequestHandler()

app.prepare()
  .then(() => {
    const server = express()

    server.get('*', (req, res) => {
      return handler(req, res)
    })

    server.listen(port, (err) => {
      if (err) throw err
      console.log(`> Ready on http://localhost:${port}`)
    })
  })
```


### Build and Export your app:

You can still use the same NextJS commands to build (`next build`) and export (`next export`) your app.


### Serve you app:

We recommend using `serve.js` to serve your static site locally.

Install: `npm i -g serve`

Add Script: `"serve": "cd <path-to-export> && serve"`


### Hosting rewrites:

Generally you will need to configure rewrites with you hosting provider, but if you are using `serve.js` to serve your site locally then you can use `next-spa` to genterate a `serve.json` rewrites file.

By default all dynamic routes are rewritten to point to the SPA fallback file.

Command:
`next-spa create-serve-config`

Command options:
- `-o <outdir>` __Should be the path to your exported site__

**Note:**
The same config file can also be used if you are deploying serverlessly through Now.sh


### Export dynamic page:

You can also optionally export static versions of your dynamic pages as well.

These exported pages will contain the same spa functionality as your fallback file allowing you to use rewrites to point your dynamic routes to these files instead.

You can enable dynamic page exports through your `next.config.js` file.

```javascript
const withSPA = require('next-spa').withSPA

module.exports = withSPA({
  ...yourNextConfig,
  nextSPA: {
    fallback: 'spa-fallback.html',
    exportDynamicPages: true,
  }
})
```

**Note:**
If using the `next-spa create-serve-config` to create `serve.js` rewrites, `next-spa` will automatically configure your dynamic routes to point to their associated page.
