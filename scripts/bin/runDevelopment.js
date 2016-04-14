const taggedLog = require('../lib/taggedLog');
const path = require('path');
const webpack = require('webpack');
const webpackConfig = require('../../config/webpack/development');
const serverConfig = webpackConfig.server;
const getDevServer = webpackConfig.getWebpackDevServer;
const WatchedProcess = require('../lib/WatchedProcess');

const serverLog = taggedLog('server');
const devServerLog = taggedLog('client dev server');
const serverBundle = taggedLog('server bundle');
const watchLog = taggedLog('server watch');

const serverRoot = path.resolve(__dirname, '../../server');
const watched = new WatchedProcess({
    command: 'node',
    args: [ path.resolve(serverRoot, 'app.js') ],
    watchDirectory: serverRoot
});

watched.on('output', function (output) {
    if (Buffer.isBuffer(output)) {
        output = output.toString('utf-8').trim();
    }
    if (/^(Monitored|Watched)Process: ?/.test(output)) {
        return watchLog(output.replace(/^(Monitored|Watched)Process: ?/, ''));
    }
    return serverLog(output);
});

process.on('SIGINT', function () {
    watched.stop(function () {
        watched.removeAllListeners();
        console.log('');
        process.exit(0);
    });
});

// START THE WEBPACK DEVELOPMENT SERVER HOSTING THE HOT MODULE RELOADING BUNDLE
getDevServer(function (err) {
    devServerLog(err || 'webpack dev server running');
});

// START THE WEBPACK BUNDLER FOR THE SERVER BUNDLE
var started = false;
serverBundle('starting initial build');
webpack(serverConfig).watch(100, function (err, stats) {
    var duration = stats.endTime - stats.startTime;
    if (started) {
        serverBundle('rebuilt in ' + duration + 'ms');
        return watched.restart();
    }
    // Start the server after first build, to avoid immediate restart
    serverBundle('initial build completed in ' + duration + 'ms');
    started = true;
    watched.start();
});
