'use strict';

import ContentTypes from '../common/content-types';
const rootDir = 'cooltranslator/js/abby/';
 
export default {
    id: "abby",
    name: "Abby Lingvo",
    languages:{
        en: { targets: ['ru'] },
        ru: { targets: ['en'] }
    },
    priority: 9,
    domain: "http://www.lingvo-online.ru",
    path: {
        templatesDir: rootDir
    },
    ajax: {
        translate: "http://www.lingvo-online.ru/en/Translate/{sourceLang}-{targetLang}/{word}",
        phrases: "http://www.lingvo-online.ru/en/Phrases/{sourceLang}-{targetLang}/{word}",
        examples: "http://www.lingvo-online.ru/en/Examples/{sourceLang}-{targetLang}/{word}"
    },
    contentTypes: [ContentTypes.TRANSLATIONS, ContentTypes.EXAMPLES, ContentTypes.PHRASES]
}
