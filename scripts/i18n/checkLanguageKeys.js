var path = require('path');
var fs = require('fs');
var Promise = require('bluebird');

var readFile = Promise.promisify(fs.readFile);

var findWarnings = require('./lib/findWarnings');
var loadSrcFiles = require('./lib/loadSrcFiles');
var config = require('../../config/config');

var defaultLocaleId = config.i18n.defaultLocaleId;

var projectRoot = path.resolve(__dirname, '../../');
var appRoot = path.resolve(projectRoot, 'app');
var srcFilesDir = path.resolve(projectRoot, 'build/messages');
var localeFile = path.resolve(appRoot, 'i18n/' + defaultLocaleId + '.json');

loadSrcFiles(srcFilesDir).then(function (srcFiles) {
    return readFile(localeFile, 'utf-8').then(function (content) {
        return JSON.parse(content);
    }).then(function (defaultLocale) {
        return findWarnings({
            source: srcFiles,
            defaultLocale: defaultLocale
        });
    }).then(function (warnings) {
        if (warnings) {
            var localePath = 'app' + localeFile.replace(appRoot, '');
            warnings.forEach(function (warning) {
                var sourceStr = warning.file + ': ' + warning.source;
                var padLength = warning.file.length - localePath.length;
                var localeStr = localePath + ': ';
                if (padLength > 0) {
                    for (var i = 0; i < padLength; i++) {
                        localeStr += ' ';
                    }
                }
                localeStr += warning.defaultLocale;
                console.log('WARN: Mismatching key with id "%s"', warning.id);
                console.log('      %s', sourceStr);
                console.log('      %s', localeStr);
            });
            process.exit(1);
            return;
        }

        console.log('No errors found.');
    });
});
