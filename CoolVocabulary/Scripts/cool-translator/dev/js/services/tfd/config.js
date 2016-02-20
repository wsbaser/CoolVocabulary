'use strict';

import ContentTypes from '../common/content-types';

const rootDir = 'cooltranslator/js/thefreedictionary/';

export default {
    id: "tfd",
    name: "TheFreeDictionary.com",
    languages: {
        en: {
            id: 'en',
            targets: ['es', 'pt', 'fr', 'it', 'de', 'ru', 'ar', 'pl']
        },
        es: {
            id: 'es',
            targets: ['en', 'pt', 'fr', 'it', 'de', 'ru', 'ar', 'pl']
        },
        pt: {
            id: 'pt',
            targets: ['en', 'es', 'fr', 'it', 'de', 'ru', 'ar', 'pl']
        },
        fr: {
            id: 'fr',
            targets: ['en', 'es', 'pt', 'it', 'de', 'ru', 'ar', 'pl']
        },
        it: {
            id: 'it',
            targets: ['en', 'es', 'pt', 'fr', 'de', 'ru', 'ar', 'pl']
        },
        de: {
            id: 'de',
            targets: ['en', 'es', 'pt', 'fr', 'it', 'ru', 'ar', 'pl']
        },
        ru: {
            id: 'ru',
            targets: ['en', 'es', 'pt', 'fr', 'it', 'de', 'ar', 'pl']
        },
        ar: {
            id: 'ar',
            targets: ['en', 'es', 'pt', 'fr', 'it', 'de', 'ru', 'pl']
        },
        pl: {
            id: 'pl',
            targets: ['en', 'es', 'pt', 'fr', 'it', 'de', 'ru', 'ar']
        }
    },
    priority: 7,
    domain: "http://thefreedictionary.com/",
    path: {
        templatesDir: rootDir
    },
    ajax: {
        translate: "http://{sourceLangId}.thefreedictionary.com/{word}"
    },
    contentTypes: [ContentTypes.THESAURUS, ContentTypes.DEFINITIONS, ContentTypes.VERBTABLE]
}