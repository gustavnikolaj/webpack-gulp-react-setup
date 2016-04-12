const webpack = require('webpack');
const webpackConfig = require('../../webpack/production');
const rimraf = require('rimraf');
const path = require('path');
const taggedLog = require('../lib/taggedLog');

const buildLog = taggedLog('build');
const clientLog = taggedLog('client build');
const serverLog = taggedLog('server build');

const buildPath = path.resolve(__dirname, '../../build');

function prettyName(ext) {
    if (ext === '.js') { return 'JavaScript'; }
    if (ext === '.css') { return 'CSS'; }
    if (ext === '.jpg') { return 'JPEG'; }
    if (ext === '.map') { return 'Source Map'; }
    return ext;
}

function buildStatsRapport(stats) {
    var files = Object.keys(stats.compilation.assets);
    var filesByExtension = {};

    function addFileToExt(ext, name) {
        if (Array.isArray(filesByExtension[ext])) {
            return filesByExtension[ext].push(name);
        }
        filesByExtension[ext] = [name];
    }

    files.forEach(function (name) {
        var matches = name.match(/\.\w+$/);
        if (!matches) {
            return addFileToExt('no extension', name);
        }
        return addFileToExt(matches[0], name);
    });

    var longestNumber = Object.keys(filesByExtension).reduce(function (max, list) {
        return Math.max(max, list.length);
    }, 0);

    return Object.keys(filesByExtension).reduce(function (acc, ext) {
        var count = filesByExtension[ext].length;
        var strCount = '' + count;
        while (strCount.length > longestNumber) {
            strCount = ' ' + strCount;
        }
        acc.push(strCount + ' ' + prettyName(ext) + ' file' + (count === 1 ? '' : 's'));
        return acc;
    }, []);
}

function buildDuration(stats, endtime) {
    if (endtime) {
        stats = {
            startTime: stats,
            endTime: endtime
        };
    }
    var duration = stats.endTime - stats.startTime;
    return 'build completed in ' + duration + ' ms';
}

var startTime = Date.now();

buildLog('removing build folder...');
rimraf(buildPath, function (err) {
    if (err) {
        return buildLog(err);
    }
    clientLog('building client bundle...');
    webpack(webpackConfig.client).run(function (err, stats) {
        if (err) {
            clientLog('client build errored.');
            return clientLog(err);
        }

        clientLog('client build contains:');
        buildStatsRapport(stats).forEach(function (line) {
            clientLog(line);
        });
        clientLog('client', buildDuration(stats));

        serverLog('building server bundle...');
        webpack(webpackConfig.server).run(function (err, stats) {
            if (err) {
                serverLog('server build errored.');
                return serverLog(err);
            }

            serverLog('server build contains:');
            buildStatsRapport(stats).forEach(function (line) {
                serverLog(line);
            });
            serverLog('server', buildDuration(stats));

            buildLog(buildDuration(startTime, Date.now()));
        });
    });
});
