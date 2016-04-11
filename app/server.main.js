import React from 'react';
import ReactDOM from 'react-dom/server';
import Application from './Application';

let scriptUrl = '/static/bundle.js';
let stylesheet = null;
if (process.env.WEBPACK_DEV_SERVER_URL) {
    scriptUrl = process.env.WEBPACK_DEV_SERVER_URL + scriptUrl;
} else {
    stylesheet = (<link rel='stylesheet' href='/static/styles.css' />);
}

export default function render(req) {
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
}
