import React from 'react';
import ReactDOM from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import { IntlProvider } from 'react-intl';
import routes from './routes';
import localeData from './localeData';

export default function renderFactory(assetConfiguration) {
    let scriptUrl = assetConfiguration.main.js;

    let stylesheet = null;
    if (assetConfiguration.main.css) {
        stylesheet = <link rel='stylesheet' href={ assetConfiguration.main.css } />;
    }

    return function render(req) {
        const locale = req.query.locale || 'en';
        return localeData(locale).then(messages => {
            return new Promise((resolve, reject) => {
                match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
                    if (error) {
                        return resolve({
                            status: 500,
                            body: error.message
                        });
                    } else if (redirectLocation) {
                        return resolve({
                            status: 302,
                            location: redirectLocation.pathname + redirectLocation.search
                        });
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
                                    <div id='react-root' data-locale={locale}>
                                        <IntlProvider locale={locale} messages={messages}>
                                            <RouterContext {...renderProps} />
                                        </IntlProvider>
                                    </div>
                                    <script src={scriptUrl}></script>
                                </body>
                            </html>
                        );

                        return resolve({
                            status: 200,
                            body: '<!doctype html>' + result
                        });
                    } else {
                        return resolve({
                            status: 404,
                            body: 'Not found'
                        });
                    }
                });
            });
        });
    };
};
