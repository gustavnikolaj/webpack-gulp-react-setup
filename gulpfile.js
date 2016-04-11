var gulp = require('gulp');
var path = require('path');
var webpack = require('webpack');
var nodemon = require('nodemon');

var webpackConfig = require('./webpack/development');

gulp.task('default', function () {
    console.log('');
    console.log('frontend-build: build the frontend');
    console.log('');
});

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
    webpack(webpackConfig.client).run(onBuild('client-build', done));
});

gulp.task('server-build', function (done) {
    webpack(webpackConfig.server).run(onBuild('server-build', done));
});

gulp.task('build', ['client-build', 'server-build']);

gulp.task('client-watch', function () {
    webpack(webpackConfig.client).watch(100, onBuild('client-watch'));
});

gulp.task('server-watch', function () {
    webpack(webpackConfig.server).watch(100, function (err, stats) {
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
