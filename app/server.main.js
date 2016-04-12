import React from 'react';
import ReactDOM from 'react-dom/server';
import Application from './Application';

export default function renderFactory(assetConfiguration) {
    let scriptUrl = assetConfiguration.main.js;

    let stylesheet = null;
    if (assetConfiguration.main.css) {
        stylesheet = <link rel='stylesheet' href={ assetConfiguration.main.css } />;
    }

    return function render(req) {
        return ReactDOM.renderToStaticMarkup(
            <html>
                <head>
                    {stylesheet}
                    <title>Hello World</title>
                </head>
                <body>
                    <div id='react-root'>
                        <Application />
                    </div>
                    <script src={scriptUrl}></script>
                </body>
            </html>
        );
    };
};
