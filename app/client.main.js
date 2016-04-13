import React from 'react';
import { render } from 'react-dom';
import { Router, browserHistory } from 'react-router';
import { IntlProvider } from 'react-intl';
import routes from './routes';
import localeData, { getLocaleFromDom } from './localeData';

const locale = getLocaleFromDom();

localeData(locale).then(messages => render(
    <IntlProvider locale={locale} messages={messages}>
        <Router routes={routes} history={browserHistory} />
    </IntlProvider>,
    document.getElementById('react-root')
));

fetch('/api/ping').then(function (res) { return res.json() }).then(console.log.bind(console));
