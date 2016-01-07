var LingueeConfig = function() {
    var rootDir = 'cooltranslator/js/linguee/';
    return {
        id: "linguee",
        name: "Linguee Dictionary",
        languages: {
            en: { id: 'english',      targets: ['es','pt','fr','it','de','ru']},
            es: { id: 'spanish',      targets: ['en','pt','fr','it','de']},
            pt: { id: 'portuguese',   targets: ['en','es','fr','it','de']},
            fr: { id: 'french',       targets: ['en','es','pt','it','de']},
            it: { id: 'italian',      targets: ['en','es','pt','fr','de']},
            de: { id: 'german',       targets: ['en','es','pt','fr','it']},
            ru: { id: 'russian',      targets: ['en']}
        },
        priority: 18,
        domain:"https://linguee.com",
        path:{
            templatesDir:rootDir
        },
        ajax: {
            translate: "http://www.linguee.com/{sourceLangId}-{targetLangId}/search?source={sourceLangId}&query={word}"
        },
        contentTypes: [ContentTypes.TRANSLATIONS, ContentTypes.PHRASES],
    };
};