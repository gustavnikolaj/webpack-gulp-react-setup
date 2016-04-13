var path = require('path');
var fs = require('fs');
var Promise = require('bluebird');

var readFile = Promise.promisify(fs.readFile);
var writeFile = Promise.promisify(fs.writeFile);
var mkdirp = Promise.promisify(require('mkdirp'));

var findWarnings = require('./lib/findWarnings');
var loadSrcFiles = require('./lib/loadSrcFiles');
var createDefaultLocale = require('./lib/createDefaultLocale');
var config = require('../../config/config');

var defaultLocaleId = config.i18n.defaultLocaleId;

var projectRoot = path.resolve(__dirname, '../../');
var srcFilesDir = path.resolve(projectRoot, 'build/messages');
var localeFile = path.resolve(projectRoot, 'app/i18n/' + defaultLocaleId + '.json');

mkdirp(path.dirname(localeFile)).then(function () {
    loadSrcFiles(srcFilesDir).then(function (srcFiles) {
        return readFile(localeFile, 'utf-8').catch(function (err) {
            if (err.code === 'ENOENT') {
                // File didn't exist, return empty object
                return '{}';
            }
            throw err;
        }).then(function (rawDefaultLocale) {
            var defaultLocale = JSON.parse(rawDefaultLocale);
            var warnings = findWarnings({
                source: srcFiles,
                defaultLocale: defaultLocale
            });

            if (warnings) {
                console.log('Found conflicts. Run the following command and resolve any conflicts.');
                console.log('  $ npm run i18n:checkLanguageKeys');
                console.log('And then try again...');
                process.exit(1);
            }

            var newDefaultLocale = createDefaultLocale(srcFiles);
            var newRawDefaultLocale = JSON.stringify(newDefaultLocale, false, 2) + '\n';
            if (rawDefaultLocale === newRawDefaultLocale) {
                console.log('No changes');
            } else {
                return writeFile(localeFile, newRawDefaultLocale).then(function () {
                    console.log('Wrote new %s', localeFile);
                });
            }
        });
    });
});
