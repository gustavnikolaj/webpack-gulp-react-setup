var path = require('path');
var fs = require('fs');
var Promise = require('bluebird');

var glob = Promise.promisify(require('glob'));
var readFile = Promise.promisify(fs.readFile);

module.exports = function loadTranslationJobFiles(folderPath) {
    return glob(path.resolve(folderPath, '*.txt')).then(function (files) {
        return Promise.reduce(files, function (result, file) {
            var shortFileName = file
                .replace(folderPath + '/', '')
                .replace('.txt', '');
            return readFile(file, 'utf-8').then(function (content) {
                var languageKeys = content.split('\n').reduce(function (keys, line) {
                    if (line === '') {
                        return keys;
                    }

                    var match = line.match(/^([^=]*)=(.*)$/);
                    if (!match) {
                        throw new Error('Invalid language file: ' + file);
                    }

                    var id = match[1];
                    var value = match[2];

                    keys[id] = value;

                    return keys;
                }, {});
                result[shortFileName] = languageKeys;
                return result;
            });
        }, {});
    });
};
