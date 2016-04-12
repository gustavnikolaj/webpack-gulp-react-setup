const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const base = require('./base');
const babelLoader = require('./loaders/babel');
const imageLoader = require('./loaders/image');
const developmentStyleLoader = require('./loaders/developmentStyle');

module.exports = {
    getWebpackDevServer: function (cb) {
        const port = 32145;
        var clientConfig = base.client;

        // eval - Each module is executed with eval and //@ sourceURL.
        clientConfig.devtool = 'cheap-module-eval-source-map';

        clientConfig.output.filename = 'bundle.js',

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
            imageLoader(),
            developmentStyleLoader()
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
