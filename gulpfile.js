const gulp = require('gulp');
const path = require('path');
const fs = require('fs');
const glob = require('glob');
const webpack = require('webpack');
const nodemon = require('nodemon');

gulp.task('default', ['run']);

/* BUILDING AND WATCHING */

function onBuild(target, done) {
    return function (err, stats) {
        if (err) {
            console.log('Error', err);
        } else {
            console.log(target, 'rebuilt');
            //console.log(stats.toString());
        }
        if (done) {
            done();
        }
    };
}

gulp.task('client-build', function (done) {
    const config = require('./webpack/production').client;
    webpack(config).run(onBuild('client-build', done));
});

gulp.task('server-build', function (done) {
    const config = require('./webpack/production').server;
    webpack(config).run(onBuild('server-build', done));
});

gulp.task('build', ['client-build', 'server-build']);

gulp.task('client-watch', function () {
    const getDevServer = require('./webpack/development').getWebpackDevServer;
    getDevServer(function (err) {
        if (err) {
            console.log(err);
        }
    });
});

gulp.task('server-watch', function () {
    const config = require('./webpack/development').server;
    webpack(config).watch(100, function (err, stats) {
        onBuild('server-watch')(err, stats);
        nodemon.restart();
    });
});

gulp.task('watch', ['client-watch', 'server-watch']);

gulp.task('run', ['watch'], function () {
    nodemon({
        execMap: { js: 'node'},
        script: path.join(__dirname, 'server/app'),
        watch: ['server']
    }).on('restart', function () {
        console.log('Restarted!');
    });
});

gulp.task('build-storybook', function () {
    const stories = glob.sync('app/stories/**/*.js');

    const storyIndex = stories.map(function (story) {
        return 'require("../' + story + '");\n';
    }).join('');

    fs.writeFileSync('build/stories.js', storyIndex);
});
