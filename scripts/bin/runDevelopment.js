const taggedLog = require('../lib/taggedLog');
const path = require('path');
const webpack = require('webpack');
const nodemon = require('nodemon');
const webpackConfig = require('../../config/webpack/development');
const serverConfig = webpackConfig.server;
const getDevServer = webpackConfig.getWebpackDevServer;

// START THE WEBPACK DEVELOPMENT SERVER HOSTING THE HOT MODULE RELOADING BUNDLE
const devServerLog = taggedLog('client dev server');
getDevServer(function (err) {
    devServerLog(err || 'webpack dev server running');
});

// START THE WEBPACK BUNDLER FOR THE SERVER BUNDLE
var nodemonRunning = false;
const serverWatchLog = taggedLog('server bundle');
serverWatchLog('starting initial build');
webpack(serverConfig).watch(100, function (err, stats) {
    var duration = stats.endTime - stats.startTime;
    if (nodemonRunning) {
        serverWatchLog('rebuilt in ' + duration + 'ms');
        return nodemon.restart();
    }
    // Start the server after first build, to avoid immediate restart
    serverWatchLog('initial build completed in ' + duration + 'ms');
    startNodemon();
});

// START NODEMON RUNNING THE WEB SERVER
const nodemonLog = taggedLog('server');
const startNodemon = function () {
    nodemonRunning = true;
    nodemonLog('starting nodemon');
    nodemon({
        execMap: { js: 'node'},
        script: path.join(__dirname, '../../server/app'),
        watch: ['server'],
        stdout: false
    })
    .on('restart', function () {
        nodemonLog('restarted');
    })
    .on('stdout', nodemonLog)
    .on('stderr', nodemonLog);
};

process.on('SIGINT', function () {
    if (!nodemonRunning) {
        return process.exit();
    }

    nodemon.once('exit', function () {
        process.exit();
    });

    nodemonLog('shutting down...');
    nodemon.emit('quit');
});
