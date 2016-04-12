import React from 'react';
import ReactDOM from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import routes from './routes';

export default function renderFactory(assetConfiguration) {
    let scriptUrl = assetConfiguration.main.js;

    let stylesheet = null;
    if (assetConfiguration.main.css) {
        stylesheet = <link rel='stylesheet' href={ assetConfiguration.main.css } />;
    }

    return function render(req, res) {

        match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
            if (error) {
                res.status(500).send(error.message);
            } else if (redirectLocation) {
                res.redirect(302, redirectLocation.pathname + redirectLocation.search);
            } else if (renderProps) {
                // You can also check renderProps.components or renderProps.routes for
                // your "not found" component or route respectively, and send a 404 as
                // below, if you're using a catch-all route.

                var result = ReactDOM.renderToStaticMarkup(
                    <html>
                        <head>
                            {stylesheet}
                            <title>Hello World</title>
                        </head>
                        <body>
                            <div id='react-root'>
                                <RouterContext {...renderProps} />
                            </div>
                            <script src={scriptUrl}></script>
                        </body>
                    </html>
                );

                res.status(200).send(result);
            } else {
                res.status(404).send('Not found');
            }
        });
    };
};
