# Todo

- [x] basic webpack setup
- [x] hot module reloading
- [x] babel loader for server that ignores node_modules *1*
- [x] nodemon reloading the server when either server files or the server bundle changes
- [x] load less / css in the app folder and get them inserted in head as style tags in development
- [x] less / css should be hot reloadable in development
- [x] loaded css should be concatenated into a styles.css when building for production
- [x] load images in the app folder and get the path
- [x] images loaded should have their hash as the name
- [ ] concatenated css should have the hash of the file as the name (resolving the name in https://github.com/gustavnikolaj/webpack-gulp-react-setup/blob/master/app/server.main.js)
- [ ] the hash of the client bundle should be part of its name (resolving the name in https://github.com/gustavnikolaj/webpack-gulp-react-setup/blob/master/app/server.main.js)
- [ ] add source maps
- [ ] autoprefixer for css/less

## Bonus points

- [ ] split the bundle and load other parts of the bundle on navigation ( [react-router-docs](https://github.com/reactjs/react-router/blob/master/docs/guides/DynamicRouting.md) - [example](https://github.com/ryanflorence/example-react-router-server-rendering-lazy-routes) )
- [ ] integration with react-intl
- [ ] react story book
- [ ] css modules

## Note 1: node_modules ignored in server bundle

It means that any modules you require from the app folder must be `dependencies`
not `devDependencies`. Webpack loaders and build time stuff can all be
`devDependencies`.
