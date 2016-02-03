'use strict';

import ContentTypes from '../common/content-types';

const rootDir = 'cooltranslator/js/multitran/';

export default {
    id: "multitran",
    name: "Multitran",
    languages: {
        en: {
            id: 1,
            targets: ['es', 'pt', 'fr', 'it', 'de', 'ru']
        },
        es: {
            id: 5,
            targets: ['en', 'pt', 'fr', 'it', 'de', 'ru']
        },
        pt: {
            id: 11,
            targets: ['en', 'es', 'fr', 'it', 'de']
        },
        fr: {
            id: 4,
            targets: ['en', 'es', 'pt', 'it', 'de']
        },
        it: {
            id: 23,
            targets: ['en', 'es', 'pt', 'fr', 'de']
        },
        de: {
            id: 3,
            targets: ['en', 'es', 'pt', 'fr', 'it']
        },
        ru: {
            id: 2,
            targets: ['en', 'es', 'fr', 'it']
        }
    },
    priority: 15,
    domain: "http://multitran.com",
    path: {
        templatesDir: rootDir
    },
    ajax: {
        translate: "http://multitran.com/m.exe?l1={sourceLangId}&l2={targetLangId}&s={word}"
    },
    contentTypes: [ContentTypes.TRANSLATIONS],
}