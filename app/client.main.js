import React from 'react';
import { render } from 'react-dom';
import { Router, browserHistory } from 'react-router';
import routes from './routes';

render(
    <Router routes={routes} history={browserHistory} />,
    document.getElementById('react-root')
);

fetch('/api/ping').then(function (res) { return res.json() }).then(console.log.bind(console));
