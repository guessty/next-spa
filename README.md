# next-spa

Extends NextJS' export functionailty allowing you to create statically generate apps with SPA style handling of dynamic routes.


## Installation

1) `npm i --save next-spa` or `yarn add next-spa`

2) Add scripts to package.json
  a) `"spa:dev": "next-spa dev"`


## Features

1) Dynamic file-system routing.

2) Client-side SPA style handling for dynamic routes.


### Dynamic file-system routing

Under the hood `next-spa` uses `next-routes` to enable dynamic routing.

`next-spa` takes this one step further and enables dynamic routing using the `/pages` file system.

To add a dymanic route simply prefix the file name with an `_` e.g:

-- /pages
  -- /index.js
  -- /user
    -- /_id.js
  


