/**
 * Created by wsbaser on 25.04.2015.
 */
// ==UserScript==
// @name TfdConfig
// @all-frames true
// @include http://*
// @include https://*
// @exclude http*://*facebook.com/plugins/*
// @exclude http*://*twitter.com/widgets/*
// @exclude http*://plusone.google.com/*
// ==/UserScript==

var TfdConfig = function() {
    var rootDir = 'cooltranslator/js/thefreedictionary/';
    return {
        id: "tfd",
        name: "TheFreeDictionary.com",
        languages: {
            en: { targets: ['es','pt','fr','it','de','ru']},
            es: { targets: ['en','pt','fr','it','de','ru']},
            pt: { targets: ['en','es','fr','it','de','ru']},
            fr: { targets: ['en','es','pt','it','de','ru']},
            it: { targets: ['en','es','pt','fr','de','ru']},
            de: { targets: ['en','es','pt','fr','it','ru']},
            ru: { targets: ['en']}
        },
        priority: 7,
        domain:"http://www.thefreedictionary.com/",
        path:{
            templatesDir:rootDir
        },
        ajax: {
            translate: "http://www.thefreedictionary.com/{word}"
        },
        contentTypes: [ContentTypes.THESAURUS,ContentTypes.DEFINITIONS,ContentTypes.VERBTABLE]
    };
};