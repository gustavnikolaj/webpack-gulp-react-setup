console.log('Remember to run `npm run i18n:populateDefaultLocale` first');

var path = require('path');
var fs = require('fs');
var Promise = require('bluebird');

var mkdirp = Promise.promisify(require('mkdirp'));
var readFile = Promise.promisify(fs.readFile);
var writeFile = Promise.promisify(fs.writeFile);

var config = require('../../app/config');

var supportedLocaleIds = config.i18n.supportedLocaleIds;
var defaultLocaleId = config.i18n.defaultLocaleId;

var projectRoot = path.resolve(__dirname, '../../');
var appRoot = path.resolve(projectRoot, 'app');
var langFolder = path.resolve(appRoot, 'i18n');
var translationJobFolder = path.resolve(projectRoot, 'translation-jobs');

var defaultLocalePath = path.resolve(langFolder, defaultLocaleId + '.json');

readFile(defaultLocalePath, 'utf-8').then(function (content) {
    var defaultLocale = JSON.parse(content);
    var locales = supportedLocaleIds.filter(function (locale) {
        return locale !== defaultLocaleId;
    });

    return Promise.map(locales, function (locale) {
        var filePath = path.resolve(langFolder, locale + '.json');
        return readFile(filePath, 'utf-8').catch(function (err) {
            if (err.code === 'ENOENT') {
                return '{}';
            }
            throw err;
        })
        .then(function (content) {
            var localeData = JSON.parse(content);

            var existingKeys = Object.keys(localeData);
            var newKeys = Object.keys(defaultLocale).filter(function (key) {
                return existingKeys.indexOf(key) === -1;
            });

            return {
                locale: locale,
                localeData: localeData,
                missingKeys: newKeys
            };
        });
    }).then(function (summary) {
        var allMissingKeys = summary.reduce(function (missingKeys, locale) {
            locale.missingKeys.forEach(function (key) {
                if (missingKeys.indexOf(key) === -1) {
                    missingKeys.push(key);
                }
            });
            return missingKeys;
        }, []);

        if (allMissingKeys.length === 0) {
            console.log('No keys to be sent to translation.');
            return;
        }

        var date = new Date();
        var month = '' + (date.getMonth() + 1);
        if (month.length === 1) { month = '0' + month; }
        var day = '' + (date.getDate());
        if (day.length === 1) { day = '0' + day; }
        var name = date.getFullYear() + month + day;

        var dest = path.resolve(translationJobFolder, name);

        var defaultLocaleJob = allMissingKeys.map(function (key) {
            return key + '=' + defaultLocale[key];
        }).join('\n');
        var defaultFile = path.resolve(dest, defaultLocaleId + '.txt');

        return mkdirp(dest).then(function () {
            return writeFile(defaultFile, defaultLocaleJob).then(function () {
                return Promise.map(summary, function (locale) {
                    var localeId = locale.locale;
                    var jobPath = path.resolve(dest, localeId + '.txt');
                    var langPath = path.resolve(langFolder, localeId + '.json');

                    var job = allMissingKeys.map(function (key) {
                        if (typeof locale.localeData[key] === 'undefined') {
                            locale.localeData[key] = null;
                            return key + '=';
                        } else if (!locale.localeData[key]) {
                            return false;
                        }
                        return key + '=';
                    }).filter(function (key) { return key; }).join('\n');

                    return writeFile(jobPath, job).then(function () {
                        var data = JSON.stringify(locale.localeData, false, 2) + '\n';
                        return writeFile(langPath, data);
                    });
                });
            });
        }).then(function () {
            console.log('created new translation job:');
            console.log(dest);
        });
    });
});
