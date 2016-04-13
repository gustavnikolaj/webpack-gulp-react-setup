import {addLocaleData} from 'react-intl';

export default function localeData(locale) {
    if (locale === 'da') { return getLocaleDa(); }
    if (locale === 'en') { return getLocaleEn(); }

    // Unknown locale, return en
    return getLocaleEn();
}

function getLocaleDa() {
    return new Promise(function (resolve, reject) {
        require.ensure(['react-intl/locale-data/da', './i18n/da.json'], function () {
            addLocaleData(require('react-intl/locale-data/da'));
            return resolve(require('./i18n/da.json'));
        });
    });
};

function getLocaleEn() {
    return new Promise(function (resolve, reject) {
        require.ensure(['react-intl/locale-data/en', './i18n/en.json'], function () {
            addLocaleData(require('react-intl/locale-data/en'));
            return resolve(require('./i18n/en.json'));
        });
    });
};

export function getLocaleFromDom() {
    var reactRoot = document.getElementById('react-root');
    return reactRoot.getAttribute('data-locale') || 'en';
}
