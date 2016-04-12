# Todo

- [x] basic webpack setup
- [x] hot module reloading
- [x] babel loader for server that ignores node_modules **1**
- [x] nodemon reloading the server when either server files or the server bundle changes
- [x] load less / css in the app folder and get them inserted in head as style tags in development
- [x] less / css should be hot reloadable in development
- [x] loaded css should be concatenated into a styles.css when building for production
- [x] load images in the app folder and get the path
- [x] images loaded should have their hash as the name
- [x] concatenated css should have the hash of the file as the name (resolving the name in https://github.com/gustavnikolaj/webpack-gulp-react-setup/blob/master/app/server.main.js)
- [x] the hash of the client bundle should be part of its name (resolving the name in https://github.com/gustavnikolaj/webpack-gulp-react-setup/blob/master/app/server.main.js)
- [x] add source maps
- [x] autoprefixer for css/less
- [x] tests of bundled code running in straight mocha

## Bonus points

- [x] split the bundle and load other parts of the bundle on navigation ( [react-router-docs](https://github.com/reactjs/react-router/blob/master/docs/guides/DynamicRouting.md) - [example](https://github.com/ryanflorence/example-react-router-server-rendering-lazy-routes) ) **2**
- [ ] integration with react-intl
- [x] react story book
- [ ] css modules ([react-css-modules](https://github.com/gajus/react-css-modules) - [css-loader](https://github.com/webpack/css-loader#css-modules) - github.com/css-modules/css-modules/issues/9)

## Note 1: node_modules ignored in server bundle

It means that any modules you require from the app folder must be `dependencies`
not `devDependencies`. Webpack loaders and build time stuff can all be
`devDependencies`.

## Note 2: consider splitting "containers" as routes

As done here: https://github.com/reactjs/react-router/tree/master/examples/huge-apps/
