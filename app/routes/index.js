import App from '../components/App/App';

import homeRoute from './home';
import aboutRoute from './about';

export default {
    path: '/',
    component: App,
    indexRoute: homeRoute,
    childRoutes: [
        aboutRoute
    ]
};
