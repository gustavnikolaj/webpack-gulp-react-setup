const imageLoader = require('../webpack/loaders/image');
const developmentStyleLoader = require('../webpack/loaders/developmentStyle');

module.exports = {
    module: {
        loaders: [
            imageLoader(),
            developmentStyleLoader()
        ]
    }
};
