const path = require('path');
const webpack = require('webpack');
const ExternalsPlugin = require('webpack-externals-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const babelLoader = require('./loaders/babel');
const imageLoader = require('./loaders/image');

const projectRoot = path.resolve(__dirname, '..');
const nodeModulesPath = path.resolve(projectRoot, 'node_modules');
const appRoot = path.resolve(projectRoot, 'app');
const buildRoot = path.resolve(projectRoot, 'build');

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
                babelLoader(),
                imageLoader(),
                {
                    test: /\.(css|less)$/,
                    loader: ExtractTextPlugin.extract([ 'css', 'less' ])
                }
            ]
        },
        plugins: [
            new ExtractTextPlugin("styles.css")
        ]
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
                babelLoader(),
                { test: /.*\.(gif|png|jpe?g|svg)$/i, loader: 'null' },
                { test: /\.(less|css)$/, loader: 'null' }
            ]
        },
        plugins: [
            new webpack.BannerPlugin('require("source-map-support").install();', { raw: true, entryOnly: false }),
            new ExternalsPlugin({ type: 'commonjs', include: nodeModulesPath })
        ]
    }
};
