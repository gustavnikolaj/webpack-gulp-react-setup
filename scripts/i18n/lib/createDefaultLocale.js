module.exports = function createDefaultLocale(srcFiles) {
    var defaultLocale = {};

    Object.keys(srcFiles).forEach(function (file) {
        var keys = srcFiles[file];

        keys.forEach(function (key) {
            defaultLocale[key.id] = key.defaultMessage;
        });
    });

    return defaultLocale;
};
