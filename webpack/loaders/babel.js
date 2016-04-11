const path = require('path');
const projectRoot = path.resolve(__dirname, '../..');
const appRoot = path.resolve(projectRoot, 'app');

module.exports = function babelLoaderFactory(options) {
    options = options || {};
    var loader = {
        test:   /\.js$/,
        loaders: ['babel'],
        exclude: /node_modules/,
        babelrc: path.resolve(projectRoot, '.babelrc'),
        include: appRoot
    };

    if (options.reactHot) {
        loader.loaders.unshift('react-hot');
    }

    return loader;
};
