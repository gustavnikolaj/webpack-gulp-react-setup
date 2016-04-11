const path = require('path');
const webpack = require('webpack');
const ExternalsPlugin = require('webpack-externals-plugin');

const projectRoot = path.resolve(__dirname, '..');
const nodeModulesPath = path.resolve(projectRoot, 'node_modules');
const appRoot = path.resolve(projectRoot, 'app');
const buildRoot = path.resolve(projectRoot, 'build');

const loaders = {
    babel: {
        test:   /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
        babelrc: path.resolve(projectRoot, '.babelrc'),
        include: appRoot
    }
};

module.exports = {
    client: {
        name: 'client',
        entry: path.resolve(appRoot, 'client.main.js'),
        output: {
            path: buildRoot,
            filename: 'bundle.js',
            publicPath: '/static/'
        },
        module: {
            loaders: [
                loaders.babel
            ]
        }
    },
    server: {
        name: 'server',
        target: 'node',
        entry: path.resolve(appRoot, 'server.main.js'),
        output: {
            path: buildRoot,
            filename: 'bundle.server.js',
            libraryTarget: 'commonjs2'
        },
        module: {
            loaders: [
                loaders.babel
            ]
        },
        plugins: [
            new webpack.IgnorePlugin(/\.(css|less)$/),
            new webpack.BannerPlugin('require("source-map-support").install();', { raw: true, entryOnly: false }),
            new ExternalsPlugin({ type: 'commonjs', include: nodeModulesPath })
        ]
    }
};
