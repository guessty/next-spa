# next-spa

SPA support for NextJS - as well as a few other useful features.

## What, but why?!

NextJS is awesome when it comes to creating server rendered apps, but for me there are a few things missing when using NextJS as a static exporter.

This package builds on the export functionailty by providing 2 core features:

1) Dynamic directory based routing, based on `next-routes`.

2) Client-side SPA style handling of any dynamic routes.

`next-spa` also comes with some bonus features:

3) A simple global store using `unstated`.

## Installation

1) `npm i --save next-spa` or `yarn add next-spa`

2) Add scripts to package.json
  a) `"spa:dev": "next-spa dev"`
  ) `"spa:build": "next-spa build"`

2) `create-next-firebase <my-app>`

3) `cd <my-app>`

4) `yarn start`
