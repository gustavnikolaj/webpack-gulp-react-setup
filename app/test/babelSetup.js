require('babel-core/register');
require('babel-polyfill');

const stubExtensions = ['.less', '.jpg', '.png', '.gif', '.svg'];

function emptyModule(module, filename) {
    module._compile('module.exports = {};', filename);
};

stubExtensions.forEach(function (ext) {
    require.extensions[ext] = emptyModule;
});
