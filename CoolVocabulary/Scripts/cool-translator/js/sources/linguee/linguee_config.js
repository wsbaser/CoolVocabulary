var LingueeConfig = function() {
    var rootDir = 'cooltranslator/js/linguee/';
    return {
        id: "linguee",
        name: "Linguee Dictionary",
        languages: {
            en: { name: 'english',      targets: ['es','pt','fr','it','de','ru']},
            es: { name: 'spanish',      targets: ['en','pt','fr','it','de','ru']},
            pt: { name: 'portuguese',   targets: ['en','es','fr','it','de','ru']},
            fr: { name: 'french',       targets: ['en','es','pt','it','de','ru']},
            it: { name: 'italian',      targets: ['en','es','pt','fr','de','ru']},
            de: { name: 'german',       targets: ['en','es','pt','fr','it','ru']},
            ru: { name: 'russian',      targets: ['en']}
        },
        priority: 18,
        domain:"https://translate.google.com",
        path:{
            templatesDir:rootDir
        },
        ajax: {
            translate: "http://www.linguee.com/{sourceLangName}-{targetLangName}/search?source={sourceLangName}&query={word}"
        },
        contentTypes: [ContentTypes.TRANSLATIONS, ContentTypes.EXAMPLES, ContentTypes.PHRASES],
    };
};