import React from 'react';
import ReactDOM from 'react-dom/server';
import Application from './Application';

export default function render(req) {
    return ReactDOM.renderToStaticMarkup(
        <html>
            <head>
                <title>Hello World</title>
            </head>
            <body>
                <div id='react-root'>
                    <Application />
                </div>
                <script src='/static/bundle.js'></script>
            </body>
        </html>
    );
}
