const express = require('express');
const path = require('path');
const serverRender = require('../build/bundle.server.js')(require('../build/assets.json'));

const buildPath = path.resolve(__dirname, '../build');

const app = express();

app.use('/static', express.static(buildPath));

app.use('/api/ping', function (req, res) {
    return res.status(200).send({ message: 'OK' });
});

app.use(function (req, res, next) {
    return serverRender(req).then(result => {
        if (result.status === 200) {
            res.contentType('text/html');
            res.end(result.body);
        } else if (result.status === 302) {
            res.redirect(302, result.location);
        } else {
            res.status(result.status).send(result.body);
        }
    }).catch(next);
});

app.listen(3000, function () {
    console.log('listening on port 3000');
});
