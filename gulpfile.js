var gulp = require('gulp');
var webpack = require('webpack');

var webpackConfig = require('./webpack/development');

gulp.task('default', function () {
    console.log('');
    console.log('frontend-build: build the frontend');
    console.log('');
});

/* BUILDING AND WATCHING */

function onBuild(done) {
    return function (err, stats) {
        if (err) {
            console.log('Error', err);
        } else {
            console.log(stats.toString());
        }
        if (done) {
            done();
        }
    };
}

gulp.task('client-build', function (done) {
    webpack(webpackConfig.client).run(onBuild(done));
});

gulp.task('server-build', function (done) {
    webpack(webpackConfig.server).run(onBuild(done));
});

gulp.task('build', ['client-build', 'server-build']);
