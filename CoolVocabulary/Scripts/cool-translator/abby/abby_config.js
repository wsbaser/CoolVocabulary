/**
 * Created by wsbaser on 05.03.2015.
 */
// ==UserScript==
// @name AbbyConfig
// @all-frames true
// @include http://*
// @include https://*
// @exclude http*://*facebook.com/plugins/*
// @exclude http*://*twitter.com/widgets/*
// @exclude http*://plusone.google.com/*
// ==/UserScript==
var AbbyConfig = function() {
    var rootDir = 'cooltranslator/js/abby/';
    return {
        id: "abby",
        name: "Abby Lingvo",
        sourceLanguages: ['ru', 'en'],
        targetLanguages: ['ru', 'en'],
        priority: 9,
        domain: "http://www.lingvo-online.ru",
        path: {
            templatesDir: rootDir
        },
        ajax: {
            translate: "http://www.lingvo-online.ru/en/Translate/{sourceLang}-{targetLang}/{word}",
            phrases: "http://www.lingvo-online.ru/en/Phrases/{sourceLang}-{targetLang}/{word}",
            examples: "http://www.lingvo-online.ru/en/Examples/{sourceLang}-{targetLang}/{word}"
        }
    };
};