var path = require('path');
var fs = require('fs');
var Promise = require('bluebird');

var glob = Promise.promisify(require('glob'));
var readFile = Promise.promisify(fs.readFile);

module.exports = function loadI18nFiles(folderPath) {
    return glob(path.resolve(folderPath, '*.json')).then(function (files) {
        return Promise.reduce(files, function (result, file) {
            var shortFileName = file.replace(folderPath + '/', '');
            return readFile(file, 'utf-8').then(function (content) {
                return JSON.parse(content);
            }).then(function (languageKeys) {
                result[shortFileName] = languageKeys;
                return result;
            });
        }, {});
    });
};
