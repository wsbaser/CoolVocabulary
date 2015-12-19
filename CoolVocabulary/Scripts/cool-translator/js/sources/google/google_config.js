var GoogleConfig = function() {
    var rootDir = 'cooltranslator/js/google/';
    return {
        id: "google",
        name: "Google Translator",
        languages: {
            en: { targets: ['es','pt','fr','it','de','ru']},
            es: { targets: ['en','pt','fr','it','de','ru']},
            pt: { targets: ['en','es','fr','it','de','ru']},
            fr: { targets: ['en','es','pt','it','de','ru']},
            it: { targets: ['en','es','pt','fr','de','ru']},
            de: { targets: ['en','es','pt','fr','it','ru']},
            ru: { targets: ['en']}
        },
        priority: 8,
        domain:"https://translate.google.com",
        path:{
            templatesDir:rootDir
        },
        ajax: {
            translate: "https://translate.google.ru/translate_a/single?client=t&sl={sourceLang}&tl={targetLang}&hl=en&dt=bd&dt=ex&dt=ld&dt=md&dt=qc&dt=rw&dt=rm&dt=ss&dt=t&dt=at&ie=UTF-8&oe=UTF-8&otf=1&srcrom=0&ssel=0&tsel=0&tk=519929|159183&q={word}"
            //translate: "https://translate.google.ru/translate_a/single?client=t&sl={sourceLang}&tl={targetLang}&hl=ru&dt=bd&dt=ex&q={word}"
            //translate: "https://translate.google.ru/translate_a/single?client=t&sl={sourceLang}&tl={targetLang}&hl=ru&dt=bd&dt=ex&q={word}"
        },
        contentTypes: [ContentTypes.TRANSLATIONS, ContentTypes.DEFINITIONS, ContentTypes.EXAMPLES]
    };
};