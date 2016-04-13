module.exports = function jsonLoaderFactory() {
    return {
        test: /\.json$/i,
        loader: 'json'
    };
};
