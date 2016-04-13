module.exports = function (input) {
    input = input || {};
    var source = input.source;
    var defaultLocale = input.defaultLocale;

    var warnings = [];

    Object.keys(source).forEach(function (file) {
        source[file].forEach(function (item) {
            var id = item.id;
            var defaultMessage = item.defaultMessage;

            if (defaultLocale[id] && defaultMessage !== defaultLocale[id]) {
                warnings.push({
                    file: file,
                    id: id,
                    source: defaultMessage,
                    defaultLocale: defaultLocale[id]
                });
            }
        });
    });

    if (warnings.length > 0) {
        return warnings;
    }
    return null;
};
