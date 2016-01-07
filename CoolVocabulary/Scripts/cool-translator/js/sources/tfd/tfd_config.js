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
            en: { id: 'en', targets: ['es','pt','fr','it','de','ru']},
            es: { id: 'es', targets: ['en','pt','fr','it','de','ru']},
            pt: { id: 'pt', targets: ['en','es','fr','it','de','ru']},
            fr: { id: 'fr', targets: ['en','es','pt','it','de','ru']},
            it: { id: 'it', targets: ['en','es','pt','fr','de','ru']},
            de: { id: 'de', targets: ['en','es','pt','fr','it','ru']},
            ru: { id: 're', targets: ['en']}
        },
        priority: 7,
        domain:"http://thefreedictionary.com/",
        path:{
            templatesDir:rootDir
        },
        ajax: {
            translate: "http://{sourceLangId}.thefreedictionary.com/{word}"
        },
        contentTypes: [ContentTypes.THESAURUS,ContentTypes.DEFINITIONS,ContentTypes.VERBTABLE]
    };
};