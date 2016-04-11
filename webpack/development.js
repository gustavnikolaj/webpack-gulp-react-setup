const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const base = require('./base');
const babelLoader = require('./loaders/babel');

module.exports = {
    getWebpackDevServer: function (port, cb) {
        var clientConfig = base.client;

        clientConfig.entry = [
            'webpack-dev-server/client?http://localhost:' + port,
            'webpack/hot/only-dev-server',
            clientConfig.entry
        ];
        clientConfig.plugins.push(
            new webpack.HotModuleReplacementPlugin({ quiet: true })
        );

        clientConfig.output.publicPath = 'http://localhost:' + port + '/static/';

        clientConfig.module.loaders = [
            babelLoader({ reactHot: true }),
            {
                test: /\.(css|less)$/,
                loaders: ['style', 'css', 'less']
            }
        ];

        const devServer = new WebpackDevServer(webpack(clientConfig), {
            publicPath: 'http://localhost:' + port + '/static/',
            hot: true,
            quiet: true,
            noInfo: false
        });
        return devServer.listen(port, 'localhost', cb);
    },
    server: base.server
};
