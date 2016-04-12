module.exports = {
    path: '/',
    component: require('../components/App/App'),
    indexRoute: require('./home'),
    childRoutes: [
        require('./about')
    ]
};
