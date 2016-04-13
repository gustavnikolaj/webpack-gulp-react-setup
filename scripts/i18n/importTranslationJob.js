var path = require('path');
var fs = require('fs');
var Promise = require('bluebird');

var writeFile = Promise.promisify(fs.writeFile);
var loadI18nFiles = require('./lib/loadI18nFiles');
var loadTranslationJobFiles = require('./lib/loadTranslationJobFiles');

var args = process.argv.slice(2);

if (args.length !== 1) {
    throw new Error('You need to provide exactly one argument');
}

var projectRoot = path.resolve(__dirname, '../../');
var cwd = process.cwd();
var importDir = path.resolve(cwd, args[0]);
var langFolder = path.resolve(projectRoot, 'app/i18n');

try {
    if (!fs.statSync(importDir).isDirectory()) {
        throw new Error('Not a directory');
    }
} catch (e) {
    throw new Error('You must give the path to a directory.');
}

loadI18nFiles(langFolder).then(function (i18nFiles) {
    console.log(i18nFiles);
    return loadTranslationJobFiles(importDir).then(function (translationJob) {
        Object.keys(translationJob).forEach(function (locale) {
            var localeFile = locale + '.json';

            if (!i18nFiles.hasOwnProperty(localeFile)) {
                i18nFiles[localeFile] = {};
            }

            Object.keys(translationJob[locale]).forEach(function (key) {
                i18nFiles[localeFile][key] = translationJob[locale][key];
            });
        });

        return Promise.map(Object.keys(i18nFiles), function (file) {
            var filePath = path.resolve(langFolder, file);
            var content = JSON.stringify(i18nFiles[file], false, 2) + '\n';
            return writeFile(filePath, content);
        });
    });
}).then(function () {
    console.log('Done!');
});
